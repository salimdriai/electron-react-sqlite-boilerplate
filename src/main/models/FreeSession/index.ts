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
    const freeSessions = stm.all().map((session: any) => ({
      ...session,
      sessionType: JSON.parse(session.sessionType),
    }));

    return freeSessions;
  }

  create(session: FreeSession) {
    const stm = this.db.prepare(createQuery);
    stm.run({ ...session, sessionType: JSON.stringify(session.sessionType) });
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
