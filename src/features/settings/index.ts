/* eslint-disable no-unused-expressions */
/* eslint-disable no-console */
import { createSlice } from '@reduxjs/toolkit';
import { Settings, Themes } from 'types';
import { getSettings, updateSettings } from './reducers';

interface InitialState {
  settings: Settings;
  loading: boolean;
  error: any;
}

const initialState: InitialState = {
  settings: {
    subscriptions: [],
    theme: Themes.Light,
    gymName: '',
  },
  loading: false,
  error: null,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getSettings.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getSettings.fulfilled, (state, action) => {
      state.settings = action.payload;
      state.loading = false;
    });
    builder.addCase(getSettings.rejected, (state, action) => {
      state.error = action.error;
      state.loading = false;
    });

    builder.addCase(updateSettings.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateSettings.fulfilled, (state, action) => {
      state.settings = action.payload;
      state.loading = false;
    });
    builder.addCase(updateSettings.rejected, (state, action) => {
      console.log('ERR', action.error);
      state.error = action.error;
      state.loading = false;
    });
  },
});

// export const {} = settingsSlice.actions;

export default settingsSlice.reducer;
