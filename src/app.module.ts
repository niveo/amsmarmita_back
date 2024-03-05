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
      { name: Comedores.name, schema: ComedoresSchema },
      { name: Marmita.name, schema: MarmitaSchema },
      { name: Grupo.name, schema: GrupoSchema },
      { name: Pratos.name, schema: PratosSchema },
    ]),
  ],
  controllers: [
    AppController,
    ComedoresController,
    MarmitasController,
    GrupoController,
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
