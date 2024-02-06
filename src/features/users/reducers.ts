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
      isEnteredSixHoursAgo: false,
      isSubscriptionExpired: false,
      isMaxSessionsSpent: false,
      message: 'Welcome !',
    };

    user.subscriptions!.forEach(
      ({ endsAt, sessionsAvailable, sessionsSpent }: Subscription) => {
        if (currentTimestamp - user.lastEntryTimestamp < threeHoursTimestamp) {
          result.isEnteredSixHoursAgo = true;
          result.message = 'This user entered in less than 6 hours !';
        }

        const endsAtTimestamp = new Date(endsAt).getTime();
        if (endsAtTimestamp < currentTimestamp) {
          result.isSubscriptionExpired = true;
          result.message = 'This user subscription is expired !';
        }

        if (sessionsSpent >= sessionsAvailable) {
          result.isMaxSessionsSpent = true;
          result.message = 'This user spent max sessions amount !';
        }
      }
    );

    if (
      result.isEnteredSixHoursAgo ||
      result.isMaxSessionsSpent ||
      result.isSubscriptionExpired
    ) {
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

export const updateSubscriptions = createAsyncThunk(
  'updateSubscriptions',
  async () => {}
);
