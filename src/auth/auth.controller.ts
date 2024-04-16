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
import { Request as request } from 'express';

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
  authImageKit(@Request() req: request) {
    return this.authService.authImageKit(req);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req: any) {
    return req.user;
  }
}
