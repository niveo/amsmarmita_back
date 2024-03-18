import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Marmita, MarmitaSchema } from 'src/schemas/marmita.schema';
import { MarmitaController } from './marmita.controller';
import { MarmitaService } from './marmita.service';
import { PedidoModule } from '../pedido/pedido.module';
import { PedidoService } from '../pedido/pedido.service';

@Module({
  controllers: [MarmitaController],
  providers: [MarmitaService],
  exports: [MarmitaService],
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Marmita.name,
        useFactory: (pedidoService: PedidoService) => {
          const schema = MarmitaSchema;
          schema.pre('deleteOne', function(next) {
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
          schema.pre('deleteMany', function(next) {
            next(new Error('Função não implementada'));
          });
          return schema;
        },
        imports: [PedidoModule],
        inject: [PedidoService],
      },

    ]),
  ],
})
export class MarmitaModule {
}
