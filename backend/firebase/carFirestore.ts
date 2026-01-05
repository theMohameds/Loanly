import { getFirestore, doc, getDoc, collection, getDocs, addDoc, query, where, QueryDocumentSnapshot, orderBy, limit, startAfter } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import app from "../../firebaseConfig";
import { BookingData } from "./bookingsFirestore";

export interface CarData {
  make: string;
  model: string;
  trim: string;
  carType: string;
  fuelType: string;
  year: number;
  seats: number;
  pricePerDay: number;
  pickupLocation: string;
  dropoffLocation: string;
  ownerId?: string;
  rating?: number;
  ownerName?: string;
  nameLower?: string;
  bookedDates?: { start: string; end: string }[];
}

const db = getFirestore(app);

export const addCar = async (car: CarData) => {
  const auth = getAuth(app);
  const user = auth.currentUser;

  if (!user) throw new Error("User not logged in");

  const carRef = collection(db, "cars");
  const newCar = {
    ...car,
    ownerId: user.uid
  };

  const docRef = await addDoc(carRef, newCar);
  return docRef.id;
};


export interface PaginatedCars {
  cars: (CarData & { id: string })[];
  lastDoc?: QueryDocumentSnapshot;
}

export const getCarsByRating = async (
  pageSize: number = 5,
  startAfterDoc?: QueryDocumentSnapshot
): Promise<PaginatedCars> => {
  const carsCol = collection(db, "cars");

  let q;
  if (startAfterDoc) {
    q = query(carsCol, orderBy("rating", "desc"), startAfter(startAfterDoc), limit(pageSize));
  } else {
    q = query(carsCol, orderBy("rating", "desc"), limit(pageSize));
  }

  const snapshot = await getDocs(q);

  const cars = snapshot.docs.map(docSnap => ({
    id: docSnap.id,
    ...(docSnap.data() as CarData),
  }));
  const lastDoc = snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : undefined;

  return { cars, lastDoc };
};



export const getCarById = async (carId: string): Promise<CarData & { id: string } | null> => {
  try {
    const docRef = doc(db, "cars", carId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...(docSnap.data() as CarData) };
    } else {
      console.warn(`Car with ID ${carId} not found`);
      return null;
    }
  } catch (err) {
    console.error("Error fetching car:", err);
    return null;
  }
};

export const getAvailableCars = async (
  pickupDate: string,
  dropoffDate: string
): Promise<(CarData & { id: string })[]> => {
  const carsCol = collection(db, "cars");
  const bookingsCol = collection(db, "bookings");

  const carsSnapshot = await getDocs(carsCol);
  const allCars = carsSnapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as CarData) }));

  const bookingsQuery = query(
    bookingsCol,
    where("startDate", "<=", dropoffDate),
    where("endDate", ">=", pickupDate)
  );
  const bookingsSnapshot = await getDocs(bookingsQuery);

  const bookedCarIds = bookingsSnapshot.docs
    .map(docSnap => docSnap.data() as BookingData)
    .filter(booking => booking.status !== "cancelled" && booking.status !== "done")
    .map(booking => booking.carId);

  const availableCars = allCars.filter(car => !bookedCarIds.includes(car.id));

  return availableCars;
};


export const getCarWithOwnerName = async (carId: string): Promise<CarData & { id: string }> => {
  const car = await getCarById(carId);
  if (!car) throw new Error(`Car with ID ${carId} not found`);

  if (!car.ownerId) return car;

  const userDoc = await getDoc(doc(db, "users", car.ownerId));
  const ownerName = userDoc.exists()
    ? (userDoc.data() as { displayName?: string }).displayName ?? "Unknown"
    : "Unknown";

  return { ...car, ownerName };
};