import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';

import usersSlice from './users';
import authenticationSlice from './authentication';
import settingsSlice from './settings';
import paymentsSlice from './payments';
import accountsSlice from './accounts';
import notificationsSlice from './notifications';

const store = configureStore({
  reducer: {
    users: usersSlice,
    authentication: authenticationSlice,
    settings: settingsSlice,
    payments: paymentsSlice,
    accounts: accountsSlice,
    notifications: notificationsSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const useAppSelector: TypedUseSelectorHook<
  ReturnType<typeof store.getState>
> = useSelector;
export const useAppDispatch = () => useDispatch<typeof store.dispatch>();

export default store;
