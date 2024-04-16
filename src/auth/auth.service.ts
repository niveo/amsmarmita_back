import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  IMAGEKIT_PRIVATE_KEY,
  JWT_EXPIRATION_TIME,
  JWT_SUB_KEY,
  PASSWORD,
} from '../common/constantes';
import { sha256 } from 'js-sha256';
import { createHmac } from 'crypto';

import { extractTokenFromHeader } from 'src/common/utils';
import { Request } from 'express';
import { v4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async signIn(pass: string): Promise<{ access_token: string }> {
    const passsh256 = sha256.update(this.config.get(PASSWORD)).hex();
    if (passsh256 !== pass) {
      throw new UnauthorizedException();
    }
    const payload = {
      sub: this.config.get(JWT_SUB_KEY),
      expiresIn: this.config.get(JWT_EXPIRATION_TIME),
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  authImageKit(req: Request) {
    const token = extractTokenFromHeader(req) || v4();
    const expire = Number(Date.now() / 1000) + 2400;
    const privateAPIKey = this.config.getOrThrow(IMAGEKIT_PRIVATE_KEY);
    const signature = createHmac('sha1', privateAPIKey)
      .update(token + expire)
      .digest('hex');
    return {
      token: token,
      expire: expire,
      signature: signature,
    };
  }
}
