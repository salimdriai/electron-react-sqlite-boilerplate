/* eslint-disable camelcase */
// @ts-ignore
import Database from 'better-sqlite3';
import path from 'path';

export type User = {
  id?: number;
  first_name: string;
  last_name: string;
};

export function connect() {
  return Database(
    path.join(__dirname, '../../../', 'release/app', 'database.db'),
    { verbose: console.log, fileMustExist: true }
  );
}

export function closeDb() {
  console.log('Closing DB ...');
  Database.close();
  console.log('----DB Closed----');
}

export function insertUser(user: User) {
  const db = connect();

  const stm = db.prepare(
    'INSERT INTO Users (first_name, last_name) VALUES (@first_name, @last_name)'
  );

  stm.run(user);
}

export function updateUser(user: User) {
  const db = connect();
  const { first_name, last_name, id } = user;

  const stm = db.prepare(
    'UPDATE Users SET first_name = @first_name, last_name = @last_name WHERE id = @id'
  );

  stm.run({ first_name, last_name, id });
}

export function deleteUser(id: number) {
  const db = connect();

  const stm = db.prepare('DELETE FROM Users WHERE id = @id');

  stm.run({ id });
}

export function getAllUsers() {
  const db = connect();
  const stm = db.prepare('SELECT * FROM Users');

  return stm.all() as User[];
}

export function getOneUser(id: number) {
  const db = connect();

  const stm = db.prepare('SELECT * FROM Users where id = @id');

  return stm.get({ id }) as User;
}
