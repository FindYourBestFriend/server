import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SingUpDto } from './auth.dto';
import { AuthService } from './auth.service';

@Controller('v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('/login')
  async login(@Req() req) {
    return await this.authService.login(req.user);
  }

  @Post('/singup')
  async singup(@Body() body: SingUpDto) {
    return await this.authService.singUp(body);
  }

  @UseGuards(AuthGuard('refresh-jwt'))
  @Get('/refresh-token')
  async refreshToken(@Req() req) {
    return await this.authService.refreshToken(req.user.id);
  }
}
