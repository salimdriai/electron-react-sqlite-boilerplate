import dotenv from 'dotenv';
import { Account, AccountStatus, Permission, Role } from '../../../types';
import { encryptData, decryptData } from '../../services/Encription';
// import { getKey } from '../../services/Activation';
import DB from '../../db';
import {
  logAccountQuery,
  createQuery,
  updateQuery,
  getAllQuery,
  getOneQuery,
  removeQuery,
  accountsCountQuery,
} from './queries';

dotenv.config();
const activationKey = process.env.ACTIVATION_KEY;

export default class AccountModel extends DB {
  private db: any;

  constructor() {
    super();
    this.db = super.connect();
  }

  activateApp(key: string) {
    const account: Account = {
      username: 'admin',
      password: 'admin',
      permission: Permission.Admin,
      role: Role.Owner,
      createdAt: new Date().toDateString(),
      status: AccountStatus.Active,
    };

    if (key === activationKey) {
      const stm = this.db.prepare(createQuery);
      account.password = encryptData(account.password);
      stm.run(account);
      account.password = decryptData(account.password);
      return account;
    }
    return undefined;
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
    password = encryptData(password);
    return stm.get({ username, password });
  }

  getOne(username: string): Account {
    const stm = this.db.prepare(getOneQuery);
    return stm.get({ username });
  }

  create(account: Account) {
    const stm = this.db.prepare(createQuery);
    account.password = encryptData(account.password);
    stm.run(account);
  }

  update(account: Account) {
    const stm = this.db.prepare(updateQuery);
    account.password = encryptData(account.password);
    stm.run(account);
  }

  remove(username: string) {
    const stm = this.db.prepare(removeQuery);
    stm.run({ username });
  }
}
