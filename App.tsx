import React, { useEffect, useState } from "react";
import { StyleSheet, View, Button, Alert } from "react-native";
import { StatusBar } from "expo-status-bar";
import { getCarsFromAPI } from "./services/api";
import {
  createCarsTable,
  dropTableCar,
  clearCars,
  loadCars,
  addCar,
} from "./services/carsDB";
import CarList from "./components/CarList";
import AddCarForm from "./components/AddCarForm";
import { Car } from "./types/Car";

export default function App() {
  const [cars, setCars] = useState<Car[]>([]);

  // Load DB on startup
  useEffect(() => {
    const setup = async () => {
      await dropTableCar(); // optional: removes old data
      await createCarsTable(); // ensure table handleAddCar 
      const storedCars = await loadCars();
      console.log("Initial cars from DB:", storedCars);
      setCars(storedCars);
    };
    setup();
  }, []);

  // Fetch cars from API and merge with existing DB entries
  const fetchAndSave = async () => {
    const data = await getCarsFromAPI();
    const existingCars = await loadCars();
    const existingIds = new Set(existingCars.map((c) => c.id));

    // Only add new cars that aren't already in DB
    for (const car of data) {
      if (!existingIds.has(car.id)) {
        await addCar(car);
      }
    }

    const updatedCars = await loadCars();
    setCars(updatedCars);
    Alert.alert("Fetched and saved cars from API!");
  };

  // Handle adding a single car from form
  const handleAddCar = (newCar: Car) => {
    setCars((prevCars) => [...prevCars, newCar]); // just update state
    Alert.alert("Car added!");
  };

  // Handle clearing the DB
  const handleClearCars = async () => {
    await clearCars();
    setCars([]);
    Alert.alert("All cars cleared from DB!");
  };

  return (
    <View style={styles.container}>
      <Button title="Fetch & Save Cars" onPress={fetchAndSave} />

      <Button
        title="Print DB Cars to Console"
        onPress={async () => {
          const storedCars = await loadCars();
          console.log("Cars currently in DB:", storedCars);
          Alert.alert(`Check console! ${storedCars.length} cars loaded.`);
        }}
      />

      <Button title="Clear All Cars" onPress={handleClearCars} color="red" />

      <AddCarForm onCarAdded={handleAddCar} />

      <View style={{ flex: 1, marginTop: 20 }}>
        <CarList cars={cars} />
      </View>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 50,
    paddingHorizontal: 20,
  },
});
