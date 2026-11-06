import { ChangeDetectorRef, Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonToggle, IonButtons, IonBackButton } from '@ionic/angular';
import { PreferenciasService } from '../../services/preferencias.service';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.page.html',
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonToggle, IonButtons, IonBackButton],
})
export class ConfiguracionPage {
  borrarEnInicio = false;

  constructor(private prefs: PreferenciasService, private cdr: ChangeDetectorRef) {}

  /** Ciclo de vida de Ionic: se ejecuta cada vez que la página aparece. */
  async ionViewWillEnter() {
    this.borrarEnInicio = await this.prefs.obtenerBorrarEnInicio();
    this.cdr.detectChanges(); // que el interruptor muestre el valor guardado real
  }

  async cambiar(ev: CustomEvent) {
    const nuevo: boolean = ev.detail.checked;
    if (nuevo === this.borrarEnInicio) return; // evita guardar si no hubo cambio real
    this.borrarEnInicio = nuevo;
    await this.prefs.guardarBorrarEnInicio(nuevo);
  }
}
