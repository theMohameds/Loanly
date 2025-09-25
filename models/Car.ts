import { User } from "./User";
import { Rating } from "./Rating";
import { Location } from "./Location";


export enum CarType{
  Sedan = "Sedan",
  SUV = "SUV",
  Pickup = "Pickup Truck",
  Minivan = "Minivan",
  Hatchback = "Hatchback"
}

export enum FuelType{
  Benzin = "Benzin",
  Diesel = "Diesel",
  Electric = "Electric",
  Hybrid = "Hybrid"
}


export default class Car {
  public id: number;
  private brand: string;
  private type: CarType;
  private model: string;
  private year: number;
  private regNumber: string;
  private fuelType: FuelType;
  private user: User;
  private pricePerDay: number;
  private userRating: Rating;
  private available: boolean;
  private location: Location;

  constructor(
    id: number,
    brand: string,
    type: CarType,
    model: string,
    year: number,
    regNumber: string,
    fuelType: FuelType,
    user: User,
    pricePerDay: number,
    userRating: Rating,
    available: boolean,
    location: Location,
    image?: string
  ) {
    this.id = id;
    this.brand = brand;
    this.type = type;
    this.model = model;
    this.year = year;
    this.regNumber = regNumber;
    this.fuelType = fuelType;
    this.user = user;
    this.pricePerDay = pricePerDay;
    this.userRating = userRating;
    this.available = available;
    this.location = location;
    // this.image = image;
  }

  /* bookCar(): void {
    if (!this.isAvailable) {
      throw new Error(`Car ${this.id} is already booked.`);
    }
    this.isAvailable = false;
  } */
}
