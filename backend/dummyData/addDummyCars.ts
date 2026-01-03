import { addCar, CarData } from '../firebase/carFirestore';

const dummyCars: CarData[] = [
    { make: 'Audi', model: 'A4', trim: 'Premium', carType: 'Sedan', fuelType: 'Gasoline', year: 2020, seats: 5, pricePerDay: 80, pickupLocation: 'Odense Center', dropoffLocation: 'Odense Center', rating: 4.5 },
    { make: 'Tesla', model: 'Model 3', trim: 'Long Range', carType: 'Sedan', fuelType: 'Electric', year: 2023, seats: 5, pricePerDay: 120, pickupLocation: 'Odense Airport', dropoffLocation: 'Odense Airport', rating: 4.9 },
    { make: 'BMW', model: 'X5', trim: 'M Sport', carType: 'SUV', fuelType: 'Hybrid', year: 2021, seats: 5, pricePerDay: 100, pickupLocation: 'Odense Center', dropoffLocation: 'Odense Center', rating: 4.7 },
    { make: 'Mercedes', model: 'C-Class', trim: 'AMG Line', carType: 'Sedan', fuelType: 'Gasoline', year: 2020, seats: 5, pricePerDay: 90, pickupLocation: 'Odense Station', dropoffLocation: 'Odense Station', rating: 4.3 },
    { make: 'Volkswagen', model: 'Golf', trim: 'GTI', carType: 'Hatchback', fuelType: 'Gasoline', year: 2019, seats: 5, pricePerDay: 60, pickupLocation: 'Odense Airport', dropoffLocation: 'Odense Airport', rating: 4.1 },
    { make: 'Ford', model: 'Mustang', trim: 'GT', carType: 'Coupe', fuelType: 'Gasoline', year: 2022, seats: 4, pricePerDay: 110, pickupLocation: 'Odense Center', dropoffLocation: 'Odense Center', rating: 4.6 },
    { make: 'Toyota', model: 'Corolla', trim: 'LE', carType: 'Sedan', fuelType: 'Hybrid', year: 2021, seats: 5, pricePerDay: 70, pickupLocation: 'Odense Station', dropoffLocation: 'Odense Station', rating: 4.2 },
    { make: 'Honda', model: 'Civic', trim: 'Sport', carType: 'Sedan', fuelType: 'Gasoline', year: 2020, seats: 5, pricePerDay: 65, pickupLocation: 'Odense Airport', dropoffLocation: 'Odense Airport', rating: 4.0 },
    { make: 'Chevrolet', model: 'Camaro', trim: 'SS', carType: 'Coupe', fuelType: 'Gasoline', year: 2022, seats: 4, pricePerDay: 115, pickupLocation: 'Odense Center', dropoffLocation: 'Odense Center', rating: 4.4 },
    { make: 'Nissan', model: 'Leaf', trim: 'SV', carType: 'Hatchback', fuelType: 'Electric', year: 2023, seats: 5, pricePerDay: 85, pickupLocation: 'Odense Airport', dropoffLocation: 'Odense Airport', rating: 4.8 },
];

export const addDummyCars = async () => {
    try {
        for (const car of dummyCars) {
            const id = await addCar(car);
            console.log(`Added car ${car.make} ${car.model} with ID: ${id}`);
        }
        console.log('All 10 dummy cars added successfully!');
    } catch (err) {
        console.error('Error adding dummy cars:', err);
    }
};
