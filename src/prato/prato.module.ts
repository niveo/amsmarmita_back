import { Module } from '@nestjs/common';
import { PratoController } from './prato.controller';
import { PratoService } from './prato.service';
import { MongooseFeatureMogule } from '../common/mongoose-feature.module';

@Module({
  controllers: [PratoController],
  providers: [PratoService],
  exports: [PratoService],
  imports: [MongooseFeatureMogule],
})
export class PratoModule {}
