import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Comedores, ComedoresSchema } from './schemas/comedores.schema';
import { ComedoresService } from './services/comedores.service';
import { ComedoresController } from './controllers/comedores.controller';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/marmitadb'),
    MongooseModule.forFeature([
      { name: Comedores.name, schema: ComedoresSchema },
    ]),
  ],
  controllers: [AppController, ComedoresController],
  providers: [AppService, ComedoresService],
})
export class AppModule {}
