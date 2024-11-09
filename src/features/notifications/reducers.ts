import { createAsyncThunk } from '@reduxjs/toolkit';
import { Notification, User } from 'types';

export const getNotifications = createAsyncThunk(
  'getNotifications',
  async () => {
    const notifications = await window.electron.getNotifications();
    return notifications as Notification[];
  }
);

export const toggleReadNotification = createAsyncThunk(
  'readNotification',
  async ({
    notification,
    read,
  }: {
    notification: Notification;
    read: boolean;
  }) => {
    await window.electron.updateNotification({
      ...notification,
      isRead: read ? 1 : 0,
    });
    return notification;
  }
);

export const updateAll = createAsyncThunk(
  'updateAll',
  async (action: 'read' | 'delete') => {
    await window.electron.updateAllNotifications(action);
  }
);

export const deleteNotification = createAsyncThunk(
  'deleteNotification',
  async (id: string) => {
    await window.electron.deleteNotification(id);
  }
);

export const generateNotifications = createAsyncThunk(
  'generateNotifications',
  async (users: User[]) => {
    const expired: any = [];
    const today = new Date();
    const threeDaysAgoTimestamp = today.getTime() - 3 * 24 * 60 * 60 * 1000; // 3 days * 24 hours * 60 minutes * 60 seconds * 1000 milliseconds
    const threeDaysAgo = new Date(threeDaysAgoTimestamp).getTime();

    const existingNotifications = await window.electron.getNotifications();

    users.forEach((user) => {
      user.subscriptions.forEach((sub) => {
        const endsAt = new Date(sub.endsAt).getTime();

        const existingNotif = existingNotifications.find(
          (notif: Notification) =>
            notif.subscriptionId === sub.id && endsAt > threeDaysAgo
        );

        if (
          endsAt < new Date().getTime() &&
          endsAt > threeDaysAgo &&
          !existingNotif
        ) {
          expired.push({
            username: `${user.firstName} ${user.lastName}`,
            photo: user.photo,
            userId: user.id,
            planId: sub.planId,
            subscriptionId: sub.id,
            message: 'subscription.expired',
            isRead: existingNotif?.isRead ? 1 : 0,
            createdAt: new Date().toLocaleDateString(),
          });
        }
      });
    });

    const createPromises = expired.map((notif: Notification) =>
      window.electron.createNotification(notif)
    );

    await Promise.all(createPromises);

    const notifications = await window.electron.getNotifications();
    return notifications as Notification[];
  }
);
