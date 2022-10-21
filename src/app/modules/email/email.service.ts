import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

import handlebars from 'handlebars';

import { readFileSync } from 'fs';
import { join } from 'path';

export enum EmailTemplate {
  ConfirmEmail = 'confirmation',
  Invite = 'invitation',
}

enum EmailSubject {
  confirmation = 'Confirmação de E-mail',
  invitation = 'Convite de Acesso',
}

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async send(
    to: string,
    emailTemplate: EmailTemplate,
    context?: Record<string, unknown>,
  ) {
    const from = process.env.SMTP_FROM;

    const html = readFileSync(join(__dirname, `../../../emails/${emailTemplate}.html`), 'utf8');
    const template = handlebars.compile(html);

    const htmlToSend = template(context);

    await this.mailerService.sendMail({
      to,
      from,
      context,
      html: htmlToSend,
      subject: EmailSubject[emailTemplate],
    });
    return;
  }
}
