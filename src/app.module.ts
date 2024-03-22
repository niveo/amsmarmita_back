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
import { RootModule } from './root.module';

@Module({
  imports: [RootModule, PedidoModule, PratoModule, MarmitaModule],
  controllers: [AppController, ComedorController, GrupoController],
  providers: [AppService, ComedorService, GrupoService],
})
export class AppModule {}
