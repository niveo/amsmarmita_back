import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Comedores, ComedoresSchema } from './schemas/comedores.schema';
import { ComedoresService } from './services/comedores.service';
import { ComedoresController } from './controllers/comedores.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { URL_MONGODB } from './common/constantes';
import { Marmita, MarmitaSchema } from './schemas/marmita.schema';
import { MarmitasController } from './controllers/marmita.controller';
import { MarmitaService } from './services/marmita.service';

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
    ]),
  ],
  controllers: [AppController, ComedoresController, MarmitasController],
  providers: [AppService, ComedoresService, MarmitaService],
})
export class AppModule {}
