import DB from '../../db';
import {
  createPaymentTable,
  createQuery,
  updateQuery,
  removeQuery,
  getUserPaymentsQuery,
  getQuery,
} from './queries';
import { Payment } from '../../../types';

export default class PaymentsModel extends DB {
  private db: any;

  constructor() {
    super();
    this.db = super.connect();
    this.db.exec(createPaymentTable);
  }

  getAll() {
    const stm = this.db.prepare(getQuery);
    const payments = stm.all();
    return payments;
  }

  get(userId: string): Payment[] {
    const stm = this.db.prepare(getUserPaymentsQuery);
    const payments = stm.all({ userId });
    return payments;
  }

  create(payment: Payment) {
    const stm = this.db.prepare(createQuery);
    stm.run(payment);
  }

  update(payment: Payment) {
    const stm = this.db.prepare(updateQuery);
    stm.run(payment);
  }

  delete(id: string) {
    const stm = this.db.prepare(removeQuery);
    stm.run({ id });
  }
}
