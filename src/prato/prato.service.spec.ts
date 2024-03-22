import { Test, TestingModule } from '@nestjs/testing';
import { PratoService } from './prato.service';
import { RootModule } from '../root.module';
import { PratoModule } from './prato.module';

describe('PratoService', () => {
  let pratoService: PratoService;

  beforeAll(async () => {
    //process.env.DATABASE_URL="mongodb://ams:sapphire@192.168.0.129:27017/marmitadbteste?eplicaSet=rs0";

    const app: TestingModule = await Test.createTestingModule({
      imports: [RootModule, PratoModule],
      providers: [],
    }).compile();

    pratoService = app.get<PratoService>(PratoService);
  });

  it('should be defined', () => {
    expect(pratoService).toBeDefined();
  });

  describe('Salvar Prato', () => {
    it('Tem que retornar objeto salvo', async () => {
      const registro = await pratoService.create({
        grupoId: '65e227dcc0461027f9417358',
        nome: 'Teste',
      });
      const { nome } = registro;
      expect(nome).toEqual('Teste');

      const registroUpdate = await pratoService.update(
        registro._id.toString(),
        {
          nome: 'Teste 2',
        },
      );
      expect(registroUpdate.nome).toEqual('Teste 2');

      const registroFind = await pratoService.findById(registro._id.toString());
      expect(registroFind).not.toBeNull();

      await pratoService.delete(registro._id.toString());
    });
  });
});
