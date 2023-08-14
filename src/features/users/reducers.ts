/* eslint-disable consistent-return */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { User } from 'types';

export const sessionsEntry = createAsyncThunk(
  'sessionsEntry',
  async (userId: string) => {
    const user: User = await window.electron.getOneUser(userId);
    const currentTimestamp = new Date().getTime();
    const sixHoursTimstamp = 21600000;

    let isEnteredSixHoursAgo = false;
    let isSubscriptionExpired = null;
    let isMaxSessionsSpent = null;

    user.currentSubscriptions.forEach(
      ({
        lastEntryTimestamp,
        endsAt,
        sessionsAvailable,
        sessionsSpent,
        ...rest
      }) => {
        if (currentTimestamp - lastEntryTimestamp < sixHoursTimstamp) {
          isEnteredSixHoursAgo = true;
        }

        const endsAtTimestamp = new Date(endsAt).getTime();
        if (endsAtTimestamp < currentTimestamp) {
          isSubscriptionExpired = rest;
        }

        if (sessionsSpent >= sessionsAvailable) {
          isMaxSessionsSpent = rest;
        }
      }
    );

    if (isEnteredSixHoursAgo) {
      toast.warning('This user entered in last 6 hours !');
      return;
    }

    if (isSubscriptionExpired) {
      return {
        user,
        isSubscriptionExpired,
      };
    }

    if (isMaxSessionsSpent) {
      return {
        user,
        isMaxSessionsSpent,
      };
    }

    user.currentSubscriptions.forEach((sub) => {
      sub.lastEntryTimestamp = new Date().getTime();
      sub.sessionsSpent += 1;
    });

    user.currentSubscriptions = JSON.stringify(
      user.currentSubscriptions
    ) as any;

    const res = await window.electron.updateUser(user);
    return { user: res };
  }
);

export const updateSubscriptions = createAsyncThunk(
  'updateSubscriptions',
  async () => {}
);
