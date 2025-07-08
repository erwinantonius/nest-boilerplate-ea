import {
  Controller,
  Get,
  Query,
  UseGuards,
  Res,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
  Param,
  Request,
} from '@nestjs/common';
import { AllowAny, AuthGuard } from 'src/auth/auth.guard';
import { CommonService } from 'src/common/common.service';
import { DocNumberingDto, QrBarcodeGeneratorDto } from './common.entity';
import * as bwipjs from 'bwip-js';
import * as QRCode from 'qrcode';
import { PassThrough, Readable } from 'stream';
import { Response } from 'express';
import { BlobServiceClient } from '@azure/storage-blob';
import { FileInterceptor } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';

@Controller('common')
@UseGuards(AuthGuard)
export class CommonController {
  constructor(
    private readonly commonService: CommonService,
    private configService: ConfigService,
  ) {}

  @Post('doc-numbering')
  async docNumbering(@Body() qry: DocNumberingDto, @Request() req) {
    try {
      const { user } = req;
      const { warehouse } = user;
      return this.commonService.createDocumentNumberingWh(
        warehouse._id,
        qry.code,
      );
    } catch (err) {
      throw err;
    }
  }
  @AllowAny()
  @Get('qr-code')
  async qrcode(@Query() qry: QrBarcodeGeneratorDto, @Res() response: Response) {
    try {
      const { data } = qry;
      const qrStream = new PassThrough();
      await QRCode.toFileStream(qrStream, data, {
        type: 'png',
        width: 200,
        errorCorrectionLevel: 'H',
      });

      response.setHeader('Content-type', 'image/jpeg');
      response.setHeader('Content-disposition', `inline; filename="22.jpeg"`);
      qrStream.pipe(response);
    } catch (err) {
      throw err;
    }
  }

  @AllowAny()
  @Get('code-128')
  async code128(
    @Query() qry: QrBarcodeGeneratorDto,
    @Res() response: Response,
  ) {
    try {
      const { data } = qry;
      await bwipjs
        .toBuffer({
          bcid: 'code128', // Barcode type
          text: data, // Text to encode
          scale: 2, // 3x scaling factor
          height: 10, // Bar height, in millimeters
          includetext: false, // Show human-readable text
          textxalign: 'center', // Always good to set this
        })
        .then((png) => {
          const readableInstanceStream = new Readable({
            read() {
              this.push(png);
              this.push(null);
            },
          });
          response.setHeader('Content-type', 'image/jpeg');
          response.setHeader(
            'Content-disposition',
            `inline; filename="22.jpeg"`,
          );
          readableInstanceStream.pipe(response);
        });
    } catch (err) {
      throw err;
    }
  }

  @AllowAny()
  @Get('cache-health')
  async cacheHealth() {
    try {
      return await this.commonService.testCache();
    } catch (err) {
      throw err;
    }
  }

  @AllowAny()
  @Post('cache')
  async setCache(@Body() body: any) {
    const { key, value } = body;
    try {
      return await this.commonService.setCache(key, value);
    } catch (err) {
      throw err;
    }
  }

  @AllowAny()
  @Get('cache')
  async getCache(@Body() body: any) {
    const { key } = body;
    try {
      return await this.commonService.getCache(key);
    } catch (err) {
      throw err;
    }
  }

  @UseInterceptors(FileInterceptor('file'))
  @Post('upload-file')
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    try {
      const containerName = 'public';
      const getBlobName = (originalname) => {
        const identifier = Math.random().toString().replace(/0\./, ''); // remove "0." from start of string
        return `${identifier}-${originalname}`;
      };
      const blobName = getBlobName(file.originalname);
      const blobServiceUri = this.configService.get<string>('AZURE_BLOB_TOKEN');
      const credential = undefined;
      const blobServiceClient = new BlobServiceClient(
        blobServiceUri,
        credential,
      );
      const containerClient =
        blobServiceClient.getContainerClient(containerName);
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);
      await blockBlobClient.uploadData(file.buffer);
      return {
        status: 'ok',
        filename: blobName,
      };
    } catch (err) {
      throw err;
    }
  }

  @AllowAny()
  @Get('download-file/:id')
  async downloadFile(@Param('id') id: string, @Res() response: Response) {
    try {
      const containerName = 'public';
      const blobServiceUri = this.configService.get<string>('AZURE_BLOB_TOKEN');
      const credential = undefined;
      const blobServiceClient = new BlobServiceClient(
        blobServiceUri,
        credential,
      );
      const containerClient =
        blobServiceClient.getContainerClient(containerName);

      const blockBlobClient = containerClient.getBlobClient(id);
      blockBlobClient.download(0).then((result) => {
        result.readableStreamBody.pipe(response);
      });
    } catch (err) {
      throw err;
    }
  }

  @AllowAny()
  @Get('url-file/:id')
  async getFileUrl(@Param('id') id: string) {
    try {
      const containerName = 'public';
      const blobServiceUri = this.configService.get<string>('AZURE_BLOB_TOKEN');
      const credential = undefined;
      const blobServiceClient = new BlobServiceClient(
        blobServiceUri,
        credential,
      );
      const containerClient =
        blobServiceClient.getContainerClient(containerName);

      const blockBlobClient = containerClient.getBlobClient(id);
      return blockBlobClient.url;
    } catch (err) {
      throw err;
    }
  }

  @AllowAny()
  @Post('encrypt')
  async encrypt(@Body() body: any) {
    const { token } = body;
    try {
      return await this.commonService.encrypt(token);
    } catch (err) {
      throw err;
    }
  }

  @AllowAny()
  @Post('decrypt')
  async decrypt(@Body() body: any) {
    const { token } = body;
    try {
      return await this.commonService.decrypt(token);
    } catch (err) {
      throw err;
    }
  }
}
