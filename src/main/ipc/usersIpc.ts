import { User as IUser } from 'types';
import UserModel from '../models/User';

const User = new UserModel();

export const getAll = async (_: any, permission: string) => {
  const users = await User.getAll(permission);
  return users;
};

export const getOne = async (_: any, id: string) => {
  const user = await User.getOne(id);
  return user;
};

export const search = async (_: any, query: string) => {
  const users = await User.search(query);
  return users;
};

export const create = async (_: any, user: IUser) => {
  await User.create(user);
  return user;
};
export const update = async (_: any, user: IUser, id: string) => {
  await User.update(user, id);
  return user;
};

export const remove = async (_: any, id: string) => {
  await User.remove(id);
};

export const removeAll = async () => {
  await User.removeAll();
};
