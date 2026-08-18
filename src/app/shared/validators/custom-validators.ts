import { ValidatorFn, AbstractControl, ValidationErrors } from "@angular/forms";

export class ValidaconsAMedida {

  /**
   * Valida que a data Dese non sexa maior que a data Até.
   */
  static comprobarDuasDatas(nomeDataInicio: string, nomeDataFin: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const formGroup = control;
      const controlInicio = formGroup.get(nomeDataInicio);
      const controlFin = formGroup.get(nomeDataFin);

      if (!controlInicio?.value || !controlFin?.value) {
        return null;
      }

      const dataInicio = new Date(controlInicio.value);
      const dataFin = new Date(controlFin.value);

      if (isNaN(dataInicio.getTime()) || !isNaN(dataFin.getTime()) === false) {
        return null;
      }

      // Comprobación directa de milisegundos (evita todos os 'if' aniñados de ano, mes e día)
      if (dataInicio.getTime() > dataFin.getTime()) {
        // Asignamos o erro a ambos controis para que se mostre en calquera dos dous inputs
        controlInicio.setErrors({ ...controlInicio.errors, datasInvalidas: true });
        controlFin.setErrors({ ...controlFin.errors, datasInvalidas: true });
        return { datasInvalidas: true };
      }

      // Se a datas xa son correctas, retiramos o erro específico (sen borrar outros erros que puidese ter)
      if (controlInicio.hasError('datasInvalidas')) {
        const { datasInvalidas, ...outrosErros } = controlInicio.errors || {};
        controlInicio.setErrors(Object.keys(outrosErros).length ? outrosErros : null);
      }
      if (controlFin.hasError('datasInvalidas')) {
        const { datasInvalidas, ...outrosErros } = controlFin.errors || {};
        controlFin.setErrors(Object.keys(outrosErros).length ? outrosErros : null);
      }

      return null;
    };
  }
}
