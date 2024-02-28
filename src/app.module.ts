import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Comedores, ComedoresSchema } from './schemas/comedores.schema';
import { ComedoresService } from './services/comedores.service';
import { ComedoresController } from './controllers/comedores.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { URL_MONGODB } from './common/constantes';

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
    ]),
  ],
  controllers: [AppController, ComedoresController],
  providers: [AppService, ComedoresService],
})
export class AppModule {}
