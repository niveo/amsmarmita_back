import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { MongooseModule } from '@nestjs/mongoose';
import { URL_MONGODB } from './common/constantes';
import { Comedor, ComedorSchema } from './schemas/comedor.schema';
import { Grupo, GrupoSchema } from './schemas/grupo.schema';
import { Marmita } from './schemas/marmita.schema';

import { ComedorController } from './controllers/comedores.controller';
import { GrupoController } from './controllers/grupo.controller';
import { MarmitaModule } from './marmita/marmita.module';
import { PedidoModule } from './pedido/pedido.module';
import { PratoModule } from './prato/prato.module';
import { PratoService } from './prato/prato.service';
import { ComedorService } from './services/comedores.service';
import { GrupoService } from './services/grupo.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useFactory: (config: ConfigService) => {
        console.log(config.get(URL_MONGODB))
        return {
          uri: config.get(URL_MONGODB),
        };
      },
      inject: [ConfigService],
    }),
    MongooseModule.forFeatureAsync([
      { name: Comedor.name, useFactory: () => ComedorSchema },
      {
        name: Grupo.name,
        useFactory: (pratoService: PratoService) => {
          const schema = GrupoSchema;
          schema.pre('deleteOne', function(next) {
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
          schema.pre('deleteMany', function(next) {
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
    MarmitaModule
  ],
  controllers: [
    AppController,
    ComedorController,
    GrupoController,
  ],
  providers: [AppService, ComedorService, GrupoService],
})
export class AppModule { }
