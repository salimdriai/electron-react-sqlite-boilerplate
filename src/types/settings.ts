export enum Themes {
  Dark = 'dark',
  Light = 'light',
}

export enum Lang {
  //  Arabic = 'ar',
  English = 'en',
  French = 'fr',
}

// export interface Subscription {
//   name: string;
//   monthPrice: number;
//   sessionPrice: number;
//   sessionsPerMonth: number;
// }

export interface Settings {
  theme: Themes;
  lang: Lang;
  gymName: string;
  accessInput: boolean;
}
