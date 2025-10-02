import { database } from "./database";
import type { Rating } from "../types/Rating";

export async function createRatingsTable() {
  const db = await database;
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS ratings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      car_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      score INTEGER NOT NULL,
      comment TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (car_id) REFERENCES cars(id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `);
}

export async function dropTableRatings() {
  const db = await database;
  await db.execAsync("DROP TABLE IF EXISTS ratings;");
}

export async function clearRatings() {
  const db = await database;
  await db.execAsync("DELETE FROM ratings");
}

export async function addRating(rating: Rating): Promise<number> {
  const db = await database;
  await db.runAsync(
    `INSERT INTO ratings (car_id, user_id, score, comment)
     VALUES ($car_id, $user_id, $score, $comment)`,
    {
      $car_id: rating.car_id,
      $user_id: rating.user_id,
      $score: rating.score,
      $comment: rating.comment ?? null,
    }
  );

  const row = await db.getFirstAsync<{ id: number }>(
    "SELECT last_insert_rowid() as id"
  );
  if (!row) throw new Error("Failed to get rating ID");
  return row.id;
}

export async function loadRatings(): Promise<Rating[]> {
  const db = await database;
  return db.getAllAsync<Rating>("SELECT * FROM ratings ORDER BY created_at DESC");
}

export async function deleteRating(id: number): Promise<void> {
  const db = await database;
  await db.runAsync("DELETE FROM ratings WHERE id = $id", { $id: id });
}