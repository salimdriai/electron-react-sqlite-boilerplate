import { createAsyncThunk } from '@reduxjs/toolkit';
import { Settings } from 'types';

export const getSettings = createAsyncThunk('getSettings', async () => {
  const settings: Settings = await window.electron.getSettings();
  return settings;
});

export const updateSettings = createAsyncThunk(
  'updateSettings',
  async (newSettings: Settings) => {
    await window.electron.updateSettings(newSettings);
    return newSettings;
  }
);
