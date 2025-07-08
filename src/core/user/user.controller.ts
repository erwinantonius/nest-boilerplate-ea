import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
  Delete,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDocument } from './entities/user.entity';
import { CriteriaDto } from 'src/common/criteria.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ObjectId } from 'mongoose';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { RolePermissionService } from './role-permisision.service';

@Controller('users')
@ApiBearerAuth()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly rolePermissionService: RolePermissionService,
  ) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
  })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.createAccount(createUserDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll(@Query() qry: CriteriaDto): Promise<UserDocument[]> {
    return this.userService.findAll(qry);
  }

  @Get('count')
  @UseGuards(AuthGuard)
  countDocument(@Query() qry: CriteriaDto) {
    return this.userService.count(qry);
  }

  @Get('my-role-permission')
  @UseGuards(AuthGuard)
  async getPermission(@Request() req) {
    const { user } = req;
    return await this.rolePermissionService.getByRoles(user.roles);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async getById(@Param() params, @Query() qry) {
    const { select, populate } = qry;
    return await this.userService.findById(params.id, select, populate);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto as UserDocument);
  }

  @Post(':id')
  @UseGuards(AuthGuard)
  changePassword(
    @Param('id') id: ObjectId,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.userService.changePassword(id, changePasswordDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  delete(@Param('id') id: string) {
    return this.userService.delete(id);
  }
}
