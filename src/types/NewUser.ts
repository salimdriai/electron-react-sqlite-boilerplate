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
