import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { MyAccountService } from '@app/modules/my-account/my-account.service';
import { AuthGuard } from '@nestjs/passport';
import { Body, Put } from '@nestjs/common/decorators';
import { ApiTags } from '@nestjs/swagger';

export interface IUpdateUser {
  name: string;
}

@Controller('v1/my-account')
@UseGuards(AuthGuard('jwt'))
@ApiTags('My Account')
export class MyAccountController {
  constructor(
    private readonly service: MyAccountService,
  ) {}

  @Get()
  async currentUser(@Req() req) {
    return this.service.currentUser(req.user.id);
  }

  @Put()
  async editCurrentUser(@Req() req, @Body() body: IUpdateUser) {
    return this.service.update(req.user.id, body);
  }

}
