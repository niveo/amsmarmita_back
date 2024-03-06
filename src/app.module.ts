import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { MongooseModule } from '@nestjs/mongoose';
import { Comedores, ComedoresSchema } from './schemas/comedores.schema';
import { Grupo, GrupoSchema } from './schemas/grupo.schema';
import { Pratos, PratosSchema } from './schemas/pratos.schema';
import { Marmita, MarmitaSchema } from './schemas/marmita.schema';
import { URL_MONGODB } from './common/constantes';

import { ComedoresService } from './services/comedores.service';
import { ComedoresController } from './controllers/comedores.controller';
import { MarmitasController } from './controllers/marmita.controller';
import { MarmitaService } from './services/marmita.service';
import { GrupoService } from './services/grupo.service';
import { GrupoController } from './controllers/grupo.controller';
import { PratoService } from './services/prato.service';
import { PratoController } from './controllers/prato.controller';

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
    MongooseModule.forFeatureAsync([
      { name: Comedores.name, useFactory: () => ComedoresSchema },
      { name: Marmita.name, useFactory: () => MarmitaSchema },
      { name: Grupo.name, useFactory: () => GrupoSchema },
      { name: Pratos.name, useFactory: () => PratosSchema },
    ]),
  ],
  controllers: [
    AppController,
    ComedoresController,
    MarmitasController,
    GrupoController,
    PratoController,
  ],
  providers: [
    AppService,
    ComedoresService,
    MarmitaService,
    GrupoService,
    PratoService,
  ],
})
export class AppModule {}
