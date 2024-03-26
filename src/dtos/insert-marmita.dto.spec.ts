import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { InsertMarmitaDto } from './insert-marmita.dto';

describe('InsertMarmitaDto', () => {
  it('Deve validar data valida', async () => {
    const myBodyObject = {
      lancamento: new Date(Date.parse('01/01/9999999999')),
      nome: 'AAAAAAA',
    };
    const myDtoObject = plainToInstance(InsertMarmitaDto, myBodyObject);
    const errors = await validate(myDtoObject);
    expect(errors.length).toBe(1);
  });

  it('Deve validar tamanho maximo de caracteres', async () => {
    const myBodyObject = {
      observacao: 'A'.padEnd(101, 'B'),
    };
    const myDtoObject = plainToInstance(InsertMarmitaDto, myBodyObject);
    const errors = await validate(myDtoObject);
    expect(errors.length).toBe(2);
  });

  it('Deve validar tipo', async () => {
    const myBodyObject = {
      observacao: 1,
      lancamento: 'A',
    };

    const myDtoObject = plainToInstance(InsertMarmitaDto, myBodyObject);
    const errors = await validate(myDtoObject);
    expect(errors.length).toBe(2);
  });

  it('Deve validar valores obrigatórios', async () => {
    const myBodyObject = {};
    const myDtoObject = plainToInstance(InsertMarmitaDto, myBodyObject);
    const errors = await validate(myDtoObject);
    expect(errors.length).toBe(1);
  });

  it('Deve validar tamanho minimo de caracteres', async () => {
    const myBodyObject = {
      nome: 'A',
    };
    const myDtoObject = plainToInstance(InsertMarmitaDto, myBodyObject);
    const errors = await validate(myDtoObject);
    expect(errors.length).toBe(1);
  });
});
