import { SubscriptionPlan as ISubscriptionPlan } from 'types';
import SubscriptionPlanModel from '../models/SubscriptionPlans';

const SubscriptionPlan = new SubscriptionPlanModel();

export const getAll = async () => {
  const users = await SubscriptionPlan.getAll();
  return users;
};

export const create = async (_: any, plan: ISubscriptionPlan) => {
  await SubscriptionPlan.create(plan);
  return plan;
};

export const update = async (_: any, plan: ISubscriptionPlan) => {
  await SubscriptionPlan.update(plan);
  return plan;
};
