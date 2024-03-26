import { Test, TestingModule } from '@nestjs/testing';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../test/mongo/mongoose-test.module';
import { ComedorService } from './comedores.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Comedor, ComedorSchema } from '../schemas/comedor.schema';

describe('ComedorService', () => {
  let service: ComedorService;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([
          { name: Comedor.name, schema: ComedorSchema },
        ]),
      ],
      providers: [ComedorService],
    }).compile();
    service = app.get<ComedorService>(ComedorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Processo CRUD', () => {
    let registroId: string;
    it('Verificar registro e nome do registro criado', async () => {
      const registro = await service.create({
        nome: 'Teste',
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
