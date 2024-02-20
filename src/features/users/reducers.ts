/* eslint-disable consistent-return */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { Subscription, User } from 'types';

export const sessionsEntry = createAsyncThunk(
  'sessionsEntry',
  async (userId: string) => {
    const user: User = await window.electron.getOneUser(userId);

    const currentTimestamp = new Date().getTime();
    const threeHoursTimestamp = 1_800_000;
    // const sixHoursTimstamp = 21_600_000;

    const result = {
      user,
      isEnteredThreeHoursAgo: false,
      isSubscriptionExpired: false,
      isMaxSessionsSpent: false,
      message: 'Welcome !',
    };

    if (!user.subscriptions?.length) {
      return {
        user,
        isEnteredThreeHoursAgo: false,
        isSubscriptionExpired: true,
        isMaxSessionsSpent: false,
        message: 'info.noSubscriptions',
      };
    }

    user.subscriptions!.forEach(
      ({ endsAt, sessionsAvailable, sessionsSpent }: Subscription) => {
        if (currentTimestamp - user.lastEntryTimestamp < threeHoursTimestamp) {
          result.isEnteredThreeHoursAgo = true;
          result.message = 'info.entredInThreeHours';
        }

        const endsAtTimestamp = new Date(endsAt).getTime();
        if (endsAtTimestamp < currentTimestamp) {
          result.isSubscriptionExpired = true;
          result.message = 'info.subscriptionExpired';
        }

        if (sessionsSpent >= sessionsAvailable) {
          result.isMaxSessionsSpent = true;
          result.message = 'info.maxSessionsSpent';
        }
      }
    );

    if (result.isEnteredThreeHoursAgo) {
      return result;
    }

    user.lastEntryTimestamp = new Date().getTime();
    user.subscriptions!.forEach((sub) => {
      sub.sessionsSpent += 1;
    });

    if (typeof user?.allTimeEntries === 'number') {
      user.allTimeEntries += 1;
    } else {
      user.allTimeEntries = 1;
    }

    const subsPromises = user.subscriptions!.map((sub) =>
      window.electron.updateSubscription(sub)
    );

    Promise.all(subsPromises)
      .then((res) => console.log('res', res))
      .catch((err) => console.log('ERR updating subscriptions', err));

    const updatedUser = await window.electron.updateUser(user);
    result.user = updatedUser;
    return result;
  }
);

export const fetchUsers = createAsyncThunk(
  'fetchUsers',
  async (permission: string) => {
    const users = await window.electron.getAllUsers(permission);
    return users as User[];
  }
);

export const getOneUser = createAsyncThunk(
  'getOneUser',
  async (userId: string) => {
    const user = await window.electron.getOneUser(userId);
    return user as User;
  }
);

export const filterByExpirationDate = createAsyncThunk(
  'filterByExpirationDate',
  async ({
    expireIn,
    permission,
  }: {
    expireIn: number;
    permission: string;
  }) => {
    const oneDayMs = 86_400_000;

    const data = await window.electron.getAllUsers(permission);
    const filteredUsers: User[] = data.filter((user: User) => {
      return user.subscriptions?.some((sub) => {
        const endsAt = new Date(sub.endsAt).getTime();
        const now = new Date().getTime();
        const daysAfter = now + oneDayMs * expireIn;
        if (expireIn === 0) {
          return endsAt < now;
        }
        return endsAt < daysAfter && endsAt > now;
      });
    });

    return filteredUsers as User[];
  }
);
