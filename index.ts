import { registerRootComponent } from "expo";
import App from "./App";
import { updateBookingStatuses } from "./backend/firebase/bookingsFirestore";

updateBookingStatuses()

registerRootComponent(App);
