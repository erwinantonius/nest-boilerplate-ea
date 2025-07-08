import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../core/user/entities/user.entity';
import { Workplace, WorkplaceSchema } from '../core/workplace/entities/workplace.entity';
import { DatabaseSeeder } from './database.seeder';
import { UserSeeder } from './user.seeder';
import { WorkplaceSeeder } from './workplace.seeder';
import { SeederController } from './seeder.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Workplace.name, schema: WorkplaceSchema },
    ]),
  ],
  controllers: [SeederController],
  providers: [DatabaseSeeder, UserSeeder, WorkplaceSeeder],
  exports: [DatabaseSeeder, UserSeeder, WorkplaceSeeder],
})
export class SeederModule {}
