export const getQuery = `SELECT * from Settings`;
export const updateQuery = `
UPDATE Settings
SET subscriptions = @subscriptions,
    theme = @theme,
    gym_name = @gym_name
WHERE ROWID = 1;
`;
