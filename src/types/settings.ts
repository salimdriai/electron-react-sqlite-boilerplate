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
}

export interface ActivationData {
  key: string;
  mac: string;
  clientName: string;
  phoneNumber: string;
  isActive: boolean;
}
