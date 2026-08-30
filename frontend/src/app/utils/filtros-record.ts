import { signal, WritableSignal } from '@angular/core';

/**
 * Historial de UN solo nivel para los filtros de una tabla.
 * Antes de "Limpiar filtros" se guarda la última combinación de filtros activa
 * y se puede restaurar con un clic. El estado vive en memoria del componente
 * (no persiste entre recargas de página) y se consume al usarse o se descarta
 * cuando el usuario modifica un filtro manualmente.
 */
export interface FiltrosAnteriores<T> {
  /** true mientras exista una combinación de filtros disponible para restaurar. */
  readonly visible: WritableSignal<boolean>;
  guardar(valores: T): void;
  restaurar(aplicar: (valores: T) => void): boolean;
  descartar(): void;
}

export function crearFiltrosAnteriores<T>(): FiltrosAnteriores<T> {
  let prev: T | null = null;
  const visible = signal(false);

  return {
    visible,
    guardar: (valores) => {
      prev = { ...valores } as T;
      visible.set(true);
    },
    restaurar: (aplicar) => {
      if (!prev) return false;
      aplicar({ ...prev } as T);
      prev = null;
      visible.set(false);
      return true;
    },
    descartar: () => {
      prev = null;
      visible.set(false);
    },
  };
}