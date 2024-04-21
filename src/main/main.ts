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
import { exec } from 'child_process';
import { app, BrowserWindow, shell, ipcMain, dialog } from 'electron';
// import { autoUpdater } from 'electron-updater';
// import log from 'electron-log';
import DB from './db';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import { decryptData } from './utils/Encription';
import { SECRET_KEY, SECRET_IV } from './config/keys';
import AppModel from './models/App';

import * as UsersIPC from './ipc/usersIpc';
import * as SubscriptionPlansIPC from './ipc/subscriptionPlansIpc';
import * as SubscriptionsIPC from './ipc/subscriptionsIpc';
import * as AccountsIPC from './ipc/accountsIpc';
import * as PaymentsIPC from './ipc/paymentsIpc';
import * as NotificationsIPC from './ipc/notificationsIpc';
import * as FreeSessionsIPC from './ipc/freeSessionsIpc';
import * as StoreIPC from './ipc/storeIpc';

// class AppUpdater {
//   constructor() {
//     log.transports.file.level = 'info';
//     autoUpdater.logger = log;
//     // autoUpdater.checkForUpdatesAndNotify();
//     autoUpdater.autoDownload = false;
//   }
// }

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
      webSecurity: false,
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
    mainWindow.show();
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
  // new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('before-quit', () => {
  const db = new DB();
  db.close();

  window.localStorage.clear();
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
  .then(async () => {
    const App = new AppModel();

    const getHddSerialNumber = () =>
      new Promise((resolve, reject) => {
        const isWindows = process.platform === 'win32';
        const operation = isWindows
          ? 'wmic diskdrive get serialnumber'
          : 'smartctl -a /dev/sda | grep "Serial Number"';

        exec(operation, (err, stdout) => {
          if (err) {
            console.error(`exec error: ${err}`);
            reject(err);
            return;
          }
          const serialNumber = stdout.split(isWindows ? '\n' : ':')[1].trim();
          resolve(serialNumber);
        });
      });

    const hddSerialNumber = await getHddSerialNumber();
    const licenseData = await App.initLicense();

    const savedHddSerialNumber = licenseData.hddsn;
    const isActivated = licenseData.isActive;

    if (isActivated && hddSerialNumber !== savedHddSerialNumber) {
      dialog.showMessageBoxSync({
        type: 'error',
        title: 'Cannot use the app on this PC!',
        message: `The app can be used only on the pc where it is first activated.`,
      });

      app.quit();
      return;
    }

    // machine address
    ipcMain.handle('getHddSerialNumber', async () => hddSerialNumber);

    // app activation
    ipcMain.handle('activate', async (_, data: any) => {
      // const result = await Account.setLicenseData(data);
      const result = await App.updateLicense(data);
      return result;
    });

    ipcMain.handle('getLicenseData', async () => {
      const result = await App.getLicense();
      console.log('getLicense---------------', result);
      return result;
    });

    // users ----------------------
    ipcMain.handle('user:getAll', UsersIPC.getAll);
    ipcMain.handle('user:getOne', UsersIPC.getOne);
    ipcMain.handle('user:create', UsersIPC.create);
    ipcMain.handle('user:search', UsersIPC.search);
    ipcMain.handle('user:update', UsersIPC.update);
    ipcMain.handle('user:remove', UsersIPC.remove);
    ipcMain.handle('user:removeAll', UsersIPC.removeAll);

    // subscription plans -------------
    ipcMain.handle('subscriptionPlan:getAll', SubscriptionPlansIPC.getAll);
    ipcMain.handle('subscriptionPlan:create', SubscriptionPlansIPC.create);
    ipcMain.handle('subscriptionPlan:update', SubscriptionPlansIPC.update);

    // subscriptions -------------------
    ipcMain.handle('subscriptions:getAll', SubscriptionsIPC.getAll);
    ipcMain.handle('subscriptions:create', SubscriptionsIPC.create);
    ipcMain.handle('subscriptions:update', SubscriptionsIPC.update);
    ipcMain.handle('subscriptions:delete', SubscriptionsIPC.remove);
    ipcMain.handle(
      'subscriptions:getUserSubscriptions',
      SubscriptionsIPC.getUserSubscriptions
    );

    // account ---------------------
    ipcMain.handle('account:getAll', AccountsIPC.getAll);
    ipcMain.handle('account:logAccount', AccountsIPC.logAccount);
    ipcMain.handle('account:getOne', AccountsIPC.getOne);
    ipcMain.handle('account:insert', AccountsIPC.create);
    ipcMain.handle('account:update', AccountsIPC.update);
    ipcMain.handle('account:remove', AccountsIPC.remove);
    ipcMain.handle('account:initAdmin', AccountsIPC.initAdmin);

    // free session
    ipcMain.handle('freeSession:getAll', FreeSessionsIPC.getAll);
    ipcMain.handle('freeSession:create', FreeSessionsIPC.create);
    ipcMain.handle('freeSession:update', FreeSessionsIPC.update);
    ipcMain.handle('freeSession:delete', FreeSessionsIPC.remove);

    // payments
    ipcMain.handle('payments:getAll', PaymentsIPC.getAll);
    ipcMain.handle('payments:getUserPayments', PaymentsIPC.getOne);
    ipcMain.handle('payments:create', PaymentsIPC.create);
    ipcMain.handle('payments:update', PaymentsIPC.update);

    // notifications
    ipcMain.handle('notifications:getAll', NotificationsIPC.getAll);
    ipcMain.handle('notifications:create', NotificationsIPC.create);
    ipcMain.handle('notifications:update', NotificationsIPC.update);
    ipcMain.handle('notifications:delete', NotificationsIPC.remove);

    // store
    ipcMain.handle('store:get', StoreIPC.getData);
    ipcMain.handle('store:set', StoreIPC.setData);

    // other
    ipcMain.handle('data:decrypt', async (_, data: string) => {
      const decryptedData = decryptData(data, SECRET_KEY, SECRET_IV);
      return decryptedData;
    });

    createWindow();

    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
