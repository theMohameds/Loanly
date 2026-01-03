import { getFirestore, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import app from "../../firebaseConfig";
import { CarData } from "./carFirestore";
const db = getFirestore(app);

export interface UserProfileData {
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    address: string;
}

export const getUserProfile = async (uid: string): Promise<UserProfileData | null> => {
    try {
        const docRef = doc(db, "user", uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data() as UserProfileData;
        } else {
            console.log("No such document!");
            return null;
        }
    } catch (error) {
        console.error("Error fetching user profile:", error);
        return null;
    }
};

export const setUserProfile = async (uid: string, data: UserProfileData) => {
    try {
        const docRef = doc(db, "user", uid);
        await setDoc(docRef, data, { merge: true });
        console.log("User profile set successfully");
    } catch (error) {
        console.error("Error setting user profile:", error);
    }
};


export const updateUserProfile = async (uid: string, data: Partial<UserProfileData>) => {
    try {
        const docRef = doc(db, "user", uid);
        await updateDoc(docRef, data);
        console.log("User profile updated successfully");
    } catch (error) {
        console.error("Error updating user profile:", error);
    }
};


export const getCarWithOwnerName = async (
  carId: string
): Promise<(CarData & { id: string; ownerName?: string }) | null> => {
  try {
    const carDocRef = doc(db, "cars", carId);
    const carSnap = await getDoc(carDocRef);

    if (!carSnap.exists()) {
      console.error(`Car document not found: cars/${carId}`);
      return null;
    }

    const car = { id: carSnap.id, ...(carSnap.data() as CarData) };

    if (car.ownerId) {
      const userDocRef = doc(db, "user", car.ownerId);
      try {
        const userSnap = await getDoc(userDocRef);
        if (userSnap.exists()) {
          car.ownerName = userSnap.data().firstName + " " + userSnap.data().lastName;
        } else {
          console.warn(`Owner document not found: user/${car.ownerId}`);
          car.ownerName = "Unknown";
        }
      } catch (ownerErr: unknown) {
        if (ownerErr instanceof Error) {
          console.error(
            `Error fetching owner user/${car.ownerId}:`,
            ownerErr.name,
            ownerErr.message
          );
        } else {
          console.error(`Unknown error fetching owner user/${car.ownerId}:`, ownerErr);
        }
        car.ownerName = "Unknown";
      }
    }

    delete car.ownerId;
    return car;

  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(`Error fetching car document cars/${carId}:`, err.name, err.message);
    } else {
      console.error(`Unknown error fetching car document cars/${carId}:`, err);
    }
    return null;
  }
};
