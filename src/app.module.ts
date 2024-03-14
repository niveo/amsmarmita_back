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
import { PedidoModule } from './pedido/pedido.module';
import { PedidoService } from './pedido/pedido.service';

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
          schema.pre('deleteOne', function (next) {
            const id = this.getQuery()['_id'].toString();
            console.log('deleteOne', this.model.name, id);
            pedidoService.deleteMarmitaId(id).then((ret: boolean) => {
              if (ret) {
                next();
              } else {
                console.error(
                  'Não foi possivel excluir os pedidos vinculados a ' +
                    Marmita.name +
                    ' id ' +
                    id,
                );
              }
            });
          });
          schema.pre('deleteMany', function (next) {
            const ids = this.getQuery()['_id']['$in'];
            console.log('deleteMany', this.model.name, ids);
            pedidoService.deleteMarmitaIds(ids).then((ret: boolean) => {
              if (ret) {
                next();
              } else {
                console.error(
                  'Não foi possivel excluir os pedidos vinculados a ' +
                    Marmita.name +
                    ' ids ' +
                    ids,
                );
              }
            });
          });
          return schema;
        },
        imports: [PedidoModule],
        inject: [PedidoService],
      },
      { name: Grupo.name, useFactory: () => GrupoSchema },
      { name: Prato.name, useFactory: () => PratoSchema },
    ]),
    PedidoModule,
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
  ],
})
export class AppModule {}
