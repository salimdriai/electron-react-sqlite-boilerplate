export const logAccountQuery =
  'SELECT * FROM Accounts WHERE username = @username AND password = @password';

export const getAllQuery = 'SELECT * FROM Accounts';
export const getOneQuery = 'SELECT * FROM Accounts WHERE username = @username';
export const removeQuery = 'DELETE FROM Accounts WHERE username = @username';

export const createQuery = `INSERT INTO Accounts
  (username, password, permission, role, status, createdAt)
  VALUES (@username, @password, @permission, @role, @status, @createdAt)`;

export const updateQuery = `UPDATE Accounts SET
  username = @username, password = @password,
  permission = @permission, role = @role, status = @status, createdAt = @createdAt
  WHERE username = @username`;

export const accountsCountQuery = `SELECT COUNT(*) FROM Accounts`;

export const createAccountsTable = `
CREATE TABLE IF NOT EXISTS Accounts (
  username TEXT NOT NULL UNIQUE,
  password TEXT UNIQUE,
  permission TEXT,
  role TEXT,
  status TEXT,
  createdAt TEXT
)
`;
