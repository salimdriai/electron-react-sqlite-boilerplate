/* eslint-disable consistent-return */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { User } from 'types';

export const sessionsEntry = createAsyncThunk(
  'sessionsEntry',
  async (userId: string) => {
    const user: User = await window.electron.getOneUser(userId);

    const currentTimestamp = new Date().getTime();
    const sixHoursTimstamp = 21600000;

    const result = {
      user,
      isEnteredSixHoursAgo: false,
      isSubscriptionExpired: false,
      isMaxSessionsSpent: false,
      message: 'Welcome !',
    };

    user.currentSubscriptions.forEach(
      ({ lastEntryTimestamp, endsAt, sessionsAvailable, sessionsSpent }) => {
        if (currentTimestamp - lastEntryTimestamp < sixHoursTimstamp) {
          result.isEnteredSixHoursAgo = true;
          result.message = 'This user entered in less than 6 hours !';
        }

        const endsAtTimestamp = new Date(endsAt).getTime();
        if (endsAtTimestamp < currentTimestamp) {
          result.isSubscriptionExpired = true;
          result.message = 'This user subscription expired !';
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

    user.currentSubscriptions.forEach((sub) => {
      sub.lastEntryTimestamp = new Date().getTime();
      sub.sessionsSpent += 1;
    });

    user.currentSubscriptions = JSON.stringify(
      user.currentSubscriptions
    ) as any;

    if (typeof user?.allTimeSessions === 'number') {
      user.allTimeSessions += 1;
    }

    const updatedUser = await window.electron.updateUser(user);
    result.user = updatedUser;
    return result;
  }
);

export const updateSubscriptions = createAsyncThunk(
  'updateSubscriptions',
  async () => {}
);
