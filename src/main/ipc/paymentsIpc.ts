import { Payment as IPayment } from 'types';
import PaymentsModel from '../models/Payments';

const Payments = new PaymentsModel();

export const getAll = async () => {
  const payments = await Payments.getAll();
  return payments;
};
export const getOne = async (_: any, userId: any) => {
  const payments = await Payments.get(userId);
  return payments;
};
export const create = async (_: any, payment: IPayment) => {
  await Payments.create(payment);
  return payment;
};
export const update = async (_: any, payment: IPayment) => {
  await Payments.update(payment);
  return payment;
};
