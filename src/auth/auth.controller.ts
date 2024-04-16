import {
  Body,
  Controller,
  Post,
  HttpCode,
  Request,
  HttpStatus,
  UseGuards,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { Public } from './auth.util';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: Record<string, any>) {
    return this.authService.signIn(signInDto.password);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Get('authimagekit')
  authImageKit() {
    console.log('authImageKit');
    return this.authService.authImageKit();
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req: any) {
    return req.user;
  }
}
