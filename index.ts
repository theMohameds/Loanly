import { registerRootComponent } from "expo";
import App from "./App";

import { getCarsFromFiles } from "./backend/services/api";
import { createCarsTable, saveCars, clearCars, dropTableCar } from "./backend/database/carsDB";
import { createUsersTable, createDefaultUser } from "./backend/database/userDB";
import { createBookingsTable, dropTableBooking } from "./backend/database/bookingsDB";

async function initDatabase() {
  try {

    await createUsersTable();
    await createDefaultUser();

    await dropTableBooking();       
    await createBookingsTable();   

    await dropTableCar();
    await createCarsTable();
    await clearCars();
    const cars = await getCarsFromFiles();
    await saveCars(cars);

    //console.log("Database initialized successfully!");
  } catch (err) {
    console.error("Failed to initialize database:", err);
  }
}

// Initialize DB first, then start the app
initDatabase();
registerRootComponent(App);
