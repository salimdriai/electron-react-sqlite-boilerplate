import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { Permission } from 'types';
import {
  saveToLocalStorage,
  getFromLocalStorage,
  removeFromLocalStorage,
} from 'utils/local-storage';
import { logAccount } from './reducers';

interface InitialState {
  isAuthneticated: boolean;
  username: string;
  permission: Permission | '';
  loading: boolean;
  error: any;
}

const AuthLsKey = 'auth';
const auth: any = getFromLocalStorage(AuthLsKey);
const defaultUsername = auth?.username || '';
const defaultPermission = auth?.permission || '';

const initialState: InitialState = {
  isAuthneticated: !!defaultUsername,
  username: defaultUsername,
  permission: defaultPermission,
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
        state.loading = false;
        return;
      }
      state.username = payload.username;
      state.permission = payload.permission;
      state.isAuthneticated = true;
      state.loading = false;

      saveToLocalStorage(AuthLsKey, {
        username: payload.username,
        permission: payload.permission,
      });
    });
    builder.addCase(logAccount.rejected, (state) => {
      state.loading = false;
    });
  },
});

export const { logout, currentUser } = authenticationSlice.actions;

export default authenticationSlice.reducer;
