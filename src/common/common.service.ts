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
    // Environment variables for cache
    const cacheHostName = this.configService.get<string>(
      'AZURE_CACHE_FOR_REDIS_HOST_NAME',
    );
    const cachePassword = this.configService.get<string>(
      'AZURE_CACHE_FOR_REDIS_ACCESS_KEY',
    );

    if (!cacheHostName) throw Error('AZURE_CACHE_FOR_REDIS_HOST_NAME is empty');
    if (!cachePassword)
      throw Error('AZURE_CACHE_FOR_REDIS_ACCESS_KEY is empty');

    try {
      // Connection configuration
      const cacheConnection = createClient({
        // rediss for toFileStream
        url: `rediss://${cacheHostName}:6380`,
        password: cachePassword,
      });
      cacheConnection.on('error', (err) => {
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
      Logger.error(`Redis error ${err}`);
      throw err;
    }
  }

  async testCache() {
    try {
      const cacheConnection = await this.getCacheConnection();
      return await cacheConnection.ping();
    } catch (err) {
      return null;
    }
  }

  async getCache(key: string) {
    try {
      const cacheConnection = await this.getCacheConnection();
      return await cacheConnection.get(key);
    } catch (err) {
      throw err;
    }
  }

  async setCache(key: string, value: any) {
    try {
      const cacheConnection = await this.getCacheConnection();
      return await cacheConnection.set(key, JSON.stringify(value));
    } catch (err) {
      throw err;
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
