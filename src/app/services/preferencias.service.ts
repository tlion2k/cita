import { Injectable, signal } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({ providedIn: 'root' })
export class PreferenciasService {
  private readonly CLAVE_BORRAR = 'borrarEnInicio';

  /**
   * Valor en memoria, sincronizado con el almacenamiento persistente.
   * Las plantillas que lo lean (`prefs.borrarEnInicio()`) se refrescan solas al cambiar.
   */
  readonly borrarEnInicio = signal(false);

  constructor() {
    void this.obtenerBorrarEnInicio(); // carga el valor guardado al crear el servicio
  }

  async obtenerBorrarEnInicio(): Promise<boolean> {
    const { value } = await Preferences.get({ key: this.CLAVE_BORRAR });
    const valor = value === 'true';
    this.borrarEnInicio.set(valor);
    return valor;
  }

  async guardarBorrarEnInicio(valor: boolean): Promise<void> {
    this.borrarEnInicio.set(valor); // la UI cambia al instante
    await Preferences.set({ key: this.CLAVE_BORRAR, value: String(valor) });
  }
}
