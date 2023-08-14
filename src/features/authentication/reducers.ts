import { createAsyncThunk } from '@reduxjs/toolkit';
import { Account } from 'types';

export const logAccount = createAsyncThunk(
  'logAccount',
  async ({ username, password }: { username: string; password: string }) => {
    const account = await window.electron.logAccount(username, password);
    return account || undefined;
  }
);

export const updateAccount = createAsyncThunk(
  'updateAccount',
  async (data: Account) => {
    const account = await window.electron.updateAccount(data);
    return account;
  }
);
