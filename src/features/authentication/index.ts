import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import {
  saveToLocalStorage,
  getFromLocalStorage,
  removeFromLocalStorage,
} from 'utils/local-storage';
import { logAccount } from './reducers';

const AuthLsKey = 'auth';

interface InitialState {
  isAuthneticated: boolean;
  username: string;
  permission: string;
  loading: boolean;
  error: any;
}

const initialState: InitialState = {
  isAuthneticated: false,
  username: '',
  permission: '',
  loading: false,
  error: null,
};

const authenticationSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    logout: (state) => {
      state.username = '';
      state.permission = '';
      state.isAuthneticated = false;
      removeFromLocalStorage(AuthLsKey);
    },
    currentUser: (state) => {
      const user: Partial<InitialState> = getFromLocalStorage(AuthLsKey) || {};
      state.username = user.username || '';
      state.permission = user.permission || '';
      state.isAuthneticated = !!user.username;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(logAccount.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(logAccount.fulfilled, (state, { payload }) => {
      if (payload === undefined) {
        toast.error('User not found !');
        return;
      }
      state.loading = false;
      state.username = payload.username;
      state.permission = payload.permission;
      state.isAuthneticated = true;

      saveToLocalStorage(AuthLsKey, {
        username: payload.username,
        permission: payload.permission,
      });
    });
  },
});

export const { logout, currentUser } = authenticationSlice.actions;

export default authenticationSlice.reducer;
