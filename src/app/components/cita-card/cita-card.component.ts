import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IonButton, IonCard, IonCardContent, IonCardSubtitle, IonIcon } from '@ionic/angular';
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

  constructor() { addIcons({ trashOutline }); }

  alBorrar() { if (this.cita.id !== undefined) this.borrar.emit(this.cita.id); }

}
