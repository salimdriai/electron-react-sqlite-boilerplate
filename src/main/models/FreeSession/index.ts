import DB from '../../db';
import {
  getQuery,
  createFreeSessionTable,
  createQuery,
  updateQuery,
  removeQuery,
} from './queries';
import { FreeSession } from '../../../types';

export default class SettingsModel extends DB {
  private db: any;

  constructor() {
    super();
    this.db = super.connect();
    this.db.exec(createFreeSessionTable);
  }

  get(): FreeSession[] {
    const stm = this.db.prepare(getQuery);
    const freeSessions = stm.all();

    return freeSessions;
  }

  create(session: FreeSession) {
    const stm = this.db.prepare(createQuery);
    stm.run(session);
  }

  update(session: FreeSession) {
    const stm = this.db.prepare(updateQuery);
    stm.run(session);
  }

  remove(id: string) {
    const stm = this.db.prepare(removeQuery);
    stm.run({ id });
  }
}
