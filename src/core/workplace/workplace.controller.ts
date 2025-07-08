import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CriteriaDto } from 'src/common/criteria.dto';
import { WorkplaceService } from './workplace.service';
import { CreateWorkplaceDto } from './dto/create-workplace.dto';
import { WorkplaceDocument } from './entities/workplace.entity';
import { UpdateWorkplaceDto } from './dto/update-workplace.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { RoleGuard } from 'src/auth/role.guard';
import { Role } from 'src/common/enum/role.enum';
import { Roles } from 'src/auth/role.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('Workplaces')
@UseGuards(AuthGuard, RoleGuard)
@ApiBearerAuth()
export class WorkplaceController {
  constructor(private readonly workplaceService: WorkplaceService) {}

  @Post()
  @Roles([Role.SUPERADMIN])
  async create(
    @Body() createWorkplaceDto: CreateWorkplaceDto,
  ): Promise<WorkplaceDocument> {
    const exists = await this.workplaceService.findOne({
      filter: { code: createWorkplaceDto.code },
    });
    if (exists)
      throw new HttpException('Data already exists', HttpStatus.CONFLICT);

    return this.workplaceService.create(
      createWorkplaceDto as WorkplaceDocument,
    );
  }

  @Get()
  async findAll(@Query() qry: CriteriaDto): Promise<WorkplaceDocument[]> {
    const data = await this.workplaceService.findAll(qry);
    return data;
  }

  @Get('count')
  countDocument(@Query() qry: CriteriaDto) {
    return this.workplaceService.count(qry);
  }

  @Get(':id')
  @Roles([Role.SUPERADMIN])
  async getById(@Param() params) {
    return await this.workplaceService.findById(params.id as string);
  }

  @Patch(':id')
  @Roles([Role.SUPERADMIN])
  async update(
    @Param('id') id: string,
    @Body() updateWorkplaceDto: UpdateWorkplaceDto,
  ) {
    const exists = await this.workplaceService.findOne({
      filter: { code: updateWorkplaceDto.code, _id: { $ne: id } },
    });
    if (exists)
      throw new HttpException('Data already exists', HttpStatus.CONFLICT);

    return this.workplaceService.update(
      id,
      updateWorkplaceDto as WorkplaceDocument,
    );
  }
}
