import { ValidaconsAMedida } from './custom-validators';
import { FormGroup, FormControl } from '@angular/forms';

describe('ValidaconsAMedida', () => {
  let formGroup: FormGroup;

  beforeEach(() => {
    formGroup = new FormGroup({
      dataInicio: new FormControl(null),
      dataFin: new FormControl(null),
    });
  });

  describe('comprobarDuasDatas', () => {
    it('debe devolver null cando ambas datas están baleiras', () => {
      const validator = ValidaconsAMedida.comprobarDuasDatas('dataInicio', 'dataFin');
      const result = validator(formGroup);

      expect(result).toBeNull();
    });

    it('debe devolver null cando só a data inicio está baleira', () => {
      formGroup.get('dataFin')?.setValue('2024-12-31');

      const validator = ValidaconsAMedida.comprobarDuasDatas('dataInicio', 'dataFin');
      const result = validator(formGroup);

      expect(result).toBeNull();
    });

    it('debe devolver null cando só a data fin está baleira', () => {
      formGroup.get('dataInicio')?.setValue('2024-01-01');

      const validator = ValidaconsAMedida.comprobarDuasDatas('dataInicio', 'dataFin');
      const result = validator(formGroup);

      expect(result).toBeNull();
    });

    it('debe devolver null cando as datas son válidas e en orde correcta', () => {
      formGroup.get('dataInicio')?.setValue('2024-01-01');
      formGroup.get('dataFin')?.setValue('2024-12-31');

      const validator = ValidaconsAMedida.comprobarDuasDatas('dataInicio', 'dataFin');
      const result = validator(formGroup);

      expect(result).toBeNull();
    });

    it('debe devolver null cando as datas son iguais', () => {
      const mismaData = '2024-06-15';
      formGroup.get('dataInicio')?.setValue(mismaData);
      formGroup.get('dataFin')?.setValue(mismaData);

      const validator = ValidaconsAMedida.comprobarDuasDatas('dataInicio', 'dataFin');
      const result = validator(formGroup);

      expect(result).toBeNull();
    });

    it('debe devolver obxecto de erro cando dataInicio é maior que dataFin', () => {
      formGroup.get('dataInicio')?.setValue('2024-12-31');
      formGroup.get('dataFin')?.setValue('2024-01-01');

      const validator = ValidaconsAMedida.comprobarDuasDatas('dataInicio', 'dataFin');
      const result = validator(formGroup);

      expect(result).toEqual({ datasInvalidas: true });
    });

    it('debe establecer o erro datasInvalidas en ambos controis cando as datas son inválidas', () => {
      formGroup.get('dataInicio')?.setValue('2024-12-31');
      formGroup.get('dataFin')?.setValue('2024-01-01');

      const validator = ValidaconsAMedida.comprobarDuasDatas('dataInicio', 'dataFin');
      validator(formGroup);

      expect(formGroup.get('dataInicio')?.hasError('datasInvalidas')).toBe(true);
      expect(formGroup.get('dataFin')?.hasError('datasInvalidas')).toBe(true);
    });

    it('debe limpar o erro datasInvalidas en ambos controis cando as datas son corrixidas', () => {
      // Primeiro establecemos datas inválidas
      formGroup.get('dataInicio')?.setValue('2024-12-31');
      formGroup.get('dataFin')?.setValue('2024-01-01');

      const validator = ValidaconsAMedida.comprobarDuasDatas('dataInicio', 'dataFin');
      validator(formGroup);

      expect(formGroup.get('dataInicio')?.hasError('datasInvalidas')).toBe(true);

      // Agora corriximos as datas
      formGroup.get('dataInicio')?.setValue('2024-01-01');
      formGroup.get('dataFin')?.setValue('2024-12-31');

      validator(formGroup);

      expect(formGroup.get('dataInicio')?.hasError('datasInvalidas')).toBe(false);
      expect(formGroup.get('dataFin')?.hasError('datasInvalidas')).toBe(false);
    });

    it('debe preservar outros erros cando se limpan os erros de datasInvalidas', () => {
      formGroup.get('dataInicio')?.setValue('2024-12-31');
      formGroup.get('dataFin')?.setValue('2024-01-01');

      const validator = ValidaconsAMedida.comprobarDuasDatas('dataInicio', 'dataFin');
      validator(formGroup);

      // Verificamos que se establecen os erros
      expect(formGroup.get('dataInicio')?.hasError('datasInvalidas')).toBe(true);
      expect(formGroup.get('dataFin')?.hasError('datasInvalidas')).toBe(true);

      // Agora corriximos as datas pero sen limpiar manualmente
      formGroup.get('dataInicio')?.setValue('2024-01-01');
      formGroup.get('dataFin')?.setValue('2024-12-31');
      formGroup.get('dataInicio')?.setErrors({ customError: true });

      // Executamos o validador de novo
      validator(formGroup);

      // O erro datasInvalidas non debe establecerse porque as datas son correctas
      expect(formGroup.get('dataInicio')?.hasError('datasInvalidas')).toBe(false);
      // E customError debe preservarse
      expect(formGroup.get('dataInicio')?.hasError('customError')).toBe(true);
    });

    it('debe devolver null cando as datas son datas válidas en formato ISO', () => {
      formGroup.get('dataInicio')?.setValue(new Date('2024-01-01').toISOString());
      formGroup.get('dataFin')?.setValue(new Date('2024-12-31').toISOString());

      const validator = ValidaconsAMedida.comprobarDuasDatas('dataInicio', 'dataFin');
      const result = validator(formGroup);

      expect(result).toBeNull();
    });

    it('debe devolver null cando os valores de data son obxectos Date', () => {
      formGroup.get('dataInicio')?.setValue(new Date('2024-01-01'));
      formGroup.get('dataFin')?.setValue(new Date('2024-12-31'));

      const validator = ValidaconsAMedida.comprobarDuasDatas('dataInicio', 'dataFin');
      const result = validator(formGroup);

      expect(result).toBeNull();
    });

    it('debe devolver null cando ambas datas son inválidas', () => {
      formGroup.get('dataInicio')?.setValue('fecha-invalida');
      formGroup.get('dataFin')?.setValue('otra-fecha-invalida');

      const validator = ValidaconsAMedida.comprobarDuasDatas('dataInicio', 'dataFin');
      const result = validator(formGroup);

      expect(result).toBeNull();
    });

    it('debe traballar con campos de data con nomes diferentes', () => {
      const formGroupCustom = new FormGroup({
        dataDende: new FormControl('2024-01-01'),
        dataAte: new FormControl('2024-12-31'),
      });

      const validator = ValidaconsAMedida.comprobarDuasDatas('dataDende', 'dataAte');
      const result = validator(formGroupCustom);

      expect(result).toBeNull();
    });

    it('debe establecer erros cando a data inicial é posterior á final con campos personalizados', () => {
      const formGroupCustom = new FormGroup({
        dataDende: new FormControl('2024-12-31'),
        dataAte: new FormControl('2024-01-01'),
      });

      const validator = ValidaconsAMedida.comprobarDuasDatas('dataDende', 'dataAte');
      const result = validator(formGroupCustom);

      expect(result).toEqual({ datasInvalidas: true });
      expect(formGroupCustom.get('dataDende')?.hasError('datasInvalidas')).toBe(true);
      expect(formGroupCustom.get('dataAte')?.hasError('datasInvalidas')).toBe(true);
    });
  });
});
