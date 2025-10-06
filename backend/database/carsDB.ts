import { database } from "./database";
import { Car } from "../types/Car";

export async function createCarsTable() {
    const db = await database;
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS cars (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            make TEXT NOT NULL,
            model TEXT NOT NULL,
            trim TEXT NOT NULL,
            carType TEXT NOT NULL,
            fuelType TEXT NOT NULL,
            year INTEGER NOT NULL,
            seats INTEGER NOT NULL,
            pricePerDay REAL NOT NULL,
            pickupLocation TEXT NOT NULL,
            dropoffLocation TEXT NOT NULL
        );
    `);
}

export async function dropTableCar() {
    const db = await database;
    await db.execAsync("DROP TABLE IF EXISTS cars;");
}

export async function clearCars() {
    const db = await database;
    await db.execAsync("DELETE FROM cars");
}

// Save multiple cars
export async function saveCars(cars: Car[]) {
    const db = await database;

    return await db.withExclusiveTransactionAsync(async () => {
        const statement = await db.prepareAsync(
            `INSERT INTO cars 
             (make, model, trim, carType, fuelType, year, seats, pricePerDay, pickupLocation, dropoffLocation)
             VALUES 
             ($make, $model, $trim, $carType, $fuelType, $year, $seats, $pricePerDay, $pickupLocation, $dropoffLocation)`
        );

        try {
            for (const car of cars) {
                if (!car.pickupLocation || !car.dropoffLocation) 
                    throw new Error(`Car ${car.make} ${car.model} is missing pickup or dropoff location`);
                await statement.executeAsync({
                    $make: car.make,
                    $model: car.model,
                    $trim: car.trim,
                    $carType: car.carType,
                    $fuelType: car.fuelType,
                    $year: car.year,
                    $seats: car.seats,
                    $pricePerDay: car.pricePerDay,
                    $pickupLocation: car.pickupLocation,
                    $dropoffLocation: car.dropoffLocation,
                });
            }
        } finally {
            await statement.finalizeAsync();
        }
    });
}

// Add a single car
export async function addCar(car: Car) {
    if (!car.pickupLocation || !car.dropoffLocation)
        throw new Error("Car must have pickup and dropoff locations");

    const db = await database;
    try {
        await db.runAsync(
            `INSERT INTO cars 
             (make, model, trim, carType, fuelType, year, seats, pricePerDay, pickupLocation, dropoffLocation)
             VALUES 
             ($make, $model, $trim, $carType, $fuelType, $year, $seats, $pricePerDay, $pickupLocation, $dropoffLocation)`,
            [
                car.make,
                car.model,
                car.trim,
                car.carType,
                car.fuelType,
                car.year,
                car.seats,
                car.pricePerDay,
                car.pickupLocation,
                car.dropoffLocation
            ]
        );
    } catch (error) {
        console.error("Failed to add car:", error);
        throw error;
    }
}

// Load all cars
export async function loadCars(): Promise<Car[]> {
    const db = await database;
    const result = await db.getAllAsync<Car>(
        "SELECT * FROM cars"
    );
    return result;
}


export async function getCarById(id: number): Promise<Car | null> {
  const db = await database;
  const rows = await db.getAllSync<Car>(
    `SELECT * FROM cars WHERE id = $id`,
    { $id: id }
  );

  if (!rows || rows.length === 0) return null;

  const row = rows[0]; 
  return {
    make: row.make,
    model: row.model,
    trim: row.trim,
    carType: row.carType,
    fuelType: row.fuelType,
    year: row.year,
    seats: row.seats,
    pricePerDay: row.pricePerDay,
    pickupLocation: row.pickupLocation,
    dropoffLocation: row.dropoffLocation,
  };
}


