import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Comedor, ComedorSchema } from './schemas/comedor.schema';
import { Grupo, GrupoSchema } from './schemas/grupo.schema';
import { PratoService } from './prato/prato.service';
import { Marmita } from './schemas/marmita.schema';
import { URL_MONGODB } from './common/constantes';
import { PratoModule } from './prato/prato.module';
import './common/prototype.extensions';

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
        inject: [PratoService],
        imports: [PratoModule],
      },
    ]),
  ],
  exports: [MongooseModule],
})
export class RootModule {}
