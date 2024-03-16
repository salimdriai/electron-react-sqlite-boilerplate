/* eslint-disable no-unused-expressions */
/* eslint-disable no-console */
import { createSlice } from '@reduxjs/toolkit';
import { Notification } from 'types';
import {
  getNotifications,
  toggleReadNotification,
  deleteNotification,
  generateNotifications,
} from './reducers';

interface InitialState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  isError: any;
}

const initialState: InitialState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  isError: false,
};

const paymentsSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getNotifications.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getNotifications.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.notifications = payload;
      state.unreadCount = payload.filter(({ isRead }) => !isRead).length;
    });
    builder.addCase(getNotifications.rejected, (state) => {
      state.isLoading = false;
    });

    builder.addCase(toggleReadNotification.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(toggleReadNotification.fulfilled, (state) => {
      state.isLoading = false;
    });
    builder.addCase(toggleReadNotification.rejected, (state) => {
      state.isLoading = false;
    });

    builder.addCase(generateNotifications.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(generateNotifications.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.notifications = payload;
      state.unreadCount = payload.filter(({ isRead }) => !isRead).length;
    });
    builder.addCase(generateNotifications.rejected, (state) => {
      state.isLoading = false;
    });

    builder.addCase(deleteNotification.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(deleteNotification.fulfilled, (state) => {
      state.isLoading = false;
    });
    builder.addCase(deleteNotification.rejected, (state) => {
      state.isLoading = false;
    });
  },
});

// export const {} = paymentsSlice.actions;

export default paymentsSlice.reducer;
