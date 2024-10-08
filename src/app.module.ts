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
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/auth.guard';
import { AuthModule } from './auth/auth.module';
import { MongooseFeatureMogule } from './common/mongoose-feature.module';
import { IngredienteService } from './services/ingrediente.service';
import { IngredienteController } from './controllers/ingrediente.controller';
import { RelatorioService } from './services/relatorio.service';
import { RelatorioController } from './controllers/relatorio.controller';
import { ParametroService } from './services/parametros.service';

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
    MongooseFeatureMogule,
    PedidoModule,
    PratoModule,
    MarmitaModule,
    AuthModule,
  ],
  controllers: [
    AppController,
    RelatorioController,
    ComedorController,
    GrupoController,
    IngredienteController,
  ],
  providers: [
    AppService,
    RelatorioService,
    ComedorService,
    GrupoService,
    IngredienteService,
    ParametroService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
