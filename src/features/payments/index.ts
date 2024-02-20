/* eslint-disable no-unused-expressions */
/* eslint-disable no-console */
import { createSlice } from '@reduxjs/toolkit';
import { Payment } from 'types';
import { getAllPayments, getUserPayments } from './reducers';

interface InitialState {
  allPayments: Payment[];
  userPayments: Payment[];
  isLoading: boolean;
}

const initialState: InitialState = {
  allPayments: [],
  userPayments: [],
  isLoading: false,
};

const paymentsSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllPayments.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getAllPayments.fulfilled, (state, { payload }) => {
      state.isLoading = true;
      state.allPayments = payload;
    });
    builder.addCase(getAllPayments.rejected, (state) => {
      state.isLoading = false;
    });

    builder.addCase(getUserPayments.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getUserPayments.fulfilled, (state, { payload }) => {
      state.isLoading = true;
      state.userPayments = payload;
    });
    builder.addCase(getUserPayments.rejected, (state) => {
      state.isLoading = false;
    });
  },
});

// export const {} = paymentsSlice.actions;

export default paymentsSlice.reducer;
