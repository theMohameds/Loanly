import { Car } from "../types/Car";

const API_URL =
  "https://raw.githubusercontent.com/OthelloEngineer/mobile-software-development-exercises/refs/heads/main/cars.json";

export async function getCarsFromAPI(): Promise<Car[]> {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch cars: ${response.status}`);
    }
    const data = await response.json();
    return data as Car[];
  } catch (error) {
    console.error("Error fetching cars:", error);
    return [];
  }
}
