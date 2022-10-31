import { Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { EmailService, EmailTemplate } from '@app/modules/email/email.service';
import { OnEvent } from '@nestjs/event-emitter';
import { ApiExcludeController } from '@nestjs/swagger';

export interface IUpdateUser {
  name: string;
}

@Controller('v1/email')
@UseGuards(AuthGuard('jwt'))
@ApiExcludeController()
export class EmailController {
  constructor(
    private readonly service: EmailService,
  ) {}

  @OnEvent('email.send')
  async send(to: string,
    emailTemplate: EmailTemplate,
    context?: Record<string, unknown>) {
    await this.service.send(to, emailTemplate, context);
  }

}
