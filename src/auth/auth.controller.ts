import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { ResetPasswordService } from 'src/core/user/reset-password.service';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('auth')
@ApiBearerAuth()
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly resetPasswordService: ResetPasswordService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Post('mail-reset')
  sendMailResetPassword(@Body() payload: { email: string }) {
    return this.resetPasswordService.mailResetPassword(payload.email);
  }

  @Get('reset/:key')
  getDataReset(@Param('key') key: string) {
    return this.resetPasswordService.findOne({
      filter: { key: key, used: false, expired_at: { $gte: new Date() } },
    });
  }

  @Post('reset')
  resetPassword(@Body() body: { key: string; password: string }) {
    const { key, password } = body;
    return this.resetPasswordService.changePassword(key, password);
  }
}
