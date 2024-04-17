export const createPaymentTable = `
CREATE TABLE IF NOT EXISTS Payments(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  subscriptionId INTEGER,
  userId INTEGER,
  username TEXT,
  amount INTEGER,
  remaining INTEGER,
  paidAt TEXT,
  startedAt TEXT,
  endsAt TEXT
)`;

export const getQuery = `SELECT * FROM Payments`;
export const getUserPaymentsQuery = `SELECT * FROM Payments WHERE userId = @userId`;

export const createQuery = `INSERT INTO Payments
(userId, subscriptionId, startedAt, endsAt, amount,remaining, paidAt, username)
VALUES (@userId, @subscriptionId, @startedAt, @endsAt, @amount, @remaining, @paidAt, @username)
`;

export const removeQuery = `DELETE FROM Payments WHERE id = @id`;

export const updateQuery = `
UPDATE Payments
SET startedAt = @startedAt,
    endsAt = @endsAt,
    paidAt = @paidAt,
    amount = @amount,
    remaining = @remaining,
    username = @username,
    userId = @userId,
    subscriptionId = @subscriptionId
WHERE id = @id;
`;
