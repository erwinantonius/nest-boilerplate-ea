import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DatabaseSeeder } from './database.seeder';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('SeederCLI');
  
  try {
    const app = await NestFactory.createApplicationContext(AppModule);
    const seeder = app.get(DatabaseSeeder);

    const command = process.argv[2];

    switch (command) {
      case 'seed':
        logger.log('Running seed command...');
        await seeder.seedAll();
        break;
      case 'clear':
        logger.log('Running clear command...');
        await seeder.clearAll();
        break;
      case 'reseed':
        logger.log('Running reseed command...');
        await seeder.reseedAll();
        break;
      default:
        logger.log('Available commands:');
        logger.log('  npm run seed        - Seed all data');
        logger.log('  npm run seed:clear  - Clear all data');
        logger.log('  npm run seed:reseed - Clear and reseed all data');
        break;
    }

    await app.close();
    process.exit(0);
  } catch (error) {
    logger.error('Seeder failed:', error);
    process.exit(1);
  }
}

bootstrap();
