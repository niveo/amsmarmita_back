import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JWT_EXPIRATION_TIME, JWT_SUB_KEY, PASSWORD } from '../common/constantes';
import { sha256 } from 'js-sha256';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private config: ConfigService
  ) { }

  async signIn(
    pass: string,
  ): Promise<{ access_token: string }> {

    console.log('entrada: ', this.config.get(PASSWORD))
    console.log('input:', pass)
    const passsh256 = sha256.update(this.config.get(PASSWORD)).hex();

    console.log(passsh256)

    console.log(passsh256 === pass)

    if (passsh256 !== pass) {
      throw new UnauthorizedException();
    }
    const payload = {
      sub: this.config.get(JWT_SUB_KEY),
      expiresIn: this.config.get(JWT_EXPIRATION_TIME)
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
