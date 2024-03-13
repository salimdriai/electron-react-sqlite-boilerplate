/* eslint-disable import/prefer-default-export */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { Account } from 'types';

export const getAllAccounts = createAsyncThunk('getAllAccounts', async () => {
  const accounts = await window.electron.getAllAccounts();
  return accounts as Account[];
});
