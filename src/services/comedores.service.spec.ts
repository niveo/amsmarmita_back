import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from './prisma.service';
import { ComedorService } from './comedores.service';

describe('ComedoresService', () => {
  let comedoresService: ComedorService;

  beforeAll(async () => {

    const app: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [ComedorService, PrismaService],
    }).compile();

    comedoresService = app.get<ComedorService>(ComedorService);
  });

  it('should be defined', () => {
    expect(comedoresService).toBeDefined();
  });

  describe('Salvar Comedor', () => {
    it('Tem que retornar objeto salvo', async () => {
      const registro = await comedoresService.create({
        nome: 'Teste',
      });
      const { nome } = registro;
      expect(nome).toEqual('Teste');

      const registroUpdate = await comedoresService.update(registro.id, { nome: 'Teste 2' })
      expect(registroUpdate.nome).toEqual('Teste 2');

      const registroFind = await comedoresService.findById(registro.id);
      expect(registroFind).not.toBeNull();

      await comedoresService.delete(registro.id);
    });
  });
});
