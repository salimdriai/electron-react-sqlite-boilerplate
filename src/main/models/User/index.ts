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

const convertPhotoToBase64 = (buffer: Buffer) => {
  if (!buffer) return null;
  const base64 = Buffer.from(buffer).toString('base64');
  return base64;
};

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
      // photo: convertPhotoToBase64(user.photo as any),
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
    // user.photo = convertPhotoToBase64(user.photo as any);
    return user;
  }

  search(query: string): User[] {
    const stm = this.db.prepare(searchQuery);
    const subsStm = this.db.prepare(getSubscriptions);
    const subs = subsStm.all();

    const users = stm.all(query, query, query).map((user: User) => ({
      ...user,
      photo: convertPhotoToBase64(user.photo as any),
      subscriptions: subs.filter((sub: Subscription) => sub.userId === user.id),
    }));

    return users;
  }

  async create(user: User) {
    // if (user.photo) {
    //   user.photo = Buffer.from(user.photo as string, 'base64');
    // }
    const stm = this.db.prepare(createQuery);
    stm.run(user);
  }

  async update(user: User) {
    // if (user.photo) {
    //   user.photo = Buffer.from(user.photo as string, 'base64');
    // }
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
