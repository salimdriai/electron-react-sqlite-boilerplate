import { createAsyncThunk } from '@reduxjs/toolkit';
import { getFromLocalStorage, saveToLocalStorage } from 'utils/local-storage';
import { Settings } from 'types';

export const getSettings = createAsyncThunk('getSettings', async () => {
  let settings = getFromLocalStorage('settings');
  if (!settings) {
    settings = await window.electron.getSettings();
    saveToLocalStorage('settings', settings);
  }
  return settings as Settings;
});

export const updateSettings = createAsyncThunk(
  'updateSettings',
  async (newSettings: Settings) => {
    await window.electron.updateSettings(newSettings);
    saveToLocalStorage('settings', newSettings);
    return newSettings;
  }
);
