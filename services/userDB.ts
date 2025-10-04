import { database } from './database';
import { User } from '../types/User';

// Create the user table
export async function createUsersTable() {
  const db = await database;
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS user (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      firstName TEXT NOT NULL,
      lastName TEXT NOT NULL,
      phoneNumber TEXT
    );
  `);
}

// Add a user
export async function addUser(user: User) {
  const db = await database;

  const statement = await db.prepareAsync(
    `INSERT INTO user (email, password, firstName, lastName, phoneNumber)
     VALUES ($email, $password, $firstName, $lastName, $phoneNumber)`
  );

  try {
    await statement.executeAsync({
      $email: user.email,
      $password: user.password,  // plain text
      $firstName: user.firstName,
      $lastName: user.lastName,
      $phoneNumber: user.phoneNumber,
    });
  } finally {
    await statement.finalizeAsync();
  }
}

// Check login
export async function checkUserLogin(email: string, password: string): Promise<User | null> {
  const db = await database;

  const statement = await db.prepareAsync(
    `SELECT * FROM user WHERE email = $email AND password = $password`
  );

  try {
    const result = await statement.executeAsync({
      $email: email,
      $password: password,  // compare plain text
    });

    const row = (await result.getFirstAsync()) as User | undefined;
    return row || null;
  } finally {
    await statement.finalizeAsync();
  }
}

// Delete user by ID
export async function deleteUserById(id: number) {
  const db = await database;

  const statement = await db.prepareAsync(`DELETE FROM user WHERE id = $id`);

  try {
    await statement.executeAsync({ $id: id });
  } finally {
    await statement.finalizeAsync();
  }
}
