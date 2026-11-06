import { ChangeDetectorRef, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton } from '@ionic/angular';
import { CitasService } from '../../services/citas.service';
import { PreferenciasService } from '../../services/preferencias.service';
import { Cita } from '../../models/cita.model';
import { CitaCardComponent } from '../../components/cita-card/cita-card.component';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  imports: [RouterLink, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, CitaCardComponent],
})
export class InicioPage {
  cita: Cita | null = null;

  /** Lee el signal del servicio: el botón Borrar se refresca solo cuando cambia la preferencia. */
  get puedeBorrar(): boolean {
    return this.prefs.borrarEnInicio();
  }

  constructor(
    private citas: CitasService,
    private prefs: PreferenciasService,
    private cdr: ChangeDetectorRef,
  ) {}

  async ionViewWillEnter() {
    try {
      await this.prefs.obtenerBorrarEnInicio(); // vuelve a leer lo guardado y actualiza el signal
      this.cita = await this.citas.aleatoria();
    } catch (e) {
      console.error('[Inicio] No se pudo cargar la cita', e);
    }
    this.cdr.detectChanges(); // fuerza el redibujado sin esperar un clic
  }

  async borrar(id: number) {
    await this.citas.eliminar(id);
    this.cita = await this.citas.aleatoria();
    this.cdr.detectChanges();
  }
}
