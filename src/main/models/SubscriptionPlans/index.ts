import DB from '../../db';
import {
  createSubscriptionPlansTable,
  getQuery,
  createQuery,
  removeQuery,
  updateQuery,
  createQueryWithouId,
} from './queries';
import { SubscriptionPlan } from '../../../types';

export default class SubscriptionsModel extends DB {
  private db: any;

  constructor() {
    super();
    this.db = super.connect();
    this.db.exec(createSubscriptionPlansTable);
  }

  getAll(): SubscriptionPlan[] {
    const stm = this.db.prepare(getQuery);
    const subscriptionPlans = stm.all();
    return subscriptionPlans;
  }

  update(subscriptionPlan: SubscriptionPlan) {
    const stm = this.db.prepare(updateQuery);
    stm.run(subscriptionPlan);
  }

  create(subscriptionPlan: SubscriptionPlan) {
    const stm = subscriptionPlan.id
      ? this.db.prepare(createQuery)
      : this.db.prepare(createQueryWithouId);
    stm.run(subscriptionPlan);
  }

  remove(id: string) {
    const stm = this.db.prepare(removeQuery);
    stm.run({ id });
  }
}
