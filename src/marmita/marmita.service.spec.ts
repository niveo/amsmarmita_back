import { Test, TestingModule } from '@nestjs/testing';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../test/mongo/mongoose-test.module';
import { MarmitaModule } from './marmita.module';
import { MarmitaService } from './marmita.service';

describe('MarmitaService', () => {
  let service: MarmitaService;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [rootMongooseTestModule(), MarmitaModule],
    }).compile();
    service = app.get<MarmitaService>(MarmitaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Processo CRUD', () => {
    let registroId: string;
    it('Verificar registro e nome do registro criado', async () => {
      const data = new Date();
      const registro = await service.create({
        lancamento: data,
        observacao: 'Teste',
      });
      expect(registro).not.toBeNull();
      registroId = registro._id.toString();
      const { lancamento } = registro;
      expect(lancamento).toEqual(data);
    });

    it('Atualizar nome do registro', async () => {
      const data = new Date();
      const registroUpdate = await service.update(registroId, {
        lancamento: data,
      });
      expect(registroUpdate.lancamento).toEqual(data);
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
