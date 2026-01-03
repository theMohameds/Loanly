import { getFirestore, doc, setDoc, getDoc, collection, getDocs, addDoc, query, where, QueryDocumentSnapshot, orderBy, limit, startAfter } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import app from "../../firebaseConfig";

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

export const getAllCars = async (): Promise<(CarData & { id: string })[]> => {
  const carsCol = collection(db, "cars");
  const snapshot = await getDocs(carsCol);
  return snapshot.docs.map(docSnap => ({ id: docSnap.id, ...(docSnap.data() as CarData) }));
};

export const getMyCars = async (): Promise<(CarData & { id: string })[]> => {
  const auth = getAuth(app);
  const user = auth.currentUser;
  if (!user) throw new Error("User not logged in");

  const carsCol = collection(db, "cars");
  const q = query(carsCol, where("ownerId", "==", user.uid));
  const snapshot = await getDocs(q);

  return snapshot.docs.map(docSnap => ({ id: docSnap.id, ...(docSnap.data() as CarData) }));
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

  let q = query(carsCol, orderBy("rating", "desc"), limit(pageSize));

  if (startAfterDoc) {
    q = query(carsCol, orderBy("rating", "desc"), startAfter(startAfterDoc), limit(pageSize));
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

interface CarQueryOptions {
    searchText?: string;
    filters?: {
        minRating?: number;
        priceRange?: [number, number];
        seatRange?: [number, number];
        selectedBrands?: string[];
        selectedFuel?: string[];
        location?: string;
    };
    pageSize?: number;
    startAfterDoc?: QueryDocumentSnapshot | null;
}


interface SearchParams {
    searchText?: string;
    location?: string;
    priceRange?: [number, number];
    seatRange?: [number, number];
    minRating?: number;
    selectedBrands?: string[];
    selectedFuel?: string[];
    pageSize?: number;
    startAfterDoc?: any;
}

export async function searchCarsInFirestore(params: SearchParams) {
    const carsRef = collection(db, "cars");
    let q: any = query(carsRef, orderBy("rating", "desc"), limit(params.pageSize || 5));

    if (params.startAfterDoc) {
        q = query(q, startAfter(params.startAfterDoc));
    }

    if (params.minRating) q = query(q, where("rating", ">=", params.minRating));
    if (params.priceRange) q = query(q, where("pricePerDay", ">=", params.priceRange[0]), where("pricePerDay", "<=", params.priceRange[1]));
    if (params.seatRange) q = query(q, where("seats", ">=", params.seatRange[0]), where("seats", "<=", params.seatRange[1]));
    if (params.selectedBrands && params.selectedBrands.length) q = query(q, where("carType", "in", params.selectedBrands));
    if (params.selectedFuel && params.selectedFuel.length) q = query(q, where("fuelType", "in", params.selectedFuel));

    // Firestore does not support "contains text" queries, so we filter text client-side
    const snapshot = await getDocs(q);
    let cars: (CarData & { id: string })[] = snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as CarData) }));

    if (params.searchText) {
        const searchLower = params.searchText.toLowerCase();
        cars = cars.filter(car => (`${car.make} ${car.model}`).toLowerCase().includes(searchLower));
    }

    if (params.location && params.location.toLowerCase() !== "anywhere") {
        const locLower = params.location.toLowerCase();
        cars = cars.filter(car => car.pickupLocation?.toLowerCase().includes(locLower));
    }

    const lastDoc = snapshot.docs[snapshot.docs.length - 1] || null;
    return { cars, lastDoc };
}
