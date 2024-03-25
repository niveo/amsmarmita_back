import { plainToInstance } from 'class-transformer';
import { InsertPratoDto } from './insert-prato.dto';
import { validate } from 'class-validator';

describe('InsertPratoDto', () => {
  it('Deve validar tamanho maximo de caracteres', async () => {
    const myBodyObject = {
      grupo: '1'.padEnd(26, '0'),
      nome: 'A'.padEnd(55, 'B'),
      observacao: 'A'.padEnd(101, 'B'),
    };
    const myDtoObject = plainToInstance(InsertPratoDto, myBodyObject);
    const errors = await validate(myDtoObject);
    expect(errors.length).toBe(3);
  });

  it('Deve validar tipo', async () => {
    const myBodyObject = {
      grupo: 1,
      nome: 1,
      observacao: 1,
      composicoes: '',
    };

    const myDtoObject = plainToInstance(InsertPratoDto, myBodyObject);
    const errors = await validate(myDtoObject);
    expect(errors.length).toBe(4);
  });

  it('Deve validar valores obrigatórios', async () => {
    const myBodyObject = {};
    const myDtoObject = plainToInstance(InsertPratoDto, myBodyObject);
    const errors = await validate(myDtoObject);
    expect(errors.length).toBe(2);
  });

  it('Deve validar tamanho minimo de caracteres', async () => {
    const myBodyObject = {
      nome: 'A',
      grupo: 'A',
    };
    const myDtoObject = plainToInstance(InsertPratoDto, myBodyObject);
    const errors = await validate(myDtoObject);
    expect(errors.length).toBe(2);
  });
});
