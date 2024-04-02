import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { InsertPedidoItemDto } from './insert-pedido-item.dto';

describe('InsertPedidoItemDto', () => {
  it('Deve validar tamanho maximo de caracteres', async () => {
    const myBodyObject = {
      comedor: '1'.padEnd(26, '0'),
      marmita: '1'.padEnd(26, '0'),
      prato: '1'.padEnd(26, '0'),
      quantidade: 0,
      acompanhamentos: [],
    };
    const myDtoObject = plainToInstance(InsertPedidoItemDto, myBodyObject);
    const errors = await validate(myDtoObject);
    expect(errors.length).toBe(3);
  });

  it('Deve validar tipo', async () => {
    const myBodyObject = {
      comedor: 1,
      marmita: 1,
      prato: 1,
      quantidade: 'A',
      acompanhamentos: 'A',
    };

    const myDtoObject = plainToInstance(InsertPedidoItemDto, myBodyObject);
    const errors = await validate(myDtoObject);
    expect(errors.length).toBe(5);
  });

  it('Deve validar valores obrigatórios', async () => {
    const myBodyObject = {};
    const myDtoObject = plainToInstance(InsertPedidoItemDto, myBodyObject);
    const errors = await validate(myDtoObject);
    expect(errors.length).toBe(4);
  });

  it('Deve validar tamanho minimo de caracteres', async () => {
    const myBodyObject = {
      comedor: '1',
      marmita: '1',
      prato: '1',
      quantidade: 0,
      acompanhamentos: [],
    };
    const myDtoObject = plainToInstance(InsertPedidoItemDto, myBodyObject);
    const errors = await validate(myDtoObject);
    expect(errors.length).toBe(3);
  });
});
