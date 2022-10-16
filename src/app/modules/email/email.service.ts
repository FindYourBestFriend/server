import { Injectable } from '@nestjs/common';

import { MailerService } from '@nestjs-modules/mailer';
import { OnEvent } from '@nestjs/event-emitter';

export enum EmailTemplate {
  ConfirmEmail = 'confirm-email',
  Invite = 'invite',
}

enum EmailSubject {
  'confirm-email' = 'Confirmação de E-mail',
  invite = 'Convite de Acesso',
}

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  @OnEvent('email.send')
  async send(
    to: string,
    emailTemplate: EmailTemplate,
    context?: Record<string, unknown>,
  ) {
    const from = process.env.SMTP_FROM;

    console.log(from);
    console.log(to);

    await this.mailerService.sendMail({
      to,
      from,
      subject: EmailSubject[emailTemplate],
      template: emailTemplate,
      context,
    });
    return;
  }
}
