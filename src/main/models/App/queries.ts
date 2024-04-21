export const getQuery = `SELECT * FROM App LIMIT 1`;
export const createQuery = `INSERT INTO App (id, license) VALUES (@id, @license)`;

export const createAppTable = `
CREATE TABLE IF NOT EXISTS App(
  id INTEGER,
  license TEXT
)`;

export const updateQuery = `
UPDATE App
SET license = @license
WHERE id = @id;
`;
