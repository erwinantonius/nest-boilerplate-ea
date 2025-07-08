import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmailClient, EmailMessage } from '@azure/communication-email';
import { EmailDto } from './dto/email.dto';
import * as fs from 'fs';
import * as handlebars from 'handlebars';

@Injectable()
export class MailingService {
  private readonly emailClient: EmailClient;

  constructor(private configService: ConfigService) {
    const connectionString =
      this.configService.get<string>('AZURE_MAIL_CONNSTRING') || '';
    this.emailClient = new EmailClient(connectionString);
  }

  /**
   * read template
   * @param templateName
   * @param data
   * @returns
   */
  private renderTemplate(templateName: string, data: any): string {
    const template = fs.readFileSync(
      process.cwd() + `/templates/${templateName}.hbs`,
      'utf-8',
    );
    const compiledTemplate = handlebars.compile(template);
    return compiledTemplate(data);
  }

  mailUserInvitation(data: Record<string, any>) {
    const htmlContent = this.renderTemplate('emails/user-invitation', {
      ...data,
      ski_url: process.env.CLIENT_URL,
    });

    const message: EmailDto = {
      senderAddress: this.configService.get<string>('AZURE_MAIL_SENDER'),
      content: {
        subject: 'Invitation to WMS SKI',
        plainText: 'Hello',
        html: htmlContent,
      },
      recipients: {
        to: [
          {
            address: data.email,
            displayName: data.fullname || data.first_name,
          },
        ],
      },
    };

    this.sendMail(message as EmailMessage);
  }

  mailResetLink(recipient: Record<string, any>, data: Record<string, any>) {
    const htmlContent = this.renderTemplate('emails/reset-link', data);

    const message: EmailDto = {
      senderAddress: this.configService.get<string>('AZURE_MAIL_SENDER'),
      content: {
        subject: 'Request Reset Password',
        plainText: 'Hi you request reset password',
        html: htmlContent,
      },
      recipients: {
        to: [
          {
            address: recipient.email,
            displayName: recipient.name,
          },
        ],
      },
    };

    this.sendMail(message as EmailMessage);
  }

  /**
   * mail confirmation for new password
   * @param data
   */
  mailResetPasswordConfirmation(data: Record<string, any>) {
    const message: EmailDto = {
      senderAddress: this.configService.get<string>('AZURE_MAIL_SENDER'),
      content: {
        subject: 'Password has been changed',
        plainText: `Congratulations, your password has been successfully changed at ${data.reset_date}`,
      },
      recipients: {
        to: [
          {
            address: data.email,
            displayName: data.name,
          },
        ],
      },
    };

    this.sendMail(message as EmailMessage);
  }

  /**
   * send mail service
   * @param message {EmailDto}
   */
  sendMail(message: EmailMessage) {
    const send = async () => {
      const poller = await this.emailClient.beginSend(message as EmailMessage);
      await poller.pollUntilDone();
    };
    // don't wait, lama soalnya
    send();
  }
}
