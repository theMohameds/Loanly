export default class Car {
  id: number;
  make: string;
  model: string;
  year: number;
  mileage: number;
  price: number;
  isAvailable: boolean;

  constructor(
    id: number,
    make: string,
    model: string,
    year: number,
    mileage: number,
    price: number,
    isAvailable: boolean
  ) {
    this.id = id;
    this.make = make;
    this.model = model;
    this.year = year;
    this.mileage = mileage;
    this.price = price;
    this.isAvailable = isAvailable;
  }

  bookCar(): void {
    if (!this.isAvailable) {
      throw new Error(`Car ${this.id} is already booked.`);
    }
    this.isAvailable = false;
  }
}
