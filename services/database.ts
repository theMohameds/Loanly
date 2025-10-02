import * as SQLite from "expo-sqlite";

export const database = SQLite.openDatabaseAsync("cars.db");
