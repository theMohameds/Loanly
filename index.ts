import { registerRootComponent } from "expo";
import App from "./App";

import { getCarsFromFiles } from "./backend/services/api";
import { createCarsTable, saveCars, getCarsCount } from "./backend/database/carsDB";
import { createUsersTable, createDefaultUser } from "./backend/database/userDB";
import { createBookingsTable } from "./backend/database/bookingsDB";

async function initDatabase() {
  try {
    await createUsersTable();
    await createDefaultUser();
    
    await createBookingsTable();
    await createCarsTable();

    const carsCount = await getCarsCount();
    if (carsCount === 0) {
      const cars = await getCarsFromFiles();
      await saveCars(cars);
      //console.log("Cars loaded from files into database.");
    } else {
      //console.log("Cars already exist in database, skipping API call.");
    }
  } catch (err) {
    console.error("Failed to initialize database:", err);
  }
}

initDatabase();
registerRootComponent(App);
