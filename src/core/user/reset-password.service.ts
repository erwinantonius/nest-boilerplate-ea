import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { GenericService } from 'src/common/generic.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ResetPassword,
  ResetPasswordDocument,
} from './entities/reset-password.entity';
import { UserService } from './user.service';
import * as moment from 'moment';
import { ResetPasswordDto } from './dto/change-password.dto';
import { MailingService } from 'src/mailing/mailing.service';
import { CommonService } from 'src/common/common.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ResetPasswordService extends GenericService<
  ResetPassword,
  ResetPasswordDocument
> {
  constructor(
    @InjectModel('reset_password')
    readonly model: Model<ResetPasswordDocument>,
    private readonly userService: UserService,
    private mailingService: MailingService,
    private configService: ConfigService,
    private commonService: CommonService,
  ) {
    super(model);
  }

  async mailResetPassword(email: string) {
    try {
      //find user
      const user = await this.userService.findOne({ filter: { email: email } });
      if (!user) {
        throw new NotFoundException('Email not found');
      }

      //create encryption key from email
      const encryptedHex = await this.commonService.encrypt(email);

      //store to collection
      const resetData: ResetPasswordDto = {
        user: user.id,
        key: encryptedHex,
        expired_at: moment().startOf('day').add(1, 'days').toDate(),
        used: false,
      };

      await super.findOneAndUpdate({
        filter: {
          user: user.id,
          used: false,
        },
        patch_obj: resetData,
      });

      //call mail service
      const dataToEmail = {
        url:
          this.configService.get<string>('CLIENT_URL') +
          `/#/reset/${encryptedHex}`,
        name: `${user.first_name} ${user.last_name}`,
        reset_date: moment().format('YYYY-MM-DD HH:mm'),
      };
      const recepient = {
        email,
        name: `${user.first_name} ${user.last_name}`,
      };
      this.mailingService.mailResetLink(recepient, dataToEmail);
    } catch (error) {
      Logger.error(error);
      throw error;
    }
  }

  /**
   * reset new password services
   * @param encryptedHex
   * @param password
   */
  async changePassword(encryptedHex: string, password: string) {
    //find reset data
    const resetData = await super.findOne({
      filter: {
        key: encryptedHex,
        used: false,
        expired_at: { $gte: new Date() },
      },
    });
    if (!resetData) {
      throw new NotFoundException('Key not found/expired');
    }

    //find user
    const user = await this.userService.findById(resetData.user.toString());
    if (!user) {
      throw new NotFoundException('Email not found');
    }

    // Decryption
    const decryptedText = await this.commonService.decrypt(encryptedHex);
    if (decryptedText !== user.email) {
      throw new BadRequestException('Key not valid');
    }

    await super.update(resetData.id, {
      used: true,
      expired_at: new Date(),
    } as unknown as ResetPasswordDocument);

    await this.userService.changePassword(
      user.id,
      {
        old_password: null,
        new_password: password,
      },
      true,
    );

    //call mail service
    const dataToEmail = {
      name: `${user.first_name} ${user.last_name}`,
      reset_date: moment().format('YYYY-MM-DD HH:mm'),
      email: user.email,
    };

    this.mailingService.mailResetPasswordConfirmation(dataToEmail);

    return { message: 'password has been reset' };
  }
}
