import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { InsertGrupoDto } from './insert-grupo.dto';

describe('InsertGrupoDto', () => {
  it('Deve validar tamanho maximo de caracteres', async () => {
    const myBodyObject = {
      nome: 'A'.padEnd(55, 'B'),
      observacao: 'A'.padEnd(101, 'B'),
      cor: 'A'.padEnd(101, 'B'),
    };
    const myDtoObject = plainToInstance(InsertGrupoDto, myBodyObject);
    const errors = await validate(myDtoObject);
    expect(errors.length).toBe(3);
  });

  it('Deve validar tipo', async () => {
    const myBodyObject = {
      nome: 1,
      observacao: 1,
      cor: 1,
      principal: 'A',
      multiplo: 'A',
    };

    const myDtoObject = plainToInstance(InsertGrupoDto, myBodyObject);
    const errors = await validate(myDtoObject);
    expect(errors.length).toBe(5);
  });

  it('Deve validar valores obrigatórios', async () => {
    const myBodyObject = {};
    const myDtoObject = plainToInstance(InsertGrupoDto, myBodyObject);
    const errors = await validate(myDtoObject);
    expect(errors.length).toBe(1);
  });

  it('Deve validar tamanho minimo de caracteres', async () => {
    const myBodyObject = {
      nome: 'A',
    };
    const myDtoObject = plainToInstance(InsertGrupoDto, myBodyObject);
    const errors = await validate(myDtoObject);
    expect(errors.length).toBe(1);
  });
});
