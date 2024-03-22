import { Test, TestingModule } from '@nestjs/testing';
import { PratoService } from './prato.service';
import { PrismaService } from '../services/prisma.service';

describe('PratoService', () => {
  let pratoService: PratoService;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [PratoService, PrismaService],
    }).compile();

    pratoService = app.get<PratoService>(PratoService);
  });

  it('should be defined', () => {
    expect(pratoService).toBeDefined();
  });

  describe('Salvar Grupo', () => {
    it('Tem que retornar objeto salvo', async () => {
      const registro = await pratoService.create({
        nome: 'Teste',
        observacao: 'Teste',
        principal: false,
      });
      const { nome } = registro;
      expect(nome).toEqual('Teste');

      const registroUpdate = await pratoService.update(registro.id, {
        nome: 'Teste 2',
      });
      expect(registroUpdate.nome).toEqual('Teste 2');

      const registroFind = await pratoService.findById(registro.id);
      expect(registroFind).not.toBeNull();

      await PratoService.delete(registro.id);
    });
  });
});
