/* eslint-disable class-methods-use-this */
// @ts-nocheck

import Database from 'better-sqlite3';
import path from 'path';

export default class DB {
  connect() {
    return new Database(
      path.join(__dirname, '../../../', 'release/app', 'database.db'),
      // eslint-disable-next-line no-console
      { verbose: console.log, fileMustExist: true }
    );
  }

  close() {
    Database.close();
  }

  clear() {
    Database.clear();
  }
}
