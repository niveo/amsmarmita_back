import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { MongooseModule } from '@nestjs/mongoose';
import { Comedor, ComedorSchema } from './schemas/comedor.schema';
import { Grupo, GrupoSchema } from './schemas/grupo.schema';
import { Marmita, MarmitaSchema } from './schemas/marmita.schema';
import { URL_MONGODB } from './common/constantes';

import { ComedorService } from './services/comedores.service';
import { ComedorController } from './controllers/comedores.controller';
import { MarmitaController } from './controllers/marmita.controller';
import { MarmitaService } from './services/marmita.service';
import { GrupoService } from './services/grupo.service';
import { GrupoController } from './controllers/grupo.controller';
import { PedidoModule } from './pedido/pedido.module';
import { PedidoService } from './pedido/pedido.service';
import { PratoModule } from './prato/prato.module';
import { PratoService } from './prato/prato.service';

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
            next(new Error('Função não implementada'));
          });
          return schema;
        },
        imports: [PedidoModule],
        inject: [PedidoService],
      },
      {
        name: Grupo.name,
        useFactory: (pratoService: PratoService) => {
          const schema = GrupoSchema;
          schema.pre('deleteOne', function (next) {
            const id = this.getQuery()['_id'].toString();
            console.log('deleteOne', this.model.name, id);
            pratoService.deletePratoId(id).then((ret: boolean) => {
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
            next(new Error('Função não implementada'));
          });
          return schema;
        },
        imports: [PratoModule],
        inject: [PratoService],
      },
    ]),
    PedidoModule,
    PratoModule,
  ],
  controllers: [
    AppController,
    ComedorController,
    MarmitaController,
    GrupoController,
  ],
  providers: [AppService, ComedorService, MarmitaService, GrupoService],
})
export class AppModule {}
