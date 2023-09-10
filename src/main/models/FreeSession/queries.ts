export const getQuery = `SELECT * FROM FreeSessions`;
export const createQuery = `INSERT INTO FreeSessions
(firstName, lastName, sessionType, enteredAt, totalPaid)
VALUES (@firstName, @lastName, @sessionType, @enteredAt, @totalPaid)
`;

export const removeQuery = `DELETE FROM Users WHERE id = @id`;

export const createFreeSessionTable = `
CREATE TABLE IF NOT EXISTS FreeSessions(
  firstName TEXT,
  lastName TEXT,
  sessionType TEXT,
  enteredAt TEXT,
  totalPaid TEXT
)`;

export const updateQuery = `
UPDATE Settings
SET firstName = @firstName,
lastName = @lastName,
sessionType = @sessionType,
totalPaid = @totalPaid
WHERE id = @id;
`;
