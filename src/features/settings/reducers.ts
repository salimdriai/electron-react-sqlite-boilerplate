import { createAsyncThunk } from '@reduxjs/toolkit';
import { LicenseData } from 'types';

export const getSettings = createAsyncThunk('getSettings', async () => {});

export const updateSettings = createAsyncThunk(
  'updateSettings',
  async () => {}
);

export const initActivationData = createAsyncThunk(
  'initActivationData',
  async () => {
    const data = await window.electron.getLicenseData();
    return data as LicenseData;
  }
);
