import { Subscription } from './subscriptions';

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
  photo?: Buffer | string;
  registeredAt: string;
  bloodType?: BloodType;
  lastEntryTimestamp: number;
  allTimeEntries?: number;
  notes?: string;
  subscriptions: Subscription[];
}
