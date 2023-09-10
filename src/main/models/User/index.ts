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
    const users = stm.all({ sex: permission }).map((user: any) => ({
      ...user,
      currentSubscriptions: JSON.parse(user.currentSubscriptions),
    }));

    return users;
  }

  getOne(id: string): User {
    const stm = this.db.prepare(getOneQuery);
    const user = stm.get({ id });
    user.currentSubscriptions = JSON.parse(user.currentSubscriptions);
    return user;
  }

  search(query: string): User[] {
    const stm = this.db.prepare(searchQuery);
    const users = stm.all(query, query, query).map((user: any) => ({
      ...user,
      currentSubscriptions: JSON.parse(user.currentSubscriptions),
    }));

    return users;
  }

  create(user: User) {
    const stm = this.db.prepare(createQuery);
    stm.run(user);
  }

  update(user: User) {
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
