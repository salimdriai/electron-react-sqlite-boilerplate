/* eslint-disable no-unused-expressions */
/* eslint-disable no-console */
import { createSlice } from '@reduxjs/toolkit';
import { Lang, Settings, Themes } from 'types';

interface InitialState {
  settings: Settings;
  loading: boolean;
  error: any;
}

const initialState: InitialState = {
  settings: {
    lang: Lang.English,
    theme: Themes.Light,
    gymName: 'Gym Boss',
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
  },
});

export const { switchTheme, switchLanguage } = settingsSlice.actions;

export default settingsSlice.reducer;
