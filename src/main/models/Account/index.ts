import { Account, AccountStatus, Permission, Role } from '../../../types';
import { encryptData, decryptData } from '../../utils/Encription';
import DB from '../../db';
import {
  logAccountQuery,
  createQuery,
  updateQuery,
  getAllQuery,
  getOneQuery,
  removeQuery,
  accountsCountQuery,
  createAccountsTable,
} from './queries';

import { SECRET_KEY, SECRET_IV } from '../../config/keys';

export default class AccountModel extends DB {
  private db: any;

  private account: Account = {
    username: 'admin',
    password: 'admin',
    phoneNumber: '',
    permission: Permission.Admin,
    role: Role.Owner,
    createdAt: new Date().toDateString(),
    status: AccountStatus.Active,
  };

  constructor() {
    super();
    this.db = super.connect();
    this.db.exec(createAccountsTable);
  }

  initAdminAccount() {
    const { account } = this;

    const stm = this.db.prepare(createQuery);
    account.password = encryptData(account.password, SECRET_KEY, SECRET_IV);
    stm.run(account);
    account.password = decryptData(account.password, SECRET_KEY, SECRET_IV);
    return account;
  }

  isAppActivated() {
    const stm = this.db.prepare(accountsCountQuery);
    return stm.all();
  }

  getAll(): Account[] {
    const stm = this.db.prepare(getAllQuery);
    return stm.all();
  }

  logAccount(username: string, password: string): Account {
    const stm = this.db.prepare(logAccountQuery);
    password = encryptData(password, SECRET_KEY, SECRET_IV);
    return stm.get({ username, password });
  }

  getOne(username: string): Account {
    const stm = this.db.prepare(getOneQuery);
    return stm.get({ username });
  }

  create(account: Account) {
    const stm = this.db.prepare(createQuery);
    account.password = encryptData(account.password, SECRET_KEY, SECRET_IV);
    stm.run(account);
  }

  update(account: Account) {
    const stm = this.db.prepare(updateQuery);
    account.password = encryptData(account.password, SECRET_KEY, SECRET_IV);
    stm.run(account);
  }

  remove(username: string) {
    const stm = this.db.prepare(removeQuery);
    stm.run({ username });
  }
}
