import { database } from "./database";

export type User = {
  id: number;
  name: string;
  email: string;
};

// Create users table
export async function createUsersTable() {
  await (await database).runAsync(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL
    );
  `);
}

// Add default user if not exists
export async function createDefaultUser() {
  const user = await (await database).getFirstAsync<User>(
    `SELECT * FROM users WHERE email = ?`,
    ["default@user.com"]
  );
  if (!user) {
    await (await database).runAsync(
      `INSERT INTO users (name, email) VALUES (?, ?)`,
      ["Default User", "default@user.com"]
    );
  }
}

// Get the default user
export async function getDefaultUser(): Promise<User> {
  const user = await (await database).getFirstAsync<User>(
    `SELECT * FROM users WHERE email = ?`,
    ["default@user.com"]
  );
  if (!user) throw new Error("Default user not found");
  return user;
}
