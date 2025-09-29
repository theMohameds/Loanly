import * as SQLite from "expo-sqlite";
import { Car } from "../types/Car";

const db = SQLite.openDatabaseSync("cars.db");



export async function initDB() {
  // WARNING: deletes all existing data
  await db.execAsync("DROP TABLE IF EXISTS cars;");

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS cars (
      id INTEGER PRIMARY KEY NOT NULL,
      make TEXT,
      model TEXT,
      year INTEGER,
      color TEXT,
      pricePerDay REAL,
      isAvailable INTEGER
    );
  `);
}

export async function clearCars() {
  await db.execAsync("DELETE FROM cars");
}

export async function saveCars(cars: Car[]) {
  await db.execAsync("BEGIN TRANSACTION;");
  try {
    for (const car of cars) {
      await db.runAsync(
        "INSERT INTO cars (id, make, model, year, color, pricePerDay, isAvailable) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [
          car.id,
          car.make,
          car.model,
          car.year,
          car.color,
          car.pricePerDay,
          car.isAvailable ? 1 : 0,
        ]
      );
    }
    await db.execAsync("COMMIT;");
  } catch (error) {
    await db.execAsync("ROLLBACK;");
    console.error("Failed to save cars:", error);
  }
}

export async function loadCars(): Promise<Car[]> {
  const result = await db.getAllAsync<Car>("SELECT * FROM cars");
  return result.map((car) => ({
    ...car,
    isAvailable: !!car.isAvailable, // convert 1/0 to boolean
  }));
}


