export const getAllQuery = 'SELECT * FROM Users';
export const getOneQuery = 'SELECT * FROM Users where id = @id';
export const removeQuery = 'DELETE FROM Users WHERE id = @id';
export const removeAllQuery = 'DELETE FROM Users';

export const createQuery = `INSERT INTO Users
  (id, firstName, lastName, phoneNumber, birthDate,
  height, weight, sex, photo, registeredAt, currentSubscriptions,
  allTimeSessions, status, bloodType)
  VALUES (@id, @firstName, @lastName, @phoneNumber, @birthDate,
  @height, @weight, @sex, @photo, @registeredAt, @currentSubscriptions,
  @allTimeSessions, @status, @bloodType)`;

export const updateQuery = `UPDATE Users SET
  firstName = @firstName, lastName = @lastName,
  phoneNumber = @phoneNumber, birthDate = @birthDate,
  height = @height, weight = @weight, sex = @sex, photo = @photo,
  registeredAt = @registeredAt,
  currentSubscriptions = @currentSubscriptions,
  allTimeSessions = @allTimeSessions, status = @status,
  bloodType = @bloodType
  WHERE id = @id`;

export const searchQuery = `SELECT * FROM Users
  WHERE id LIKE '%' || ? || '%' OR firstName LIKE '%' || ? || '%' OR lastName LIKE '%' || ? || '%'`;