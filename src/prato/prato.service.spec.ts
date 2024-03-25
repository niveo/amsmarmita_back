import { Test, TestingModule } from '@nestjs/testing';
import { PratoService } from './prato.service';
import { PratoModule } from './prato.module';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../test/mongo/mongoose-test.module';

describe('PratoService', () => {
  let pratoService: PratoService;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [rootMongooseTestModule(), PratoModule],
    }).compile();
    pratoService = app.get<PratoService>(PratoService);
  });

  it('should be defined', () => {
    expect(pratoService).toBeDefined();
  });

  describe('Processo CRUD', () => {
    let registroId: any;
    it('Verificar registro e nome do registro criado', async () => {
      const registro = await pratoService.create({
        grupo: '65e227dcc0461027f9417358',
        nome: 'Teste',
      });
      expect(registro).not.toBeNull();
      registroId = registro._id;
      const { nome } = registro;
      expect(nome).toEqual('Teste');
    });

    it('Atualizar nome do registro', async () => {
      const registroUpdate = await pratoService.update(registroId.toString(), {
        nome: 'Teste 2',
      });
      expect(registroUpdate.nome).toEqual('Teste 2');
    });

    it('Registro não pode ser nulo', async () => {
      const registroFind = await pratoService.findById(registroId.toString());
      expect(registroFind).not.toBeNull();
    });

    it('Deve retornar um registro', async () => {
      const registros = await pratoService.findAll();
      expect(registros).toHaveLength(1);
    });

    it('Remover registro', async () => {
      await pratoService.delete(registroId.toString());
    });
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });
});
