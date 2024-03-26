import { PratoModule } from '../prato/prato.module';
import { PratoService } from '../prato/prato.service';
import { Test, TestingModule } from '@nestjs/testing';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from './mongo/mongoose-test.module';
import { MongooseModule } from '@nestjs/mongoose';
import { GrupoService } from '../services/grupo.service';
import { GrupoSchema } from '../schemas/grupo.schema';

describe('PratoGrupoTest', () => {
  let pratoService: PratoService;
  let grupoService: GrupoService;
  let grupoId: string;
  let pratoId: string;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        PratoModule,
        MongooseModule.forFeature([{ name: 'Grupo', schema: GrupoSchema }]),
      ],
      providers: [GrupoService],
    }).compile();
    pratoService = app.get<PratoService>(PratoService);
    grupoService = app.get<GrupoService>(GrupoService);
  });

  it('should be defined', () => {
    expect(grupoService).toBeDefined();
    expect(pratoService).toBeDefined();
  });

  it('Deve retornar não nulo grupo', async () => {
    const registro = await grupoService.create({
      nome: 'Teste',
      observacao: 'Teste',
      principal: false,
    });
    expect(registro).not.toBeNull();
    grupoId = registro._id.toString();
  });

  it('Deve retornar não nulo prato', async () => {
    const registro = await pratoService.create({
      grupo: grupoId,
      nome: 'Teste',
    });
    expect(registro).not.toBeNull();
    pratoId = registro._id.toString();
  });

  it('Deve retornar grupo de produto no prato', async () => {
    const registro = await pratoService.findById(pratoId);
    expect(registro).not.toBeNull();
    expect(registro.grupo).not.toBeNull();
    expect(registro.grupo._id.toString()).toEqual(grupoId);
  });

  it('Deve remover grupo e pratos em cascade', async () => {
    const removidos = await grupoService.delete(grupoId);
    expect(removidos).toEqual(true);

    const pratoRegistro = await pratoService.findById(pratoId);
    expect(pratoRegistro).toBeNull();
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });
});
