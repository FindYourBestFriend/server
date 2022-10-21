import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';

import { join } from 'path';

import { EmailService } from './email.service';
import { EmailController } from './email.controller';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      },
      template: {
        dir: join(__dirname, '../../../', 'emails'),
      },
    }),
  ],
  providers: [EmailService],
  controllers: [EmailController],
})
export class EmailModule {}
