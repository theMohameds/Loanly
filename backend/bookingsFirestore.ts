import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import app from "../firebaseConfig";

const db = getFirestore(app);

export interface BookingData {
  carId: string;
  userId: string;
  ownerId?: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: number;
}

export const createBooking = async (
  booking: Omit<BookingData, "userId" | "createdAt" | "status">
) => {
  const auth = getAuth(app);
  const user = auth.currentUser;
  if (!user) throw new Error("User not logged in");

  const bookingData: BookingData = {
    ...booking,
    userId: user.uid,
    status: "pending",
    createdAt: Date.now(),
  };

  const docRef = await addDoc(collection(db, "bookings"), bookingData);
  return docRef.id;
};


export const getMyBookings = async () => {
  const auth = getAuth(app);
  const user = auth.currentUser;
  if (!user) throw new Error("Not logged in");

  const q = query(collection(db, "bookings"), where("userId", "==", user.uid));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((docSnap) => ({
    bookingId: docSnap.id,
    ...(docSnap.data() as BookingData),
  }));
};

export const getBookingById = async (bookingId: string) => {
  const docRef = doc(db, "bookings", bookingId);
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) {
    throw new Error("Booking not found");
  }

  return {
    bookingId: snapshot.id,
    ...(snapshot.data() as BookingData),
  };
};

export const cancelBooking = async (bookingId: string) => {
  const ref = doc(db, "bookings", bookingId);
  await updateDoc(ref, { status: "cancelled" });
};

export const deleteBooking = async (bookingId: string) => {
  const ref = doc(db, "bookings", bookingId);
  await deleteDoc(ref);
};
