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

  describe('Salvar Grupo', () => {
    it('Tem que retornar objeto salvo', async () => {
      const registro = await grupoService.create({
        nome: 'Teste',
        observacao: 'Teste',
        principal: false,
      });
      const { nome } = registro;
      expect(nome).toEqual('Teste');
    });
  });

  describe('Atualizar Grupo', () => {
    it('Tem que retornar objeto salvo', async () => {
      const registro = await grupoService.create({
        nome: 'Teste',
        observacao: 'Teste',
        principal: false,
      });
      const { nome } = registro;
      expect(nome).toEqual('Teste');

      const registroUpdate = await grupoService.update(
        registro._id.toString(),
        {
          nome: 'Teste 2',
        },
      );
      expect(registroUpdate.nome).toEqual('Teste 2');
    });
  });

  describe('Remover Grupo', () => {
    it('Tem que retornar objeto salvo', async () => {
      const registro = await grupoService.create({
        nome: 'Teste',
        observacao: 'Teste',
        principal: false,
      });

      await grupoService.delete(registro._id.toString());
    });
  });

  describe('Pesquisar Grupo', () => {
    it('Tem que retornar objeto salvo', async () => {
      const registro = await grupoService.create({
        nome: 'Teste',
        observacao: 'Teste',
        principal: false,
      });

      const registroFind = await grupoService.findById(registro._id.toString());
      expect(registroFind).not.toBeNull();
    });
  });
});
