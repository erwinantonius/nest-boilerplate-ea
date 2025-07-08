import { Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { MongooseModule } from '@nestjs/mongoose';
import { DocumentNumberingSchema } from './common.entity';
import { CommonController } from './common.controller';
import { JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { WorkplaceModule } from 'src/core/workplace/workplace.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'document_numbering', schema: DocumentNumberingSchema },
    ]),
    ConfigModule,
    WorkplaceModule,
  ],
  controllers: [CommonController],
  providers: [CommonService, JwtService],
  exports: [CommonService],
})
export class CommonModule {}
