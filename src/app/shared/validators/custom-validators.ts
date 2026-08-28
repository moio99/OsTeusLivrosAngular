import { ValidatorFn, AbstractControl, ValidationErrors } from "@angular/forms";
import { SchemaPathTree, validate } from "@angular/forms/signals";

export  class ValidaconsAMedida {

  /**
   * Valida que para um campasado que pode ser nulo o seu valor non exceda un certo número de caracteres.
   * @param campo nodo da árbore do formulario (un apuntador ou caminho) o chamado SchemaPath ou SchemaPathTree
   * @param max número de caracteres máximos
   * @param nomeCampo nome do campo para amosar a mensagem de erro
   */
  static maxLenNullable(campo: SchemaPathTree<string | null>, max: number, nomeCampo: string): void {
    validate(campo, (contexto) => {
      const texto = contexto.value();

      if (texto !== null && typeof texto === 'string' && texto.length > max) {
        return {
          kind: 'maxLength',
          message: `O campo ${nomeCampo} non pode superar os ${max} caracteres`
        };
      }
      return undefined;
    });
  }

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

      if (isNaN(dataInicio.getTime()) || isNaN(dataFin.getTime())) {
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
