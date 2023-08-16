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
  private prodDbPath = path.join(app.getPath('userData'), 'gymboss.db');

  private devDbPath = path.join(app.getAppPath(), 'gymboss.db');

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
}
