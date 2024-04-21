/* eslint-disable no-unused-expressions */
/* eslint-disable no-console */
import { createSlice } from '@reduxjs/toolkit';
import { LicenseData, Lang, Settings, Themes } from 'types';
import { initActivationData } from './reducers';

interface InitialState {
  settings: Settings;
  activation: LicenseData;
  loading: boolean;
  error: any;
}

const initialState: InitialState = {
  settings: {
    lang: Lang.English,
    theme: Themes.Dark,
    gymName: 'FlexFit',
    accessInput: false,
  },
  activation: {
    key: '',
    hddsn: '',
    clientName: '',
    phoneNumber: '',
    isActive: false,
  },
  loading: false,
  error: null,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    switchTheme: (state, action) => {
      state.settings.theme = action.payload;
      window.electron.setStoreData('settings.theme', action.payload);
    },
    switchLanguage: (state, action) => {
      window.electron.setStoreData('settings.language', action.payload);
      state.settings.lang = action.payload;
    },
    showAccessInput: (state, action) => {
      window.electron.setStoreData('settings.accessInput', action.payload);
      state.settings.accessInput = action.payload;
    },
    updateActivationData: (state, action) => {
      state.activation = action.payload;
    },
  },
  extraReducers: (buider) => {
    buider.addCase(initActivationData.pending, (state) => {
      state.loading = true;
    });
    buider.addCase(initActivationData.fulfilled, (state, action) => {
      state.activation = action.payload;
      state.loading = false;
    });
    buider.addCase(initActivationData.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error;
    });
  },
});

export const {
  switchTheme,
  switchLanguage,
  showAccessInput,
  updateActivationData,
} = settingsSlice.actions;

export default settingsSlice.reducer;
