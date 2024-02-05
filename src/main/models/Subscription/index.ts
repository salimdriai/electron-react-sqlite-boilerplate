import DB from '../../db';
import {
  createSubscriptionsTable,
  createQuery,
  updateQuery,
  removeQuery,
  getUserSubscriptionsQuery,
} from './queries';
import { Subscription } from '../../../types';

export default class SubscriptionsModel extends DB {
  private db: any;

  constructor() {
    super();
    this.db = super.connect();
    this.db.exec(createSubscriptionsTable);
  }

  get(userId: string): Subscription[] {
    const stm = this.db.prepare(getUserSubscriptionsQuery);
    const subscriptions = stm.get({ userId });
    return subscriptions;
  }

  create(subscription: Subscription) {
    console.log('SUBBB', subscription);
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
