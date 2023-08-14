/* eslint-disable no-unused-expressions */
/* eslint-disable no-console */
import { createSlice } from '@reduxjs/toolkit';
import { sessionsEntry } from './reducers';

interface InitialState {}

const initialState: InitialState = {};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(sessionsEntry.pending, () => {
      console.log('PENDING');
    });
    builder.addCase(sessionsEntry.fulfilled, () => {
      console.log('FULLFILED');
    });
    builder.addCase(sessionsEntry.rejected, (_, action) => {
      console.log('rejected', action.error);
    });
  },
});

// export const {} = usersSlice.actions;

export default usersSlice.reducer;
