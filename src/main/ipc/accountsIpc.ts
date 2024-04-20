import { Account as IAccount } from 'types';
import AccountModel from '../models/Account';

const Account = new AccountModel();

export const getAll = async () => {
  const users = await Account.getAll();
  return users;
};

export const logAccount = async (
  _: any,
  username: string,
  password: string
) => {
  const account = await Account.logAccount(username, password);
  return account;
};

export const getOne = async (_: any, username: string) => {
  const account = await Account.getOne(username);
  return account;
};

export const create = async (_: any, account: IAccount) => {
  await Account.create(account);
  return account;
};

export const update = async (_: any, account: IAccount) => {
  await Account.update(account);
  return account;
};

export const remove = async (_: any, username: string) => {
  await Account.remove(username);
};

export const initAdmin = async () => {
  const res = await Account.initAdminAccount();
  return res;
};

export const setLicenseData = async (_: any, data: any) => {
  const result = await Account.setLicenseData(data);
  return result;
};

export const getLicenseData = async () => {
  const data = await Account.getLicenseData();
  return data;
};
