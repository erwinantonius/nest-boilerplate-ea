import { Injectable, Logger } from '@nestjs/common';
import { WorkplaceSeeder } from './workplace.seeder';
import { UserSeeder } from './user.seeder';

@Injectable()
export class DatabaseSeeder {
  private readonly logger = new Logger(DatabaseSeeder.name);

  constructor(
    private readonly workplaceSeeder: WorkplaceSeeder,
    private readonly userSeeder: UserSeeder,
  ) {}

  async seedAll(): Promise<void> {
    this.logger.log('Starting database seeding...');

    try {
      // Seed workplaces first (users depend on workplaces)
      await this.workplaceSeeder.seed();
      
      // Then seed users
      await this.userSeeder.seed();

      this.logger.log('Database seeding completed successfully!');
    } catch (error) {
      this.logger.error('Database seeding failed:', error);
      throw error;
    }
  }

  async clearAll(): Promise<void> {
    this.logger.log('Clearing all data...');

    try {
      // Clear in reverse order (users first, then workplaces)
      await this.userSeeder.clear();
      await this.workplaceSeeder.clear();

      this.logger.log('All data cleared successfully!');
    } catch (error) {
      this.logger.error('Failed to clear data:', error);
      throw error;
    }
  }

  async reseedAll(): Promise<void> {
    this.logger.log('Reseeding database...');
    await this.clearAll();
    await this.seedAll();
  }
}
