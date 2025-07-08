import { DocumentNumbering, DocumentNumberingDocument } from './common.entity';
import mongoose, { Model } from 'mongoose';
import * as moment from 'moment';
import { InjectModel } from '@nestjs/mongoose';
import { createClient } from 'redis';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { WorkplaceService } from 'src/core/workplace/workplace.service';
import { createCipheriv, createDecipheriv, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';

export class CommonService {
  private retryCacheConnection = 0;
  constructor(
    @InjectModel('document_numbering')
    private readonly numberingModel: Model<DocumentNumberingDocument>,
    private configService: ConfigService,
    private WorkplaceService: WorkplaceService,
  ) {}

  async createDocumentNumberingWh(
    Workplace: string,
    code: string,
    session: mongoose.ClientSession | null = null,
  ): Promise<string> {
    const result = await this.numberingModel
      .findOneAndUpdate<DocumentNumbering>(
        {
          code,
          year: moment().format('YY'),
          Workplace,
          month: moment().format('M'),
        },
        {
          $inc: {
            counter: 1,
          },
        },
        { upsert: true, returnDocument: 'after' },
      )
      .session(session);
    const Workplace_db = await this.WorkplaceService.findById(
      Workplace,
      null,
      null,
      null,
      true,
    );
    const month_enhance = `0${result.month}`.slice(-2);
    return (
      `${Workplace_db.code}-${code}-${result.year}${month_enhance}-` +
      `00000000${result.counter}`.slice(-6)
    );
  }

  async createDocumentNumbering(
    code: string,
    session: mongoose.ClientSession | null = null,
    exclude_dash = true,
  ): Promise<string> {
    const result = await this.numberingModel
      .findOneAndUpdate<DocumentNumbering>(
        { code, year: moment().format('YY'), month: moment().format('M') },
        {
          $inc: {
            counter: 1,
          },
        },
        { upsert: true, returnDocument: 'after' },
      )
      .session(session);
    const month_enhance = `0${result.month}`.slice(-2);
    if (exclude_dash)
      return (
        `${code}-${result.year}${month_enhance}` +
        `00000000${result.counter}`.slice(-6)
      );
    return (
      `${code}${result.year}${month_enhance}` +
      `00000000${result.counter}`.slice(-6)
    );
  }

  private async getCacheConnection() {
    // Check for Redis URL first (for local development)
    const redisUrl = this.configService.get<string>('REDIS_URL');
    
    if (redisUrl) {
      try {
        const cacheConnection = createClient({
          url: redisUrl
        });
        
        cacheConnection.on('error', (err) => {
          Logger.warn(`Redis connection error: ${err.message}`);
          if (this.retryCacheConnection > 5) {
            throw err;
          }
          this.retryCacheConnection++;
        });
        
        cacheConnection.on('ready', () => {
          this.retryCacheConnection = 0;
        });
        
        await cacheConnection.connect();
        return cacheConnection;
      } catch (err) {
        Logger.warn(`Redis connection failed with URL: ${err.message}`);
        throw err;
      }
    }

    // Fallback to Azure Cache configuration
    const cacheHostName = this.configService.get<string>(
      'AZURE_CACHE_FOR_REDIS_HOST_NAME',
    );
    const cachePassword = this.configService.get<string>(
      'AZURE_CACHE_FOR_REDIS_ACCESS_KEY',
    );

    if (!cacheHostName && !redisUrl) {
      throw new Error('No Redis configuration found. Set REDIS_URL or Azure Redis credentials.');
    }

    if (!cachePassword && cacheHostName) {
      throw new Error('AZURE_CACHE_FOR_REDIS_ACCESS_KEY is required when using Azure Redis');
    }

    try {
      // Connection configuration for Azure
      const cacheConnection = createClient({
        url: `rediss://${cacheHostName}:6380`,
        password: cachePassword,
      });
      
      cacheConnection.on('error', (err) => {
        Logger.warn(`Azure Redis connection error: ${err.message}`);
        if (this.retryCacheConnection > 5) {
          throw err;
        }
        this.retryCacheConnection++;
      });
      
      cacheConnection.on('ready', () => {
        this.retryCacheConnection = 0;
      });
      
      await cacheConnection.connect();
      return cacheConnection;
    } catch (err) {
      Logger.error(`Azure Redis connection failed: ${err.message}`);
      throw err;
    }
  }

  async testCache() {
    try {
      const cacheConnection = await this.getCacheConnection();
      const result = await cacheConnection.ping();
      await cacheConnection.quit();
      return result;
    } catch (err) {
      Logger.warn('Cache connection failed, continuing without cache');
      return null;
    }
  }

  async getCache(key: string) {
    try {
      const cacheConnection = await this.getCacheConnection();
      const result = await cacheConnection.get(key);
      await cacheConnection.quit();
      return result;
    } catch (err) {
      Logger.warn(`Cache get failed for key ${key}, returning null`);
      return null;
    }
  }

  async setCache(key: string, value: any) {
    try {
      const cacheConnection = await this.getCacheConnection();
      const result = await cacheConnection.set(key, JSON.stringify(value));
      await cacheConnection.quit();
      return result;
    } catch (err) {
      Logger.warn(`Cache set failed for key ${key}, continuing without cache`);
      return null;
    }
  }

  async encrypt(textToEncrypt: string) {
    //create encryption key from email
    const iv = randomBytes(16);
    const key = (await promisify(scrypt)(
      this.configService.get<string>('RANDOM_TEXT'),
      'salt',
      32,
    )) as Buffer;

    const cipher = createCipheriv('aes-256-ctr', key, iv);
    const encryptedText = Buffer.concat([
      cipher.update(textToEncrypt),
      cipher.final(),
    ]);

    //convert Buffer to string
    const encryptedHex =
      iv.toString('hex') + ':' + encryptedText.toString('hex');
    console.log('Encryption text:', encryptedHex);
    return encryptedHex;
  }

  async decrypt(encryptedHex: string) {
    const textParts = encryptedHex.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedBuffer = Buffer.from(textParts.join(':'), 'hex');

    // Decryption
    const key = (await promisify(scrypt)(
      this.configService.get<string>('RANDOM_TEXT'),
      'salt',
      32,
    )) as Buffer;

    const decipher = createDecipheriv('aes-256-ctr', key, iv);
    // Convert the hex string back to a Buffer
    const decryptedText = Buffer.concat([
      decipher.update(encryptedBuffer),
      decipher.final(),
    ]);
    //convert Buffer to string
    console.log('Decrypted text:', decryptedText.toString());
    return decryptedText.toString();
  }
}
