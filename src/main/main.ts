/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import {
  User as UserType,
  Account as AccountType,
  Settings as SettingsType,
} from 'types';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import { decryptData } from './utils/Encription';

import DB from './db';
import UserModel from './models/User';
import AccountModel from './models/Account';
import SettingsModel from './models/Settings';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('before-quit', () => {
  // Close the database connection
  const db = new DB();
  db.close();
});

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    /* const db = new DB();
    db.connect(); */

    const User = new UserModel();
    const Account = new AccountModel();
    const Settings = new SettingsModel();

    // settings
    ipcMain.handle('settings:get', async () => {
      const settings = await Settings.get();
      return settings;
    });
    ipcMain.handle('settings:update', async (_, settings: SettingsType) => {
      await Settings.update(settings);
      return settings;
    });

    // users ----------------------
    ipcMain.handle('user:getAll', async () => {
      const users = await User.getAll();
      return users;
    });
    ipcMain.handle('user:getOne', async (_, id: string) => {
      const user = await User.getOne(id);
      return user;
    });
    ipcMain.handle('user:search', async (_, query: string) => {
      const users = await User.search(query);
      return users;
    });
    ipcMain.handle('user:insert', async (_, user: UserType) => {
      await User.create(user);
      return user;
    });
    ipcMain.handle('user:update', async (_, user: UserType) => {
      await User.update(user);
      return user;
    });
    ipcMain.handle('user:remove', async (_, id: string) => {
      await User.remove(id);
    });
    ipcMain.handle('user:removeAll', async () => {
      await User.removeAll();
    });

    // account ---------------------
    ipcMain.handle('account:getAll', async () => {
      const users = await Account.getAll();
      return users;
    });
    ipcMain.handle(
      'account:logAccount',
      async (_, username: string, password: string) => {
        const account = await Account.logAccount(username, password);
        return account;
      }
    );
    ipcMain.handle('account:getOne', async (_, username: string) => {
      const account = await Account.getOne(username);
      return account;
    });
    ipcMain.handle('account:insert', async (_, account: AccountType) => {
      await Account.create(account);
      return account;
    });
    ipcMain.handle('account:update', async (_, account: AccountType) => {
      await Account.update(account);
      return account;
    });
    ipcMain.handle('account:remove', async (_, username: string) => {
      await Account.remove(username);
    });

    ipcMain.handle('data:decrypt', async (_, data: string) => {
      const decryptedData = decryptData(data);
      return decryptedData;
    });

    ipcMain.handle('app:activate', async (_, key: string) => {
      const res = await Account.activateApp(key);
      return res;
    });
    ipcMain.handle('app:isActivated', async () => {
      const res = await Account.isAppActivated();
      return res;
    });

    createWindow();

    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });

    /* nfc.on('error', (err) => {
      console.log('an error occurred', err);
    }); */
  })
  .catch(console.log);
