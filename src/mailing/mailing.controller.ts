import { Controller, Post, Body } from '@nestjs/common';
import { MailingService } from './mailing.service';

@Controller('mail')
export class MailingController {
  constructor(private readonly mailingService: MailingService) {}

  @Post('send-invitation')
  sendInvitation(@Body() body: { data: Record<string, any> }) {
    try {
      this.mailingService.mailUserInvitation(body.data);
    } catch (error) {
      return error;
    }
  }
}
