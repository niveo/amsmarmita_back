import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ComedorController } from './controllers/comedores.controller';
import { GrupoController } from './controllers/grupo.controller';
import { MarmitaModule } from './marmita/marmita.module';
import { PedidoModule } from './pedido/pedido.module';
import { PratoModule } from './prato/prato.module';
import { ComedorService } from './services/comedores.service';
import { GrupoService } from './services/grupo.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { URL_MONGODB } from './common/constantes';
import { Comedor, ComedorSchema } from './schemas/comedor.schema';
import { Grupo, GrupoSchema } from './schemas/grupo.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useFactory: (config: ConfigService) => {
        return {
          uri: config.get(URL_MONGODB),
        };
      },
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: Comedor.name, schema: ComedorSchema },
      { name: Grupo.name, schema: GrupoSchema },
    ]),
    PedidoModule,
    PratoModule,
    MarmitaModule,
  ],
  controllers: [AppController, ComedorController, GrupoController],
  providers: [AppService, ComedorService, GrupoService],
})
export class AppModule {}
