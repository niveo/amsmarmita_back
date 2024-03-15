import { Module } from '@nestjs/common';
import { PratoController } from './prato.controller';
import { PratoService } from './prato.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Prato, PratoSchema } from './prato.schema';

@Module({
  controllers: [PratoController],
  providers: [PratoService],
  exports: [PratoService],
  imports: [
    MongooseModule.forFeatureAsync([
      { name: Prato.name, useFactory: () => PratoSchema },
    ]),
  ],
})
export class PratoModule {}
