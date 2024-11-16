/* eslint-disable promise/always-return */
/* eslint-disable class-methods-use-this */
// @ts-nocheck

import path from 'path';
import dotenv from 'dotenv';
import { app } from 'electron';
import Database from 'better-sqlite3';

dotenv.config();

const isDevelopment =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

export default class DB {
  private prodDbPath = path.join(app.getPath('userData'), 'database.db');

  private devDbPath = path.join(app.getAppPath(), 'database.db');

  connect() {
    const dbPath = isDevelopment ? this.devDbPath : this.prodDbPath;

    return new Database(dbPath, {
      verbose: console.log,
    });
  }

  close() {
    Database.close();
  }

  clear() {
    Database.clear();
  }

  backup() {
    const dbPath = !isDevelopment
      ? path.join(app.getPath('userData'), `backup-${Date.now()}.db`)
      : path.join(app.getAppPath(), `backup-${Date.now()}.db`);

    const db = this.connect();

    db.backup(dbPath)
      .then(() => {
        console.log('backup complete!');
      })
      .catch((err: any) => {
        console.log('backup failed:', err);
      });
  }
}
