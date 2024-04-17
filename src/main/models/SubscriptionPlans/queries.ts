export const createSubscriptionPlansTable = `CREATE TABLE IF NOT EXISTS SubscriptionPlans(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  monthPrice REAL,
  sessionPrice REAL,
  sessionsPerMonth INTEGER
)`;

export const getQuery = `SELECT * FROM SubscriptionPlans`;

export const createQuery = `INSERT INTO SubscriptionPlans
(id, name, monthPrice, sessionPrice, sessionsPerMonth)
VALUES (@id, @name, @monthPrice, @sessionPrice, @sessionsPerMonth)`;

export const createQueryWithouId = `INSERT INTO SubscriptionPlans
(name, monthPrice, sessionPrice, sessionsPerMonth)
VALUES (@name, @monthPrice, @sessionPrice, @sessionsPerMonth)`;

export const updateQuery = `
UPDATE SubscriptionPlans
SET name = @name,
    monthPrice = @monthPrice,
    sessionPrice = @sessionPrice,
    sessionsPerMonth = @sessionsPerMonth
    WHERE id = @id;
`;

export const removeQuery = 'DELETE FROM SubscriptionPlans WHERE id = @id';
