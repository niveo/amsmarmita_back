import { Test, TestingModule } from '@nestjs/testing';
import { GrupoService } from './grupo.service';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../test/mongo/mongoose-test.module';
import { MongooseModule } from '@nestjs/mongoose';
import { PratoModule } from '../prato/prato.module';
import { Grupo, GrupoSchema } from '../schemas/grupo.schema';

describe('GrupoService', () => {
  let service: GrupoService;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([{ name: Grupo.name, schema: GrupoSchema }]),
        PratoModule,
      ],
      providers: [GrupoService],
    }).compile();
    service = app.get<GrupoService>(GrupoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Processo CRUD', () => {
    let registroId: string;
    it('Verificar registro e nome do registro criado', async () => {
      const registro = await service.create({
        nome: 'Teste',
        observacao: 'Teste',
        principal: false,
      });
      expect(registro).not.toBeNull();
      registroId = registro._id.toString();
      const { nome } = registro;
      expect(nome).toEqual('Teste');
    });

    it('Atualizar nome do registro', async () => {
      const registroUpdate = await service.update(registroId, {
        nome: 'Teste 2',
      });
      expect(registroUpdate.nome).toEqual('Teste 2');
    });

    it('Registro não pode ser nulo', async () => {
      const registroFind = await service.findById(registroId);
      expect(registroFind).not.toBeNull();
    });

    it('Deve retornar um registro', async () => {
      const registros = await service.findAll();
      expect(registros).toHaveLength(1);
    });

    it('Deve retornar um registro removido', async () => {
      const removidos = await service.delete(registroId);
      expect(removidos).toEqual(true);
    });
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });
});
