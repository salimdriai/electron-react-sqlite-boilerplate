import DB from '../../db';
import {
  createSubscriptionsTable,
  createQuery,
  updateQuery,
  removeQuery,
  getUserSubscriptionsQuery,
  getQuery,
} from './queries';
import { Subscription } from '../../../types';

export default class SubscriptionsModel extends DB {
  private db: any;

  constructor() {
    super();
    this.db = super.connect();
    this.db.exec(createSubscriptionsTable);
  }

  getAll() {
    const stm = this.db.prepare(getQuery);
    const subscriptions = stm.all();
    return subscriptions;
  }

  get(userId: string): Subscription[] {
    const stm = this.db.prepare(getUserSubscriptionsQuery);
    const subscriptions = stm.all({ userId });
    return subscriptions;
  }

  create(subscription: Subscription) {
    const stm = this.db.prepare(createQuery);
    stm.run(subscription);
  }

  update(subscription: Subscription) {
    const stm = this.db.prepare(updateQuery);
    stm.run(subscription);
  }

  delete(id: string) {
    const stm = this.db.prepare(removeQuery);
    stm.run({ id });
  }
}
