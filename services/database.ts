import * as SQLite from "expo-sqlite";
import { Car } from "../types/Car";

const db = SQLite.openDatabaseSync("cars.db");

export async function initDB() {
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
  await db.runAsync("DELETE FROM cars");
}

export async function saveCars(cars: Car[]) {
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
        car.isAvailable ? 1 : 0, // store boolean as 1/0
      ]
    );
  }
}

export async function loadCars(): Promise<Car[]> {
  const result = await db.getAllAsync<Car>("SELECT * FROM cars");
  // convert isAvailable back to boolean
  return result.map((car) => ({
    ...car,
    isAvailable: !!car.isAvailable,
  }));
}
