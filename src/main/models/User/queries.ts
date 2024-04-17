export const getAllQuery = 'SELECT * FROM Users';

export const getByPermission = `SELECT * FROM Users WHERE sex = @sex`;

export const getOneQuery = 'SELECT * FROM Users where id = @id';
export const removeQuery = 'DELETE FROM Users WHERE id = @id';
export const removeAllQuery = 'DELETE FROM Users';

export const createQuery = `INSERT INTO Users
  (id, firstName, lastName, phoneNumber, birthDate,
  height, weight, sex, photo, registeredAt,
  bloodType,lastEntryTimestamp,
  allTimeEntries,notes)
  VALUES (@id, @firstName, @lastName, @phoneNumber, @birthDate,
  @height, @weight, @sex, @photo, @registeredAt,
  @bloodType, @lastEntryTimestamp,
  @allTimeEntries, @notes)`;

export const updateQuery = `UPDATE Users SET
  id = @id,
  firstName = @firstName, lastName = @lastName,
  phoneNumber = @phoneNumber, birthDate = @birthDate,
  height = @height, weight = @weight, sex = @sex, photo = @photo,
  registeredAt = @registeredAt,
  bloodType = @bloodType,
  lastEntryTimestamp = @lastEntryTimestamp,
  allTimeEntries = @allTimeEntries,
  notes = @notes
  WHERE id = @oldId`;

export const searchQuery = `SELECT * FROM Users
  WHERE id LIKE '%' || ? || '%' OR firstName LIKE '%' || ? || '%' OR lastName LIKE '%' || ? || '%'`;

export const createUsersTable = `
CREATE TABLE IF NOT EXISTS Users(
  id TEXT,
  firstName TEXT,
  lastName TEXT,
  phoneNumber TEXT,
  birthDate TEXT,
  height INTEGER,
  weight INTEGER,
  sex TEXT,
  photo BLOB,
  registeredAt TEXT,
  bloodType TEXT,
  lastEntryTimestamp INTEGER,
  allTimeEntries INTEGER,
  notes TEXT
)
`;
