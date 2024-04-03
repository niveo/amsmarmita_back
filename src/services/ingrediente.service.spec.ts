import { Test, TestingModule } from '@nestjs/testing';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../test/mongo/mongoose-test.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Ingrediente, IngredienteSchema } from '../schemas';
import { IngredienteService } from './ingrediente.service';

describe('IngredienteService', () => {
  let service: IngredienteService;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([
          { name: Ingrediente.name, schema: IngredienteSchema },
        ]),
      ],
      providers: [IngredienteService],
    }).compile();
    service = app.get<IngredienteService>(IngredienteService);
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
      });
      expect(registro).not.toBeNull();
      registroId = registro._id.toString();
      const { nome, observacao } = registro;
      expect(nome).toEqual('Teste');
      expect(observacao).toEqual('Teste');
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
