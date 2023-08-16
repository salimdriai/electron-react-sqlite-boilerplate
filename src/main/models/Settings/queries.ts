export const getQuery = `SELECT * from Settings`;

export const createQuery = `INSERT INTO Settings
(theme, gymName, subscriptions)
VALUES (@theme, @gymName, @subscriptions)`;

export const updateQuery = `
UPDATE Settings
SET subscriptions = @subscriptions,
    theme = @theme,
    gymName = @gymName
WHERE ROWID = 1;
`;

export const createSettingsTable = `
CREATE TABLE IF NOT EXISTS Settings(
  theme TEXT,
  gymName TEXT,
  subscriptions TEXT
)
`;
