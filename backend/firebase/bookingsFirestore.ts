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
import app from "../../firebaseConfig";

const db = getFirestore(app);

export interface BookingData {
  carId: string;
  userId: string;
  ownerId?: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: "pending" | "confirmed" | "cancelled" | "upcoming" | "ongoing" | "done";
  createdAt: number;
}


// update, we broke 
export const updateBookingStatuses = async () => {
  const bookingsCol = collection(db, "bookings");
  const snapshot = await getDocs(bookingsCol);
  const now = new Date();

  for (const docSnap of snapshot.docs) {
    const data = docSnap.data() as BookingData;
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    let newStatus: BookingData["status"] = data.status;

    if (data.status === "cancelled") continue;
    if (now < start) newStatus = "upcoming";
    else if (now >= start && now <= end) newStatus = "ongoing";
    else if (now > end) newStatus = "done";

    if (newStatus !== data.status) {
      await updateDoc(doc(db, "bookings", docSnap.id), { status: newStatus });
    }
  }
};

export const createBooking = async (
  booking: Omit<BookingData, "userId" | "createdAt" | "status">
) => {
  const auth = getAuth(app);
  const user = auth.currentUser;
  if (!user) throw new Error("User not logged in");

  const now = new Date();
  const start = new Date(booking.startDate);
  const end = new Date(booking.endDate);

  let status: BookingData["status"] = "pending";
  if (now < start) status = "upcoming";
  else if (now >= start && now <= end) status = "ongoing";
  else if (now > end) status = "done";

  const bookingData: BookingData = {
    ...booking,
    userId: user.uid,
    status,
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
