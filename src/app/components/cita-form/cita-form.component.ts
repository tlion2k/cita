import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonInput, IonButton, IonText } from '@ionic/angular';
import { Cita } from '../../models/cita.model';

@Component({
  selector: 'app-cita-form',
  templateUrl: './cita-form.component.html',
  imports: [ReactiveFormsModule, IonInput, IonButton, IonText],
})
export class CitaFormComponent {
  @Output() agregar = new EventEmitter<Cita>();

  form = this.fb.nonNullable.group({
    frase: ['', [Validators.required, Validators.minLength(5)]],
    autor: ['', [Validators.required, Validators.minLength(2)]],
  });

  constructor(private fb: FormBuilder) {}

  enviar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    // valido o camino feliz
    this.agregar.emit(this.form.getRawValue());
    this.form.reset();
  }

  error(campo: 'frase' | 'autor'): string {
    const c = this.form.controls[campo];
    if (!c.touched || c.valid) return '';
    if (c.hasError('required')) return 'Este campo es obligatorio.';

    const min = c.getError('minlength').requiredLength;
    return `Debe tener al menos ${min} caracteres.`;
  }
}
