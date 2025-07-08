import { Module } from '@nestjs/common';
import { WorkplaceService } from './workplace.service';
import { WorkplaceController } from './workplace.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Workplace, WorkplaceSchema } from './entities/workplace.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Workplace.name, schema: WorkplaceSchema },
    ]),
  ],
  controllers: [WorkplaceController],
  providers: [WorkplaceService, JwtService],
  exports: [WorkplaceService],
})
export class WorkplaceModule {}
