import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AlertController, IonButton, IonCard, IonCardContent, IonCardSubtitle, IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { trashOutline } from 'ionicons/icons';
import { Cita } from '../../models/cita.model';

@Component({
  selector: 'app-cita-card',
  templateUrl: './cita-card.component.html',
  styleUrls: ['./cita-card.component.scss'],
  standalone: true,
  imports: [IonCard, IonCardContent, IonCardSubtitle, IonButton, IonIcon],
})

export class CitaCardComponent  {
  @Input({ required: true }) cita!: Cita;
  @Input() permitirBorrar = false;
  @Output() borrar = new EventEmitter<number>();

  constructor(private alertCtrl: AlertController) { addIcons({ trashOutline }); }

  /** Pide confirmación; solo emite `borrar` si el usuario responde "Sí". */
  async alBorrar() {
    const id = this.cita.id;
    if (id === undefined) return;

    const alerta = await this.alertCtrl.create({
      header: 'Eliminar cita',
      message: '¿Seguro que quieres eliminar esta cita?',
      buttons: [
        { text: 'No', role: 'cancel' },
        { text: 'Sí', role: 'confirm', handler: () => this.borrar.emit(id) },
      ],
    });
    await alerta.present();
  }

}
