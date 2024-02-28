import { Permission, Subscription, User } from '../../../types';
import DB from '../../db';
import {
  createQuery,
  updateQuery,
  getAllQuery,
  getOneQuery,
  removeQuery,
  removeAllQuery,
  searchQuery,
  createUsersTable,
  getByPermission,
} from './queries';

import {
  getUserSubscriptionsQuery,
  getQuery as getSubscriptions,
} from '../Subscription/queries';

export default class UserModel extends DB {
  private db: any;

  constructor() {
    super();
    this.db = super.connect();
    this.db.exec(createUsersTable);
  }

  getAll(permission: string): User[] {
    let query = getAllQuery;
    if (permission === Permission.Male || permission === Permission.Female) {
      query = getByPermission;
    }

    const stm = this.db.prepare(query);
    const subsStm = this.db.prepare(getSubscriptions);
    const subs = subsStm.all();

    const users = stm.all({ sex: permission }).map((user: User) => ({
      ...user,
      subscriptions: subs.filter((sub: Subscription) => sub.userId === user.id),
    }));
    return users;
  }

  getOne(id: string): User {
    const userStm = this.db.prepare(getOneQuery);
    const subStm = this.db.prepare(getUserSubscriptionsQuery);
    const user = userStm.get({ id });
    const subscriptions = subStm.all({ userId: id });
    user.subscriptions = subscriptions;
    return user;
  }

  search(query: string): User[] {
    const stm = this.db.prepare(searchQuery);
    const subsStm = this.db.prepare(getSubscriptions);
    const subs = subsStm.all();

    const users = stm.all(query, query, query).map((user: User) => ({
      ...user,
      subscriptions: subs.filter((sub: Subscription) => sub.userId === user.id),
    }));

    return users;
  }

  async create(user: User) {
    const stm = this.db.prepare(createQuery);
    stm.run(user);
  }

  async update(user: User, oldId: string) {
    const stm = this.db.prepare(updateQuery);
    stm.run({ ...user, oldId });
  }

  remove(id: string) {
    const stm = this.db.prepare(removeQuery);
    stm.run({ id });
  }

  removeAll() {
    const stm = this.db.prepare(removeAllQuery);
    stm.run();
  }
}
