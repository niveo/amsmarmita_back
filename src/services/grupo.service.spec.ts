import { Test, TestingModule } from '@nestjs/testing';
import { GrupoService } from './grupo.service';
import { RootModule } from '../root.module';

describe('GrupoService', () => {
  let grupoService: GrupoService;

  beforeAll(async () => {
    //process.env.DATABASE_URL="mongodb://ams:sapphire@192.168.0.129:27017/marmitadbteste?eplicaSet=rs0";

    const app: TestingModule = await Test.createTestingModule({
      imports: [RootModule],
      providers: [GrupoService],
    }).compile();

    grupoService = app.get<GrupoService>(GrupoService);
  });

  it('should be defined', () => {
    expect(grupoService).toBeDefined();
  });

  describe('Processo CRUD', () => {
    let registroId: any;
    it('Verificar registro e nome do registro criado', async () => {
      const registro = await grupoService.create({
        nome: 'Teste',
        observacao: 'Teste',
        principal: false,
      });
      expect(registro).not.toBeNull();
      registroId = registro._id;
      const { nome } = registro;
      expect(nome).toEqual('Teste');
    });

    it('Atualizar nome do registro', async () => {
      const registroUpdate = await grupoService.update(registroId.toString(), {
        nome: 'Teste 2',
      });
      expect(registroUpdate.nome).toEqual('Teste 2');
    });

    it('Registro pesquisado não pode ser nulo', async () => {
      const registroFind = await grupoService.findById(registroId.toString());
      expect(registroFind).not.toBeNull();
    });

    it('Remover registro', async () => {
      await grupoService.delete(registroId.toString());
    });
  });
});
