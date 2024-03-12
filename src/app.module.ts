import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { MongooseModule } from '@nestjs/mongoose';
import { Comedor, ComedorSchema } from './schemas/comedor.schema';
import { Grupo, GrupoSchema } from './schemas/grupo.schema';
import { Prato, PratoSchema } from './schemas/prato.schema';
import { Marmita, MarmitaSchema } from './schemas/marmita.schema';
import { URL_MONGODB } from './common/constantes';

import { ComedorService } from './services/comedores.service';
import { ComedorController } from './controllers/comedores.controller';
import { MarmitaController } from './controllers/marmita.controller';
import { MarmitaService } from './services/marmita.service';
import { GrupoService } from './services/grupo.service';
import { GrupoController } from './controllers/grupo.controller';
import { PratoService } from './services/prato.service';
import { PratoController } from './controllers/prato.controller';
import { Pedido, PedidoSchema } from './schemas/pedido.schema';
import { PedidoPrato, PedidoPratoSchema } from './schemas/pedido-prato.schema';
import { PedidoService } from './services/pedido.service';

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
      { name: Comedor.name, useFactory: () => ComedorSchema },
      {
        name: Marmita.name,
        useFactory: (pedidoService: PedidoService) => {
          const schema = MarmitaSchema;
          schema.pre('deleteOne', function () {
            console.log('deleteOne', this._id);
          });
          schema.pre(
            'deleteMany',
            { document: true, query: false },
            function () {
              console.log('deleteMany', this);
            },
          );
          return schema;
        },
      },
      { name: Grupo.name, useFactory: () => GrupoSchema },
      { name: Prato.name, useFactory: () => PratoSchema },

      {
        name: Pedido.name,
        useFactory: () => {
          const schema = PedidoSchema;
          schema.pre('save', function () {
            console.log('Hello from pre save');
          });

          return schema;
        },
      },

      { name: PedidoPrato.name, useFactory: () => PedidoPratoSchema },
    ]),
  ],
  controllers: [
    AppController,
    ComedorController,
    MarmitaController,
    GrupoController,
    PratoController,
  ],
  providers: [
    AppService,
    ComedorService,
    MarmitaService,
    GrupoService,
    PratoService,
    PedidoService,
  ],
})
export class AppModule {}
