import { createAsyncThunk } from '@reduxjs/toolkit';
import { Payment } from 'types';

export const createPayment = createAsyncThunk(
  'createPayment',
  async (payment: Payment) => {
    await window.electron.createPayment(payment);
    return payment;
  }
);

export const getAllPayments = createAsyncThunk('getPayments', async () => {
  const payments = await window.electron.getAllPayments();
  return payments as Payment[];
});

export const getUserPayments = createAsyncThunk(
  'getUserPayments',
  async (userId: string) => {
    const payments = await window.electron.getUserPayments(userId);
    return payments as Payment[];
  }
);
