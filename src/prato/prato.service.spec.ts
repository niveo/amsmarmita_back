import { Test, TestingModule } from '@nestjs/testing';
import { PratoService } from './prato.service';
import { PratoModule } from './prato.module';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../test/mongo/mongoose-test.module';

describe('PratoService', () => {
  let service: PratoService;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [rootMongooseTestModule(), PratoModule],
    }).compile();
    service = app.get<PratoService>(PratoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Processo CRUD', () => {
    let registroId: string;
    it('Verificar registro e nome do registro criado', async () => {
      const registro = await service.create({
        grupo: '65e227dcc0461027f9417358',
        nome: 'Teste',
        ingredientes: ['660d408c1b739a1fdd657f49', '660d40d0ff3c3dbd7acf71a4'],
      });
      expect(registro).not.toBeNull();
      registroId = registro._id.toString();
      const { nome, ingredientes } = registro;
      expect(nome).toEqual('Teste');
      expect(ingredientes).toHaveLength(2);
    });

    it('Atualizar nome do registro', async () => {
      const registroUpdate = await service.update(registroId.toString(), {
        nome: 'Teste 2',
      });
      expect(registroUpdate.nome).toEqual('Teste 2');
    });

    it('Registro não pode ser nulo', async () => {
      const registroFind = await service.findById(registroId.toString());
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
