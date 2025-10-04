import { registerRootComponent } from 'expo';
import App from './App';

import { getCarsFromAPI } from './services/api';
import { createCarsTable, saveCars, clearCars, loadCars } from './services/carsDB';

async function initDummyData() {
  try {
    await createCarsTable();     
    await clearCars();           
    const cars = await getCarsFromAPI();   
    await saveCars(cars);         
    
    //const storedCars = await loadCars();
    //console.log("Cars in DB:", storedCars);
  } catch (error) {
    console.error("Failed to init cars:", error);
  }
}


initDummyData();
registerRootComponent(App);
