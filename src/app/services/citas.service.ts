import { Injectable, NgZone } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Cita } from '../models/cita.model';

const DB_NOMBRE = 'citas_db';

/** Datos de prueba: se cargan una sola vez (ver sembrarDatosDePrueba). */
const CITAS_DE_PRUEBA: Cita[] = [
  { frase: 'Pienso, luego existo.', autor: 'René Descartes' },
  { frase: 'Solo sé que no sé nada.', autor: 'Sócrates' },
  { frase: 'La imaginación es más importante que el conocimiento.', autor: 'Albert Einstein' },
  { frase: 'El conocimiento es poder.', autor: 'Francis Bacon' },
  { frase: 'Yo soy yo y mi circunstancia.', autor: 'José Ortega y Gasset' },
  { frase: 'Conócete a ti mismo.', autor: 'Sócrates' },
  { frase: 'Caminante, no hay camino, se hace camino al andar.', autor: 'Antonio Machado' },
  { frase: 'La curiosidad es la base de toda sabiduría.', autor: 'Aristóteles' },
  { frase: 'Lo que no te mata te hace más fuerte.', autor: 'Friedrich Nietzsche' },
  { frase: 'Cada día sabemos más y entendemos menos.', autor: 'Albert Einstein' },
  { frase: 'Quien tiene un porqué para vivir puede soportar casi cualquier cómo.', autor: 'Friedrich Nietzsche' },
  { frase: 'La vida es lo que pasa mientras estás ocupado haciendo otros planes.', autor: 'John Lennon' },
  { frase: 'La felicidad no es un destino, es una forma de viajar.', autor: 'Aldous Huxley' },
  { frase: 'Sé el cambio que quieres ver en el mundo.', autor: 'Mahatma Gandhi' },
  { frase: 'El único modo de hacer un gran trabajo es amar lo que haces.', autor: 'Steve Jobs' },
];

@Injectable({ providedIn: 'root' })
export class CitasService {
  private sqlite = new SQLiteConnection(CapacitorSQLite);
  constructor(private zona: NgZone) {}

  private enZona<T>(valor: T): Promise<T> {
    return new Promise(ok => this.zona.run(() => ok(valor)));
  }

  private db!: SQLiteDBConnection;
  private resolverListo!: () => void;
  private rechazarListo!: (e: unknown) => void;
  private listo = new Promise<void>((ok, fallo) => {
    this.resolverListo = ok;
    this.rechazarListo = fallo;
  });

  async iniciar(): Promise<void> {
    try {
      if (Capacitor.getPlatform() === 'web') {
        await customElements.whenDefined('jeep-sqlite');
        await this.sqlite.initWebStore();
      }
      const consistente = (await this.sqlite.checkConnectionsConsistency()).result;
      const existe = (await this.sqlite.isConnection(DB_NOMBRE, false)).result;

      this.db = consistente && existe
        ? await this.sqlite.retrieveConnection(DB_NOMBRE, false)
        : await this.sqlite.createConnection(DB_NOMBRE, false, 'no-encryption', 1, false);

      await this.db.open();
      await this.db.execute(`
        CREATE TABLE IF NOT EXISTS citas (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          frase TEXT NOT NULL,
          autor TEXT NOT NULL
        );`);
      // DATOS DE PRUEBA: comenta la línea de abajo para desactivarlos.
      //await this.sembrarDatosDePrueba();
      this.resolverListo();
    } catch (e) {
      console.error('[CitasService] Falló la apertura de la BD', e);
      this.rechazarListo(e);
    }
  }

  /**
   * Inserta las citas de prueba SOLO si ninguna de ellas existe ya.
   * Si al menos una está en la tabla, no agrega nada (evita duplicados en cada arranque).
   * Para quitar los datos de prueba: borrar esta llamada en iniciar() y la constante CITAS_DE_PRUEBA.
   */
  private async sembrarDatosDePrueba(): Promise<void> {
    const marcas = CITAS_DE_PRUEBA.map(() => '?').join(',');
    const res = await this.db.query(
      `SELECT COUNT(*) AS total FROM citas WHERE frase IN (${marcas});`,
      CITAS_DE_PRUEBA.map(c => c.frase),
    );
    if ((res.values?.[0]?.total ?? 0) > 0) return;

    await this.db.executeSet(
      CITAS_DE_PRUEBA.map(c => ({
        statement: 'INSERT INTO citas (frase, autor) VALUES (?, ?);',
        values: [c.frase, c.autor],
      })),
    );
    if (Capacitor.getPlatform() === 'web') await this.sqlite.saveToStore(DB_NOMBRE);
  }

  async obtenerTodas(): Promise<Cita[]> {
    await this.listo;
    const res = await this.db.query('SELECT id, frase, autor FROM citas ORDER BY id DESC;');
    return this.enZona((res.values ?? []) as Cita[]);
  }

  async agregar(c: Cita): Promise<void> {
    await this.listo;
    await this.db.run('INSERT INTO citas (frase, autor) VALUES (?, ?);', [c.frase, c.autor]);
    if (Capacitor.getPlatform() === 'web') await this.sqlite.saveToStore(DB_NOMBRE);
  }

  async eliminar(id: number): Promise<void> {
    await this.listo;
    await this.db.run('DELETE FROM citas WHERE id = ?;', [id]);
    if (Capacitor.getPlatform() === 'web') await this.sqlite.saveToStore(DB_NOMBRE);
  }

  async aleatoria(): Promise<Cita | null> {
    await this.listo;
    const res = await this.db.query('SELECT id, frase, autor FROM citas ORDER BY RANDOM() LIMIT 1;');
    return this.enZona((res.values?.[0] as Cita) ?? null);
  }
}
