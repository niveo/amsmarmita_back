import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { InsertComerdoresDto } from './insert-comedores.dto';

describe('InsertComerdoresDto', () => {
  it('Deve validar tamanho maximo de caracteres', async () => {
    const myBodyObject = {
      nome: 'A'.padEnd(55, 'B'),
    };
    const myDtoObject = plainToInstance(InsertComerdoresDto, myBodyObject);
    const errors = await validate(myDtoObject);
    expect(errors.length).toBe(1);
  });

  it('Deve validar tipo', async () => {
    const myBodyObject = {
      nome: 1,
    };

    const myDtoObject = plainToInstance(InsertComerdoresDto, myBodyObject);
    const errors = await validate(myDtoObject);
    expect(errors.length).toBe(1);
  });

  it('Deve validar valores obrigatórios', async () => {
    const myBodyObject = {};
    const myDtoObject = plainToInstance(InsertComerdoresDto, myBodyObject);
    const errors = await validate(myDtoObject);
    expect(errors.length).toBe(1);
  });

  it('Deve validar tamanho minimo de caracteres', async () => {
    const myBodyObject = {
      nome: 'A',
    };
    const myDtoObject = plainToInstance(InsertComerdoresDto, myBodyObject);
    const errors = await validate(myDtoObject);
    expect(errors.length).toBe(1);
  });
});
