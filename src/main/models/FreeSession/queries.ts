export const getQuery = `SELECT * FROM FreeSessions`;
export const createQuery = `INSERT INTO FreeSessions
(firstName, lastName, plansIds, enteredAt, totalPaid)
VALUES (@firstName, @lastName, @plansIds, @enteredAt, @totalPaid)
`;

export const removeQuery = `DELETE FROM Users WHERE id = @id`;

export const createFreeSessionTable = `
CREATE TABLE IF NOT EXISTS FreeSessions(
  firstName TEXT,
  lastName TEXT,
  plansIds TEXT,
  enteredAt TEXT,
  totalPaid INTEGER
)`;

export const updateQuery = `
UPDATE Settings
SET firstName = @firstName,
lastName = @lastName,
plansIds = @plansIds,
totalPaid = @totalPaid
WHERE id = @id;
`;
