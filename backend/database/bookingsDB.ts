import { database } from "./database";
import { Booking } from "../types/Booking";

export async function createBookingsTable() {
  const db = await database;
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      car_id INTEGER NOT NULL,
      start_datetime TEXT NOT NULL,
      end_datetime TEXT NOT NULL,
      total_price REAL NOT NULL,
      pickupLocation TEXT NOT NULL,
      dropoffLocation TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users (id),
      FOREIGN KEY (car_id) REFERENCES cars (id)
    );
  `);
}

export async function dropTableBooking() {
  const db = await database;
  await db.execAsync(`DROP TABLE IF EXISTS bookings;`);
}

export async function clearBookings() {
  const db = await database;
  await db.execAsync("DELETE FROM bookings");
}

export async function addBooking(booking: Omit<Booking, "id">) {
  const db = await database;
  await db.runAsync(
    `INSERT INTO bookings (user_id, car_id, start_datetime, end_datetime, total_price, pickupLocation, dropoffLocation)
     VALUES ($user_id, $car_id, $start, $end, $total, $pickup, $dropoff)`,
    {
      $user_id: booking.user_id,
      $car_id: booking.car_id,
      $start: booking.start_datetime,
      $end: booking.end_datetime,
      $total: booking.total_price,
      $pickup: booking.pickupLocation,
      $dropoff: booking.dropoffLocation,
    }
  );
}

export async function getAllBookings() {
  const db = await database;
  return db.getAllAsync(`
    SELECT b.id AS bookingId, b.start_datetime, b.end_datetime, b.total_price, 
           b.pickupLocation, b.dropoffLocation,
           c.id AS carId, c.make, c.model, c.trim, c.pricePerDay
    FROM bookings b
    JOIN cars c ON b.car_id = c.id
    ORDER BY b.start_datetime ASC
  `);
}
