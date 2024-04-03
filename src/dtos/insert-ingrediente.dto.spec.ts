import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { InsertIngredienteDto } from './insert-ingrediente.dto';

describe('InsertIngredienteDto', () => {
  it('Deve validar tamanho maximo de caracteres', async () => {
    const myBodyObject = {
      nome: 'A'.padEnd(55, 'B'),
      observacao: 'A'.padEnd(101, 'B'),
    };
    const myDtoObject = plainToInstance(InsertIngredienteDto, myBodyObject);
    const errors = await validate(myDtoObject);
    expect(errors.length).toBe(2);
  });

  it('Deve validar tipo', async () => {
    const myBodyObject = {
      nome: 1,
      observacao: 1,
    };

    const myDtoObject = plainToInstance(InsertIngredienteDto, myBodyObject);
    const errors = await validate(myDtoObject);
    expect(errors.length).toBe(2);
  });

  it('Deve validar valores obrigatórios', async () => {
    const myBodyObject = {};
    const myDtoObject = plainToInstance(InsertIngredienteDto, myBodyObject);
    const errors = await validate(myDtoObject);
    expect(errors.length).toBe(1);
  });

  it('Deve validar tamanho minimo de caracteres', async () => {
    const myBodyObject = {
      nome: 'A',
    };
    const myDtoObject = plainToInstance(InsertIngredienteDto, myBodyObject);
    const errors = await validate(myDtoObject);
    expect(errors.length).toBe(1);
  });
});
