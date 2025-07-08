import { Controller, Post, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DatabaseSeeder } from './database.seeder';
import { AuthGuard } from '../auth/auth.guard';
import { Roles } from '../auth/role.decorator';
import { Role } from '../common/enum/role.enum';
import { RoleGuard } from '../auth/role.guard';

@ApiTags('seeders')
@ApiBearerAuth()
@Controller('seeders')
@UseGuards(AuthGuard, RoleGuard)
@Roles([Role.SUPERADMIN])
export class SeederController {
  constructor(private readonly databaseSeeder: DatabaseSeeder) {}

  @Post('seed')
  @ApiOperation({ summary: 'Seed all data (Admin only)' })
  @ApiResponse({ status: 201, description: 'Data seeded successfully' })
  async seedAll() {
    await this.databaseSeeder.seedAll();
    return { message: 'Database seeded successfully' };
  }

  @Delete('clear')
  @ApiOperation({ summary: 'Clear all data (Admin only)' })
  @ApiResponse({ status: 200, description: 'Data cleared successfully' })
  async clearAll() {
    await this.databaseSeeder.clearAll();
    return { message: 'Database cleared successfully' };
  }

  @Post('reseed')
  @ApiOperation({ summary: 'Clear and reseed all data (Admin only)' })
  @ApiResponse({ status: 201, description: 'Data reseeded successfully' })
  async reseedAll() {
    await this.databaseSeeder.reseedAll();
    return { message: 'Database reseeded successfully' };
  }
}
