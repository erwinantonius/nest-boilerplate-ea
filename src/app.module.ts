import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './core/user/user.module';
import { AuthModule } from './auth/auth.module';
import * as Joi from 'joi';
import { WorkplaceModule } from './core/workplace/workplace.module';
import { SeederModule } from './seeders/seeder.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRES_IN: Joi.string().default('1d'),
        JWT_EXPIRED: Joi.string().optional(), // Keep for backward compatibility
        DB_URL: Joi.string().required(), // Database URL for both local and cloud
        NODE_ENV: Joi.string().default('development'),
        RANDOM_TEXT: Joi.string().optional(),
        REDIS_URL: Joi.string().optional(),
        AZURE_CACHE_FOR_REDIS_HOST_NAME: Joi.string().optional(),
        AZURE_CACHE_FOR_REDIS_ACCESS_KEY: Joi.string().optional(),
        AZURE_MAIL_SENDER: Joi.string().optional(),
        AZURE_MAIL_CONNSTRING: Joi.string().optional(),
        AZURE_COMMUNICATION_CONNECTION_STRING: Joi.string().optional(),
        AZURE_BLOB_TOKEN: Joi.string().optional(),
        CLIENT_URL: Joi.string().default('localhost:9000'),
        PORT_API_HTTP: Joi.string().default('3000'),
      }),
    }),
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const uri = configService.get<string>('DB_URL');
        return {
          uri: uri as string,
        };
      },
      inject: [ConfigService],
    }),
    UserModule,
    WorkplaceModule,
    AuthModule,
    SeederModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
