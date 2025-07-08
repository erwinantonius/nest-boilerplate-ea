import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './core/user/user.module';
import { AuthModule } from './auth/auth.module';
import * as Joi from 'joi';
import { WorkplaceModule } from './core/workplace/workplace.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRED: Joi.string().required(),
        DB_URL: Joi.string().required(),
        NODE_ENV: Joi.string().required(),
        AZURE_MAIL_SENDER: Joi.string().required(),
        AZURE_MAIL_CONNSTRING: Joi.string().required(),
        CLIENT_URL: Joi.string().required(),
        PORT_API_HTTP: Joi.string().required(),
      }),
    }),
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        return {
          uri: configService.get<string>('DB_URL') as string,
        };
      },
      inject: [ConfigService],
    }),
    UserModule,
    WorkplaceModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
