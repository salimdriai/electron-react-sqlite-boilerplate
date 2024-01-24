export const getQuery = `SELECT * from Settings`;

export const createQuery = `INSERT INTO Settings
(theme, lang, gymName, subscriptions)
VALUES (@theme, @lang, @gymName, @subscriptions)`;

export const updateQuery = `
UPDATE Settings
SET theme = @theme,
    lang = @lang,
    gymName = @gymName,
    subscriptions = @subscriptions
WHERE ROWID = 1;
`;

export const createSettingsTable = `
CREATE TABLE IF NOT EXISTS Settings(
  theme TEXT,
  lang TEXT,
  gymName TEXT,
  subscriptions TEXT
)
`;
