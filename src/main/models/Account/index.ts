import path from 'path';
import fs from 'fs';
import {
  Account,
  AccountStatus,
  ActivationData,
  Permission,
  Role,
} from '../../../types';
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
import webpackPaths from '../../../../.erb/configs/webpack.paths';
import licenseData from '../../../../license.json';
import { SECRET_KEY, SECRET_IV } from '../../../config/keys';

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

  // eslint-disable-next-line class-methods-use-this
  getLicenseData() {
    const encryptedData = licenseData.data;
    if (!encryptedData) {
      throw new Error('Please generate license data first !');
    }

    const result = decryptData(encryptedData, SECRET_KEY, SECRET_IV);
    return JSON.parse(result);
  }

  // eslint-disable-next-line class-methods-use-this
  async setLicenseData(data: ActivationData) {
    const licenseDataObj = encryptData(
      JSON.stringify(data),
      SECRET_KEY,
      SECRET_IV
    );

    const saveData = async () => {
      const json = JSON.stringify({ data: licenseDataObj });
      const filePath = path.join(webpackPaths.rootPath, 'license.json');

      return new Promise((resolve, reject) => {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }

        fs.writeFile(filePath, json, 'utf8', (err) => {
          if (err) {
            console.log('ERROR', err);
            reject(err);
          } else {
            resolve({ success: true });
          }
        });
      });
    };
    const result = await saveData();
    return result;
  }
}
