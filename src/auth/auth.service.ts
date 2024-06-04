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

  /**
   * import { Request } from 'express';
   * authImageKit(req: Request)
   * Não obter o token que vem do cliente para passar para o imagekit já que o mesmo vai sempre vir com a mesma sessão
   * colidindo com o token já passado para a autenticação do imagekit
   * https://github.com/imagekit-developer/imagekit-uppy-plugin/issues/3
   */
  authImageKit() {
    const token = /* extractTokenFromHeader(req) || */ v4();
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
