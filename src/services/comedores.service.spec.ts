import { Test, TestingModule } from '@nestjs/testing';
import { ComedorService } from './comedores.service';
import { RootModule } from '../root.module';

describe('ComedoresService', () => {
  let comedoresService: ComedorService;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [RootModule],
      providers: [ComedorService],
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

      const registroUpdate = await comedoresService.update(
        registro._id.toString(),
        {
          nome: 'Teste 2',
        },
      );
      expect(registroUpdate.nome).toEqual('Teste 2');

      const registroFind = await comedoresService.findById(
        registro._id.toString(),
      );
      expect(registroFind).not.toBeNull();

      await comedoresService.delete(registro._id.toString());
    });
  });
});
