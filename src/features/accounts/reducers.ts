/* eslint-disable import/prefer-default-export */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { Account } from 'types';

export const getAllAccounts = createAsyncThunk('getAllAccounts', async () => {
  // const licenseData = await window.electron.getLicenseData();

  const accounts = await window.electron.getAllAccounts();
  // if (!licenseData.isActive && accounts.length > 3) {
  //   return accounts.slice(0, 3);
  // }

  return accounts as Account[];
});
