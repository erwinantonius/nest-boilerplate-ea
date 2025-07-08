import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Workplace, WorkplaceDocument } from '../core/workplace/entities/workplace.entity';

@Injectable()
export class WorkplaceSeeder {
  private readonly logger = new Logger(WorkplaceSeeder.name);

  constructor(
    @InjectModel(Workplace.name) private workplaceModel: Model<WorkplaceDocument>,
  ) {}

  async seed(): Promise<Workplace[]> {
    this.logger.log('Seeding workplaces...');
    
    // Check if workplaces already exist
    const existingCount = await this.workplaceModel.countDocuments();
    if (existingCount > 0) {
      this.logger.log('Workplaces already exist, skipping seeding');
      return await this.workplaceModel.find().exec();
    }

    const workplacesData = [
      {
        name: 'Head Office Jakarta',
        address: 'Jl. Sudirman No. 123, Jakarta Pusat, DKI Jakarta 10220',
        code: 'HO-JKT',
        coordinate: [-6.2088, 106.8456], // Jakarta coordinates
        type: 'Head Office',
        currency: 'IDR',
        contact_name: 'John Doe',
        contact_phone: '+62-21-12345678',
        contact_email: 'admin@headoffice.com',
        created_by: 'system',
        updated_by: 'system',
      },
      {
        name: 'Branch Office Surabaya',
        address: 'Jl. Tunjungan No. 456, Genteng, Surabaya, Jawa Timur 60275',
        code: 'BR-SBY',
        coordinate: [-7.2575, 112.7521], // Surabaya coordinates
        type: 'Branch Office',
        currency: 'IDR',
        contact_name: 'Jane Smith',
        contact_phone: '+62-31-87654321',
        contact_email: 'admin@branchsurabaya.com',
        created_by: 'system',
        updated_by: 'system',
      },
    ];

    try {
      const createdWorkplaces = await this.workplaceModel.insertMany(workplacesData);
      this.logger.log(`Successfully seeded ${createdWorkplaces.length} workplaces`);
      return createdWorkplaces;
    } catch (error) {
      this.logger.error('Error seeding workplaces:', error);
      throw error;
    }
  }

  async clear(): Promise<void> {
    this.logger.log('Clearing workplaces...');
    await this.workplaceModel.deleteMany({});
    this.logger.log('Workplaces cleared');
  }
}
