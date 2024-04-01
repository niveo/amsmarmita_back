import { Module } from '@nestjs/common';
import { PratoController } from './prato.controller';
import { PratoService } from './prato.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Prato, PratoSchema } from './prato.schema';
import { Grupo, GrupoSchema } from '../schemas/grupo.schema';

@Module({
  controllers: [PratoController],
  providers: [PratoService],
  exports: [PratoService],
  imports: [
    MongooseModule.forFeature([
      { name: Prato.name, schema: PratoSchema },
      { name: Grupo.name, schema: GrupoSchema },
    ]),
  ],
})
export class PratoModule {}
