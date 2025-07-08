import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './common/interceptor/logging.interceptor';
import { ResponseInterceptor } from './common/interceptor/response.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as bodyParser from 'body-parser';
import * as hbs from 'hbs';

async function bootstrap() {
  //use http to local test redirect url

  // const httpsOptions = {
  //   key: fs.readFileSync('./secrets/cert.key'),
  //   cert: fs.readFileSync('./secrets/cert.pem'),
  // };
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
    logger:
      process.env.NODE_ENV === 'development'
        ? ['log', 'error', 'warn', 'debug', 'verbose']
        : ['error', 'warn'],
    //httpsOptions, //use http to local test redirect url
  });

  app.setGlobalPrefix('api');
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalInterceptors(new ResponseInterceptor());
  // app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  app.setBaseViewsDir(join(__dirname, '..', 'templates'));
  app.setViewEngine('hbs');

  // ✅ Register Handlebars Helpers
  hbs.registerHelper('eq', (a, b) => String(a).trim() === String(b).trim());
  hbs.registerHelper('toUpperCase', (str) => str.toUpperCase());

  // ✅ Register Partials (if using)
  hbs.registerPartials(join(__dirname, '..', 'templates', 'partials'));

  app.enableCors({
    allowedHeaders: '*',
    origin: '*',
  });
  const config = new DocumentBuilder()
    .setTitle('EHUB-Documentation')
    .setDescription('An API Reference')
    .setVersion('1.0')
    .addTag('EHUB')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT_API_HTTP, async () => {
    console.log(`App Up.. running on:${await app.getUrl()}`);
  });
}
bootstrap();
