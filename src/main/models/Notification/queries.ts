export const createNotifcationsTable = `
CREATE TABLE IF NOT EXISTS Notifcation(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  planId INTEGER,
  userId INTEGER,
  subscriptionId INTEGER,
  username TEXT,
  photo TEXT,
  message TEXT,
  createdAt TEXT,
  isRead INTEGER
)`;

export const getQuery = `SELECT * FROM Notifcation`;

export const createQuery = `INSERT INTO Notifcation
(userId, planId, subscriptionId, username, photo, message,createdAt, isRead)
VALUES (@userId, @planId, @subscriptionId, @username, @photo, @message, @createdAt, @isRead)
`;

export const removeQuery = `DELETE FROM Notifcation WHERE id = @id`;

export const updateQuery = `
UPDATE Notifcation
SET userId = @userId,
    planId = @planId,
    subscriptionId = @subscriptionId,
    username = @username,
    photo = @photo,
    message = @message,
    createdAt = @createdAt,
    isRead = @isRead
WHERE id = @id;
`;

export const readAll = `
UPDATE Notifcation
SET isRead = 1
`;
export const deleteAll = `DELETE FROM Notifcation`;
