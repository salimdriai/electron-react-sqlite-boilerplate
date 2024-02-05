import { Subscription } from './settings';

export enum BloodType {
  Op = 'O+',
  On = 'O-',
  Ap = 'A+',
  An = 'A-',
  Bp = 'B+',
  Bn = 'B-',
  ABp = 'AB+',
  ABn = 'AB-',
}

export interface UserSubscription {
  subscription: Subscription;
  startedAt: string;
  endsAt: string;
  paid: number;
  sessionsAvailable: number;
  sessionsSpent: number;
  lastEntryTimestamp?: number;
}

export enum Sex {
  Male = 'male',
  Female = 'female',
}

export enum Status {
  Active = 'active',
  Expired = 'expired',
  New = 'new',
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  birthDate: string;
  sex: Sex;
  height?: number;
  weight?: number;
  photo?: string;
  registeredAt: string;
  bloodType?: BloodType;
}
