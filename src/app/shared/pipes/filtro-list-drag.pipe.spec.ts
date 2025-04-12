import { FiltroListDragPipe } from './filtro-list-drag.pipe';
import { SimpleObjet } from '../models/outros.model';

describe('FiltroListDragPipe', () => {
  let pipe: FiltroListDragPipe;

  beforeEach(() => {
    pipe = new FiltroListDragPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return the value when value is empty', () => {
    const value: SimpleObjet[] = [];
    const filtro = 'test';
    expect(pipe.transform(value, filtro, 0)).toEqual(value);
  });

  it('should return the value when filtro is empty', () => {
    const value: SimpleObjet[] = [{ id: 5, value: 'Nome do autor' }];
    const filtro = '';
    expect(pipe.transform(value, filtro, 0)).toEqual(value);
  });

  it('should filter the value based on filtro', () => {
    const value: SimpleObjet[] = [
      { id: 1, value: 'Nome do autor 1' },
      { id: 2, value: 'Nome do autor 2' },
      { id: 3, value: 'Nome do autor 3' }
    ];
    const filtro = 'Nome do autor 2';
    const expected = [
      { id: 2, value: 'Nome do autor 2' }
    ];
    const resultado = pipe.transform(value, filtro, 0);
    expect(resultado).toEqual(expected);
  });

  it('should filter the value based on filtro NOM coincidindo as maiúsculas', () => {
    const value: SimpleObjet[] = [
      { id: 1, value: 'Nome do autor 1' },
      { id: 2, value: 'Nome do autor 2' },
      { id: 3, value: 'Nome do autor 3' }
    ];
    const filtro = 'NOME do autor 2';
    const expected = [
      { id: 2, value: 'Nome do autor 2' }
    ];
    const resultado = pipe.transform(value, filtro, 0);
    expect(resultado).toEqual(expected);
  });

  it('should return an empty array when no matches are found', () => {
    const value: SimpleObjet[] = [
      { id: 1, value: 'Nome do autor 1' },
      { id: 2, value: 'Nome do autor 2' }
    ];
    const filtro = 'Nome do autor 100';
    expect(pipe.transform(value, filtro, 0)).toEqual([]);
  });
});
