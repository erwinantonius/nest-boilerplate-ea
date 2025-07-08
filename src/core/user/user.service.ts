import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { GenericService } from 'src/common/generic.service';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './entities/user.entity';
import { Model, ObjectId } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { ChangePasswordDto } from './dto/change-password.dto';
import { MailingService } from 'src/mailing/mailing.service';
import { WorkplaceService } from '../workplace/workplace.service';

@Injectable()
export class UserService extends GenericService<User, UserDocument> {
  constructor(
    @InjectModel(User.name) readonly model: Model<UserDocument>,
    private readonly mailingService: MailingService,
    private readonly workplaceService: WorkplaceService,
  ) {
    super(model);
  }

  async createAccount(createUserDto: CreateUserDto) {
    const errorPassword = this.validatePassword(createUserDto.password);
    if (errorPassword.length) {
      throw new HttpException(
        'Invalid password combination',
        HttpStatus.BAD_REQUEST,
      );
    }
    const { hash, salt } = await this.passwordGenerator(createUserDto.password);

    const workplace = await this.workplaceService.findOne({});

    const createdDocument = new this.model({
      ...createUserDto,
      workplace: workplace,
      hash,
      salt,
    });
    const result = await this.create(createdDocument);

    const data = { ...result.toObject(), pass_text: createUserDto.password };
    this.mailingService.mailUserInvitation(data);

    return result;
  }

  async changePassword(
    _id: ObjectId,
    changePassword: ChangePasswordDto,
    reset: boolean = false,
  ) {
    const result = await this.findById(_id as unknown as string);

    //come from changePassword not for reset password
    if (!reset) {
      const old_hash = await bcrypt.hash(
        changePassword.old_password,
        result!.salt,
      );
      if (old_hash !== result!.hash) {
        throw new ConflictException('Unmatch Old Password');
      }
    }

    const { hash, salt } = await this.passwordGenerator(
      changePassword.new_password,
    );
    return this.update(_id as unknown as string, {
      _id,
      hash,
      salt,
      email: result!.email,
    });
  }

  private async passwordGenerator(
    password: string,
  ): Promise<{ hash: string; salt: string }> {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);
    return {
      hash,
      salt,
    };
  }

  private validatePassword(password: string): string[] {
    const errors: string[] = [];
    const minLength = 8;
    const hasUpperCase = /[A-Z]/;
    const hasLowerCase = /[a-z]/;
    const hasNumber = /[0-9]/;

    if (password.length < minLength) {
      errors.push('Password must be at least 8 characters long.');
    }

    if (!hasUpperCase.test(password)) {
      errors.push('Password must contain at least one uppercase letter.');
    }

    if (!hasLowerCase.test(password)) {
      errors.push('Password must contain at least one lowercase letter.');
    }

    if (!hasNumber.test(password)) {
      errors.push('Password must contain at least one number.');
    }

    return errors;
  }
}
