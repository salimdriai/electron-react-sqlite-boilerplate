import { Notification as INotifcations } from 'types';
import NotificationModel from '../models/Notification';

const Notifcations = new NotificationModel();

export const getAll = async () => {
  const notifications = await Notifcations.getAll();
  return notifications;
};

export const create = async (_: any, notification: INotifcations) => {
  await Notifcations.create(notification);
  return notification;
};

export const update = async (_: any, notification: INotifcations) => {
  await Notifcations.update(notification);
  return notification;
};

export const remove = async (_: any, id: string) => {
  await Notifcations.delete(id);
};
