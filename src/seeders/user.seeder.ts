import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument, ContractType } from '../core/user/entities/user.entity';
import { Workplace, WorkplaceDocument } from '../core/workplace/entities/workplace.entity';
import { Role } from '../common/enum/role.enum';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserSeeder {
  private readonly logger = new Logger(UserSeeder.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Workplace.name) private workplaceModel: Model<WorkplaceDocument>,
  ) {}

  private async passwordGenerator(
    password: string,
  ): Promise<{ hash: string; salt: string }> {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);
    return { hash, salt };
  }

  async seed(): Promise<User[]> {
    this.logger.log('Seeding users...');
    
    // Check if users already exist
    const existingCount = await this.userModel.countDocuments();
    if (existingCount > 0) {
      this.logger.log('Users already exist, skipping seeding');
      return await this.userModel.find().populate('workplace').exec();
    }

    // Get existing workplaces
    const workplaces = await this.workplaceModel.find().exec();
    if (workplaces.length === 0) {
      throw new Error('No workplaces found. Please seed workplaces first.');
    }

    const usersData = [
      {
        first_name: 'Admin',
        last_name: 'System',
        email: 'admin@company.com',
        password: 'admin123',
        gender: 'Male',
        contract_type: ContractType.PERMANENT,
        expired_date: '2025-12-31',
        roles: [Role.SUPERADMIN],
        phone: '+62-812-3456-7890',
        workplace: workplaces[0]._id, // Head Office Jakarta
        created_by: 'system',
        updated_by: 'system',
      },
      {
        first_name: 'Employee',
        last_name: 'Demo',
        email: 'employee@company.com',
        password: 'employee123',
        gender: 'Female',
        contract_type: ContractType.PERMANENT,
        expired_date: '2025-12-31',
        roles: [Role.EMPLOYEE],
        phone: '+62-813-9876-5432',
        workplace: workplaces[1]._id, // Branch Office Surabaya
        workplace_delegate: [
          {
            _id: workplaces[0]._id,
            name: workplaces[0].name,
            code: workplaces[0].code,
          },
        ],
        created_by: 'system',
        updated_by: 'system',
      },
    ];

    try {
      const createdUsers = [];
      
      for (const userData of usersData) {
        // Hash password using local method
        const { hash, salt } = await this.passwordGenerator(userData.password);
        
        // Remove password and add hash/salt
        const { password, ...userDataWithoutPassword } = userData;
        const userWithHashedPassword = {
          ...userDataWithoutPassword,
          hash,
          salt,
        };

        const createdUser = await this.userModel.create(userWithHashedPassword);
        createdUsers.push(createdUser);
      }

      this.logger.log(`Successfully seeded ${createdUsers.length} users`);
      
      // Return users with populated workplace
      return await this.userModel.find().populate('workplace').exec();
    } catch (error) {
      this.logger.error('Error seeding users:', error);
      throw error;
    }
  }

  async clear(): Promise<void> {
    this.logger.log('Clearing users...');
    await this.userModel.deleteMany({});
    this.logger.log('Users cleared');
  }
}
