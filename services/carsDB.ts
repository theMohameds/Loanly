import { database } from "./database";
import { Car } from "../types/Car";

export async function createCarsTable() {
    const db = await database;
    await db.execAsync(`
    CREATE TABLE IF NOT EXISTS cars (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      make TEXT NOT NULL,
      model TEXT NOT NULL,
      year INTEGER NOT NULL,
      color TEXT,
      pricePerDay REAL NOT NULL,
      isAvailable INTEGER NOT NULL
    );
  `);
}

export async function dropTableCar() {
    const db = await database;
    // WARNING: deletes all existing data
    await db.execAsync("DROP TABLE IF EXISTS cars;");
}

export async function clearCars() {
    const db = await database;
    await db.execAsync("DELETE FROM cars");
}

//Done
export async function saveCars(cars: Car[]) {
    const db = await database;

    return await db.withExclusiveTransactionAsync(async () => {
        // Prepare the INSERT statement once
        const statement = await db.prepareAsync(
            `INSERT INTO cars (id, make, model, year, color, pricePerDay, isAvailable)
       VALUES ($id, $make, $model, $year, $color, $pricePerDay, $isAvailable)`
        );

        try {
            // Execute the statement for each car
            for (const car of cars) {
                await statement.executeAsync({
                    $make: car.make,
                    $model: car.model,
                    $year: car.year,
                    $color: car.color,
                    $pricePerDay: car.pricePerDay,
                    $isAvailable: car.isAvailable ? 1 : 0,
                });
            }
        } finally {
            // Always finalize to release resources
            await statement.finalizeAsync();
        }
    });
}

//Done
export async function addCar(car: Car) {
    const db = await database;
    try {
        await db.runAsync(
            `INSERT INTO cars (make, model, year, color, pricePerDay, isAvailable)
       VALUES ($make, $model, $year, $color, $pricePerDay, $isAvailable)`,
            [car.make, car.model, car.year, car.color, car.pricePerDay, car.isAvailable ? 1 : 0]
        );
    } catch (error) {
        console.error("Failed to add car:", error);
        throw error;
    }
}

export async function loadCars(): Promise<Car[]> {
    const db = await database;
    const result = await db.getAllAsync<Car>("SELECT * FROM cars");
    return result.map((car) => ({
        ...car,
        isAvailable: !!car.isAvailable, // convert 1/0 to boolean
    }));
}
