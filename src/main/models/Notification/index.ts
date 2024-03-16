import DB from '../../db';
import {
  createNotifcationsTable,
  createQuery,
  updateQuery,
  removeQuery,
  getQuery,
} from './queries';
import { Notification } from '../../../types';

export default class NotifcationsModel extends DB {
  private db: any;

  constructor() {
    super();
    this.db = super.connect();
    this.db.exec(createNotifcationsTable);
  }

  getAll() {
    const stm = this.db.prepare(getQuery);
    const notifications = stm.all();
    return notifications;
  }

  create(notification: Notification) {
    const stm = this.db.prepare(createQuery);
    stm.run(notification);
  }

  update(notification: Notification) {
    const stm = this.db.prepare(updateQuery);
    stm.run(notification);
  }

  delete(id: string) {
    const stm = this.db.prepare(removeQuery);
    stm.run({ id });
  }
}
