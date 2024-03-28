export const createSubscriptionsTable = `
CREATE TABLE IF NOT EXISTS Subscriptions(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId TEXT,
  planId INTEGER,
  startedAt TEXT,
  endsAt TEXT,
  paid INTEGER,
  sessionsAvailable INTEGER,
  sessionsSpent INTEGER
)`;

export const getQuery = `SELECT * FROM Subscriptions LIMIT 10`;
export const getUserSubscriptionsQuery = `SELECT * FROM Subscriptions WHERE userId = @userId`;

export const createQuery = `INSERT INTO Subscriptions
(userId, planId, startedAt, endsAt, paid, sessionsAvailable, sessionsSpent)
VALUES (@userId, @planId, @startedAt, @endsAt, @paid, @sessionsAvailable, @sessionsSpent)
`;

export const removeQuery = `DELETE FROM Subscriptions WHERE id = @id`;

export const updateQuery = `
UPDATE Subscriptions
SET startedAt = @startedAt,
    userId = @userId,
    endsAt = @endsAt,
    paid = @paid,
    sessionsAvailable = @sessionsAvailable,
    sessionsSpent = @sessionsSpent
WHERE id = @id;
`;
