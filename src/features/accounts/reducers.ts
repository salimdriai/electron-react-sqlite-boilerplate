/* eslint-disable import/prefer-default-export */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { Account } from 'types';
import activation from '../../../activation.json';

export const getAllAccounts = createAsyncThunk('getAllAccounts', async () => {
  const accounts = await window.electron.getAllAccounts();
  if (!activation.isActive && accounts.length > 3) {
    return accounts.slice(0, 3);
  }

  return accounts as Account[];
});
