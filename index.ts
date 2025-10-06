import { registerRootComponent } from "expo";
import App from "./App";

import { getCarsFromFiles } from "./backend/services/api";
import { createCarsTable, saveCars, clearCars, dropTableCar } from "./backend/database/carsDB";
import { createUsersTable, createDefaultUser } from "./backend/database/userDB";
import { createBookingsTable, dropTableBooking } from "./backend/database/bookingsDB";

async function initDatabase() {
  try {
    // Users
    await createUsersTable();
    await createDefaultUser();

    // Bookings
    await dropTableBooking();       // Drop every time to reset
    await createBookingsTable();    // Recreate table with pickup/dropoff columns

    // Cars
    await dropTableCar();
    await createCarsTable();
    await clearCars();
    const cars = await getCarsFromFiles();
    await saveCars(cars);

    console.log("Database initialized successfully!");
  } catch (err) {
    console.error("Failed to initialize database:", err);
  }
}

// Initialize DB first, then start the app
initDatabase();
registerRootComponent(App);
