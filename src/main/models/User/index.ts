import { Permission, User } from '../../../types';
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

import { getUserSubscriptionsQuery } from '../Subscription/queries';

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
    const users = stm.all({ sex: permission });
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
    const users = stm.all(query, query, query);

    return users;
  }

  async create(user: User) {
    if (user.photo) {
      user.photo = Buffer.from(user.photo as string, 'base64');
    }
    const stm = this.db.prepare(createQuery);
    stm.run(user);
  }

  async update(user: User) {
    if (user.photo) {
      user.photo = Buffer.from(user.photo as string, 'base64');
    }
    const stm = this.db.prepare(updateQuery);
    stm.run(user);
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
