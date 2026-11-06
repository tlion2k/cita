import { ChangeDetectorRef, Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton } from '@ionic/angular';
import { CitasService } from '../../services/citas.service';
import { Cita } from '../../models/cita.model';
import { CitaCardComponent } from '../../components/cita-card/cita-card.component';
import { CitaFormComponent } from '../../components/cita-form/cita-form.component';

@Component({
  selector: 'app-gestion',
  templateUrl: './gestion.page.html',
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, CitaCardComponent, CitaFormComponent],
})
export class GestionPage {
  
  citas: Cita[] = [];
  constructor(private servicio: CitasService, private cdr: ChangeDetectorRef) {}

  async ionViewWillEnter() {
    try {
      this.citas = await this.servicio.obtenerTodas();
    } catch (e) {
      console.error('[Gestion] No se pudo cargar la lista', e);
    }
    this.cdr.detectChanges(); // fuerza el redibujado sin esperar un clic
  }

  async agregar(c: Cita) {
    await this.servicio.agregar(c);
    this.citas = await this.servicio.obtenerTodas();
    this.cdr.detectChanges();
  }

  async eliminar(id: number) {
    await this.servicio.eliminar(id);
    this.citas = await this.servicio.obtenerTodas();
    this.cdr.detectChanges();
  }
}
