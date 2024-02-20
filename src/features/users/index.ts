/* eslint-disable no-unused-expressions */
/* eslint-disable no-console */
import { createSlice } from '@reduxjs/toolkit';
import { User } from 'types';
import {
  sessionsEntry,
  fetchUsers,
  getOneUser,
  filterByExpirationDate,
} from './reducers';

interface InitialState {
  users: User[];
  user: User | null;
  isLoading: boolean;
}

const initialState: InitialState = {
  users: [],
  user: null,
  isLoading: false,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(sessionsEntry.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(sessionsEntry.fulfilled, (state) => {
      state.isLoading = false;
    });
    builder.addCase(sessionsEntry.rejected, (state) => {
      state.isLoading = false;
    });

    // fetch users

    builder.addCase(fetchUsers.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      state.users = action.payload;
      state.isLoading = false;
    });
    builder.addCase(fetchUsers.rejected, (state) => {
      state.isLoading = false;
    });

    // get one user

    builder.addCase(getOneUser.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getOneUser.fulfilled, (state, action) => {
      state.user = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getOneUser.rejected, (state) => {
      state.isLoading = false;
    });

    // filter by expiration date

    builder.addCase(filterByExpirationDate.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(filterByExpirationDate.fulfilled, (state, action) => {
      state.users = action.payload;
      state.isLoading = false;
    });
    builder.addCase(filterByExpirationDate.rejected, (state) => {
      state.isLoading = false;
    });
  },
});

export const { setUsers, setUser } = usersSlice.actions;

export default usersSlice.reducer;
