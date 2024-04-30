export enum Themes {
  Dark = 'dark',
  Light = 'light',
}

export enum Lang {
  //  Arabic = 'ar',
  English = 'en',
  French = 'fr',
}

export interface Settings {
  theme: Themes;
  lang: Lang;
  gymName: string;
  accessInput: boolean;
  appId: string;
}

export interface LicenseData {
  key: string;
  hddsn: string;
  clientName: string;
  phoneNumber: string;
  isActive: boolean;
}
