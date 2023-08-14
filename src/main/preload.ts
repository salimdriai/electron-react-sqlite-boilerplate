// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

import { Account, Settings, User } from 'types';

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

  // settings -------------------
  getSettings: () => ipcRenderer.invoke('settings:get'),
  updateSettings: (settings: Settings) =>
    ipcRenderer.invoke('settings:update', settings),

  // users ----------------------
  getAllUsers: () => ipcRenderer.invoke('user:getAll'),
  getOneUser: (id: string) => ipcRenderer.invoke('user:getOne', id),
  searchUsers: (query: string) => ipcRenderer.invoke('user:search', query),
  insertUser: (user: User) => ipcRenderer.invoke('user:insert', user),
  updateUser: (user: User) => ipcRenderer.invoke('user:update', user),
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
  activateApp: (key: string) => ipcRenderer.invoke('app:activate', key),
  isAppActivated: () => ipcRenderer.invoke('app:isActivated'),
  // other -----------------------

  decryptData: (data: string) => ipcRenderer.invoke('data:decrypt', data),
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
