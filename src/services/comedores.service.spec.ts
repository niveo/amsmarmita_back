import { Test, TestingModule } from '@nestjs/testing';
import { RootModule } from '../root.module';
import { ComedorService } from './comedores.service';

describe('ComedorService', () => {
  let comedorService: ComedorService;

  beforeAll(async () => {
    //process.env.DATABASE_URL="mongodb://ams:sapphire@192.168.0.129:27017/marmitadbteste?eplicaSet=rs0";

    const app: TestingModule = await Test.createTestingModule({
      imports: [RootModule],
      providers: [ComedorService],
    }).compile();

    comedorService = app.get<ComedorService>(ComedorService);
  });

  it('should be defined', () => {
    expect(comedorService).toBeDefined();
  });

  describe('Processo CRUD', () => {
    let registroId: any;
    it('Verificar registro e nome do registro criado', async () => {
      const registro = await comedorService.create({
        nome: 'Teste',
      });
      expect(registro).not.toBeNull();
      registroId = registro._id;
      const { nome } = registro;
      expect(nome).toEqual('Teste');
    });

    it('Atualizar nome do registro', async () => {
      const registroUpdate = await comedorService.update(
        registroId.toString(),
        {
          nome: 'Teste 2',
        },
      );
      expect(registroUpdate.nome).toEqual('Teste 2');
    });

    it('Registro pesquisado não pode ser nulo', async () => {
      const registroFind = await comedorService.findById(registroId.toString());
      expect(registroFind).not.toBeNull();
    });

    it('Remover registro', async () => {
      await comedorService.delete(registroId.toString());
    });
  });
});
