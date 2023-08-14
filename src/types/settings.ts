export enum Themes {
  Dark = 'dark',
  Light = 'light',
}

export interface Subscription {
  name: string;
  monthPrice: number;
  sessionPrice: number;
  sessionsPerMonth: number;
}

export interface Settings {
  theme: Themes;
  gymName: string;
  subscriptions: Subscription[];
}
