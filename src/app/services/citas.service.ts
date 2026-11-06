import { Injectable, NgZone } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Cita } from '../models/cita.model';

const DB_NOMBRE = 'citas_db';

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
      this.resolverListo();
    } catch (e) {
      console.error('[CitasService] Falló la apertura de la BD', e);
      this.rechazarListo(e);
    }
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
