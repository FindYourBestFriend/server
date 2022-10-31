import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { SingUpDto } from './auth.dto';
import { AuthService } from './auth.service';

@Controller('v1/auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('/login')
  async login(@Req() req) {
    return await this.authService.login(req.user);
  }

  @Post('/signup')
  async singup(@Body() body: SingUpDto) {
    return await this.authService.singUp(body);
  }

  @UseGuards(AuthGuard('refresh-jwt'))
  @Get('/refresh-token')
  async refreshToken(@Req() req) {
    return await this.authService.refreshToken(req.user.id);
  }

  @Post('/confirm-email')
  async confirmEmail(@Body() body: { token: string }) {
    return await this.authService.confirmEmail(body.token);
  }
}
