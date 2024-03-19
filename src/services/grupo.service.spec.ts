import { Test, TestingModule } from '@nestjs/testing';
import { GrupoService } from './grupo.service';
import { PrismaService } from './prisma.service';

describe('GrupoService', () => {
  let grupoService: GrupoService;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [GrupoService, PrismaService],
    }).compile();

    grupoService = app.get<GrupoService>(GrupoService);
  });

  it('should be defined', () => {
    expect(grupoService).toBeDefined();
  });

  describe('Salvar Grupoo', () => {
    it('Tem que retornar objeto salvo', async () => {
      const registro = await grupoService.create({
        nome: 'Teste',
        observacao: 'Teste',
        principal: false,
      });
      const { nome } = registro;
      expect(nome).toEqual('Teste');

      const removido = await grupoService.delete(registro.id);
      expect(removido).not.toBeNull();
    });
  });
});
