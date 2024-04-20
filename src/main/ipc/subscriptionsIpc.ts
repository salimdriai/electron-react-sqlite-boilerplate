import { Subscription } from 'types';
import SubscriptionsModel from '../models/Subscription';

const Subscriptions = new SubscriptionsModel();

export const getAll = async () => {
  const subscriptions = Subscriptions.getAll();
  return subscriptions;
};
export const getUserSubscriptions = async (_: any, userId: string) => {
  const subscriptions = Subscriptions.get(userId);
  return subscriptions;
};

export const create = async (_: any, subscription: Subscription) => {
  const res = await Subscriptions.create(subscription);
  return res;
};

export const update = async (_: any, subscription: Subscription) => {
  await Subscriptions.update(subscription);
  return subscription;
};

export const remove = async (_: any, id: string) => {
  await Subscriptions.delete(id);
};
