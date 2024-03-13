import { createSlice } from '@reduxjs/toolkit';
import { Account } from 'types';

import { getAllAccounts } from './reducers';

interface InitialState {
  allAcounts: Account[];
  loading: boolean;
  error: any;
}

const initialState: InitialState = {
  allAcounts: [],
  loading: false,
  error: null,
};

const accountsSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder.addCase(getAllAccounts.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getAllAccounts.fulfilled, (state, action) => {
      state.allAcounts = action.payload;
      state.loading = false;
    });
    builder.addCase(getAllAccounts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error;
    });
  },
});

export default accountsSlice.reducer;
