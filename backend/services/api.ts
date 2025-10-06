import carsData from "../dummyData/dummyCars.json";
import { Car } from "../types/Car"; 

export async function getCarsFromFiles(): Promise<Car[]> {
  try {
    return carsData as Car[];
  } catch (error) {
    console.error("Error loading local cars:", error);
    return [];
  }
}

