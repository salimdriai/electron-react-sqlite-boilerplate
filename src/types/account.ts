export enum Permission {
  Admin = 'admin',
  Male = 'male',
  Female = 'female',
  All = 'all',
}

export enum Role {
  Coach = 'coach',
  Employee = 'employee',
  Owner = 'owner',
}

export enum AccountStatus {
  Active = 'active',
  InActive = 'incative',
}

export interface Account {
  username: string;
  password: string;
  phoneNumber: string;
  photo?: string;
  permission: Permission;
  role: string;
  status: string;
  createdAt: string;
}
