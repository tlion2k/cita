import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular';
import { CitasService } from './services/citas.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',     // <ion-app><ion-router-outlet></ion-router-outlet></ion-app>
  imports: [IonApp, IonRouterOutlet],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppComponent implements OnInit {
  constructor(private citas: CitasService) {}

  /** Ciclo de vida de Angular: inicializa SQLite al arrancar la app. */
  async ngOnInit() {
    await this.citas.iniciar();
  }
}
