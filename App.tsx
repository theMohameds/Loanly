import React, { useEffect, useState } from "react";
import { StyleSheet, View, Button } from "react-native";
import { StatusBar } from "expo-status-bar";
import { getCarsFromAPI } from "./services/api";
import { initDB, clearCars, saveCars, loadCars } from "./services/database";
import CarList from "./components/CarList";
import { Car } from "./types/Car";

export default function App() {
  const [cars, setCars] = useState<Car[]>([]);

  useEffect(() => {
    const setup = async () => {
      await initDB();
      const storedCars = await loadCars();
      console.log("Initial cars from DB:", storedCars);
      setCars(storedCars);
    };
    setup();
  }, []);

  const fetchAndSave = async () => {
    console.log("Fetching cars from API...");
    const data = await getCarsFromAPI();
    console.log("Fetched data:", data);

    await clearCars();
    console.log("Cleared old cars.");

    await saveCars(data);
    console.log("Saved new cars.");

    const storedCars = await loadCars();
    console.log("Cars from DB:", storedCars);

    setCars(storedCars);
  };

  return (
    <View style={styles.container}>
      <Button title="Fetch & Save Cars" onPress={fetchAndSave} />
      <CarList cars={cars} />
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
