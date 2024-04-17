/* eslint-disable no-unused-expressions */
/* eslint-disable no-console */
import { createSlice } from '@reduxjs/toolkit';
import { ActivationData, Lang, Settings, Themes } from 'types';
import activation from '../../../activation.json';

interface InitialState {
  settings: Settings;
  activation: ActivationData;
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
  activation: { ...activation },
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
});

export const {
  switchTheme,
  switchLanguage,
  showAccessInput,
  updateActivationData,
} = settingsSlice.actions;

export default settingsSlice.reducer;
