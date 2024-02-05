export const createSubscriptionsTable = `
CREATE TABLE IF NOT EXISTS Subscriptions(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId TEXT,
  planId TEXT,
  startedAt TEXT,
  endsAt TEXT,
  paid NUMBER,
  sessionsAvailable NUMBER,
  sessionsSpent NUMBER,
  lastEntryTimestamp NUMBER
)`;

export const getQuery = `SELECT * FROM Subscriptions`;
export const getUserSubscriptionsQuery = `SELECT * FROM Subscriptions WHERE userId = @userId`;

export const createQuery = `INSERT INTO Subscriptions
(userId, planId, startedAt, endsAt, paid, sessionsAvailable, sessionsSpent, lastEntryTimestamp)
VALUES (@userId, @planId, @startedAt, @endsAt, @paid, @sessionsAvailable, @sessionsSpent, @lastEntryTimestamp)
`;

export const removeQuery = `DELETE FROM Subscriptions WHERE id = @id`;

export const updateQuery = `
UPDATE Subscriptions
SET id = @id,
    userId = @userId,
    planId = @planId,
    startedAt = @startedAt,
    endsAt = @endsAt,
    paid = @paid,
    sessionsAvailable = @sessionsAvailable,
    sessionsSpent = @sessionsSpent,
    lastEntryTimestamp = @lastEntryTimestamp
WHERE id = @id;
`;
