/* eslint-disable class-methods-use-this */
// @ts-nocheck

import path from 'path';
import dotenv from 'dotenv';
import Database from 'better-sqlite3';

import webpackPaths from '../../.erb/configs/webpack.paths';

dotenv.config();

const isDevelopment =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

export default class DB {
  connect() {
    const dbPath = isDevelopment
      ? path.join(webpackPaths.srcPath, '../database/database.db')
      : path.join(process.resourcesPath, 'database/database.db');

    return new Database(dbPath, { verbose: console.log, fileMustExist: true });
  }

  close() {
    Database.close();
  }

  clear() {
    Database.clear();
  }
}
