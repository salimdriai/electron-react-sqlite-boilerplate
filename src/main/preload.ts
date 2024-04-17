// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

import {
  Account,
  FreeSession,
  Payment,
  Subscription,
  SubscriptionPlan,
  User,
  Notification,
  ActivationData,
} from 'types';

export type Channels = 'ipc-example';

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },

  // machine address
  getMac: () => ipcRenderer.invoke('getMac'),

  // activation
  activateApp: (data: ActivationData) => ipcRenderer.invoke('activate', data),

  // users ----------------------
  getAllUsers: (permission: string) =>
    ipcRenderer.invoke('user:getAll', permission),
  getOneUser: (id: string) => ipcRenderer.invoke('user:getOne', id),
  searchUsers: (query: string) => ipcRenderer.invoke('user:search', query),
  createUser: (user: User) => ipcRenderer.invoke('user:create', user),
  updateUser: (user: User, id: string) =>
    ipcRenderer.invoke('user:update', user, id),
  removeUser: (id: string) => ipcRenderer.invoke('user:remove', id),
  removeAllUsers: () => ipcRenderer.invoke('user:removeAll'),

  // account ---------------------
  getAllAccounts: () => ipcRenderer.invoke('account:getAll'),
  logAccount: (username: string, password: string) =>
    ipcRenderer.invoke('account:logAccount', username, password),
  getOneAccount: (username: string) =>
    ipcRenderer.invoke('account:getOne', username),
  createAccount: (account: Account) =>
    ipcRenderer.invoke('account:insert', account),
  updateAccount: (account: Account) =>
    ipcRenderer.invoke('account:update', account),
  removeAccount: (username: string) =>
    ipcRenderer.invoke('account:remove', username),

  // free session ----------------
  getFreeSessions: () => ipcRenderer.invoke('freeSession:getAll'),
  createFreeSessions: (session: FreeSession) =>
    ipcRenderer.invoke('freeSession:create', session),
  updateFreeSessions: (session: FreeSession) =>
    ipcRenderer.invoke('freeSession:update', session),
  removeFreeSessions: (id: string) =>
    ipcRenderer.invoke('freeSession:delete', id),

  // subscription plans
  getSubscriptionPlans: () => ipcRenderer.invoke('subscriptionPlan:getAll'),
  createSubscriptionPlan: (plan: SubscriptionPlan) =>
    ipcRenderer.invoke('subscriptionPlan:create', plan),
  updateSubscriptionPlan: (plan: SubscriptionPlan) =>
    ipcRenderer.invoke('subscriptionPlan:update', plan),

  // subscriptions
  getAllSubscriptions: () => ipcRenderer.invoke('subscriptions:getAll'),
  getUsersubscriptions: (userId: string) =>
    ipcRenderer.invoke('subscriptions:getUserSubscriptions', userId),
  createSubscription: (subscription: Subscription) =>
    ipcRenderer.invoke('subscriptions:create', subscription),
  updateSubscription: (subscription: Subscription) =>
    ipcRenderer.invoke('subscriptions:update', subscription),
  deleteSubscription: (id: string) =>
    ipcRenderer.invoke('subscriptions:delete', id),

  // payments
  getAllPayments: () => ipcRenderer.invoke('payments:getAll'),
  getUserPayments: (userId: string) =>
    ipcRenderer.invoke('payments:getUserPayments', userId),
  createPayment: (payment: Payment) =>
    ipcRenderer.invoke('payments:create', payment),
  updatePayment: (payment: Payment) =>
    ipcRenderer.invoke('payments:update', payment),

  // notifications
  getNotifications: () => ipcRenderer.invoke('notifications:getAll'),
  createNotification: (notification: Notification) =>
    ipcRenderer.invoke('notifications:create', notification),
  updateNotification: (notification: Notification) =>
    ipcRenderer.invoke('notifications:update', notification),
  deleteNotification: (id: string) =>
    ipcRenderer.invoke('notifications:delete', id),

  // other -----------------------
  decryptData: (data: string) => ipcRenderer.invoke('data:decrypt', data),
  getStoreData: (key: string) => ipcRenderer.invoke('store:get', key),
  setStoreData: (key: string, data: any) =>
    ipcRenderer.invoke('store:set', key, data),
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
