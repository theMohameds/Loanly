import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  SafeAreaView,
  Alert,
  Platform,
  Linking,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { getBookingById, cancelBooking, deleteBooking } from "../../backend/firebase/bookingsFirestore";
import { getCarWithOwnerName } from "../../backend/firebase/firestoreUser";
import { CarData } from "../../backend/firebase/carFirestore";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const carImages = [
  require("../assets/audi-etron-gt.png"),
  require("../assets/ford-transit.png"),
  require("../assets/polestar-2.png"),
  require("../assets/tesla3.png"),
  require("../assets/test.png"),
  require("../assets/placeholderimage.png"),
];

type UIStatus = "Upcoming" | "Ongoing" | "Done" | "Cancelled";

const getBookingUIStatus = (firestoreStatus: "pending" | "cancelled", start: string, end: string): UIStatus => {
  if (firestoreStatus === "cancelled") return "Cancelled";
  const now = Date.now();
  const startTime = new Date(start).getTime();
  const endTime = new Date(end).getTime();
  if (now < startTime) return "Upcoming";
  if (now > endTime) return "Done";
  return "Ongoing";
};

const getStatusColor = (status: UIStatus) => {
  switch (status) {
    case "Upcoming": return "#3B82F6";
    case "Ongoing": return "#10B981";
    case "Done": return "#6B7280";
    case "Cancelled": return "#DC2626";
    default: return "#999";
  }
};

export default function BookingDetailsScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { bookingId } = route.params;

  const [booking, setBooking] = useState<any | null>(null);
  const [car, setCar] = useState<(CarData & { ownerName?: string }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  const colors = {
    background: "#1a1a1a",
    textPrimary: "#FFFFFF",
    textSecondary: "#C0C0C0",
    card: "#242424",
    separator: "#3A3A3A",
    button: "#DC2626",
  };

  useEffect(() => {
    const load = async () => {
      try {
        const bookingData = await getBookingById(bookingId);
        setBooking(bookingData);
        const carData = await getCarWithOwnerName(bookingData.carId);
        setCar(carData);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [bookingId]);

  useEffect(() => {
    if (!booking) return;
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => handleDelete(booking, bookingId)}>
          <Ionicons name="trash" size={20} color="#fff" />
        </TouchableOpacity>
      ),
    });
  }, [booking, bookingId]);

  const handleDelete = (booking: any, bookingId: string) => {
    const isDoneOrCancelled =
      booking.status === "cancelled" ||
      getBookingUIStatus(booking.status, booking.startDate, booking.endDate) === "Done";

    const message = isDoneOrCancelled
      ? "Are you sure you want to delete this booking permanently?"
      : "This booking is active. Deleting it will cancel the ride. Are you sure?";

    Alert.alert("Delete booking", message, [
      { text: "No", style: "cancel" },
      {
        text: "Yes, delete",
        style: "destructive",
        onPress: async () => {
          try {
            if (!isDoneOrCancelled && booking.status !== "cancelled") {
              await cancelBooking(bookingId);
            }
            await deleteBooking(bookingId);
            Alert.alert("Deleted", "Booking deleted successfully");
            navigation.goBack();
          } catch (error) {
            console.error("Failed to delete booking", error);
            Alert.alert("Error", "Failed to delete booking. Please try again.");
          }
        },
      },
    ]);
  };

  if (loading) return <ActivityIndicator size="large" style={styles.centered} />;
  if (!booking || !car) return <Text style={styles.centered}>Booking not found</Text>;

  const formatDateTime = (iso: string) => {
    const d = new Date(iso);
    return `${String(d.getDate()).padStart(2,"0")}/${String(d.getMonth()+1).padStart(2,"0")}/${d.getFullYear()} ${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
  };

  const displayFields: { key: keyof CarData | "ownerName"; label: string }[] = [
    { key: "make", label: "Make" },
    { key: "model", label: "Model" },
    { key: "trim", label: "Trim" },
    { key: "carType", label: "Type" },
    { key: "fuelType", label: "Fuel Type" },
    { key: "year", label: "Year" },
    { key: "seats", label: "Seats" },
    { key: "ownerName", label: "Owner" },
  ];

  const handleCancel = () => {
    Alert.alert("Cancel booking", "Are you sure you want to cancel this booking?", [
      { text: "No", style: "cancel" },
      {
        text: "Yes, cancel",
        style: "destructive",
        onPress: async () => {
          await cancelBooking(bookingId);
          setBooking({ ...booking, status: "cancelled" });
        },
      },
    ]);
  };

  const uiStatus = getBookingUIStatus(booking.status, booking.startDate, booking.endDate);

  const openMap = (address: string) => {
    const url = Platform.select({
      ios: `maps:0,0?q=${encodeURIComponent(address)}`,
      android: `geo:0,0?q=${encodeURIComponent(address)}`,
    });
    if (url) Linking.openURL(url).catch(err => console.error(err));
  };

  const pickupLocation = booking.pickupLocation ?? car.pickupLocation;
  const dropoffLocation = booking.dropoffLocation ?? car.dropoffLocation;

  return (
    <SafeAreaView style={[styles.background, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        {/* Image Carousel */}
        <View style={styles.carouselContainer}>
          <FlatList
            data={carImages}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={ev =>
              setActiveImage(Math.round(ev.nativeEvent.contentOffset.x / width))
            }
            keyExtractor={(_, i) => i.toString()}
            renderItem={({ item }) => <Image source={item} style={styles.heroImage} />}
          />
          <View style={styles.dotsContainer}>
            {carImages.map((_, i) => (
              <View key={i} style={[styles.dot, { opacity: i === activeImage ? 1 : 0.3 }]} />
            ))}
          </View>
        </View>

        {/* Car Info */}
        <View style={[styles.carInfoContainer, { backgroundColor: colors.card }]}>
          <Text style={[styles.header, { color: colors.textPrimary }]}>{car.make} {car.model}</Text>
          {displayFields.map(({ key, label }) =>
            car[key] ? (
              <View key={key} style={styles.infoRow}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
                <Text style={[styles.value, { color: colors.textPrimary }]}>{car[key]?.toString()}</Text>
              </View>
            ) : null
          )}
        </View>

        {/* Booking Info */}
        <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Booking details</Text>
          <View style={[styles.separator, { backgroundColor: colors.separator }]} />

          <View style={styles.infoRow}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Pickup</Text>
            <TouchableOpacity onPress={() => pickupLocation && openMap(pickupLocation)}>
              <Text style={[styles.value, { color: "#3B82F6", textDecorationLine: "underline" }]}>{pickupLocation ?? "Unknown"}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.infoRow}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Dropoff</Text>
            <TouchableOpacity onPress={() => dropoffLocation && openMap(dropoffLocation)}>
              <Text style={[styles.value, { color: "#3B82F6", textDecorationLine: "underline" }]}>{dropoffLocation ?? "Unknown"}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.infoRow}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Start</Text>
            <Text style={[styles.value, { color: colors.textPrimary }]}>{formatDateTime(booking.startDate)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>End</Text>
            <Text style={[styles.value, { color: colors.textPrimary }]}>{formatDateTime(booking.endDate)}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Total</Text>
            <Text style={[styles.totalValue, { color: colors.textPrimary }]}>€{booking.totalPrice}</Text>
          </View>

          <View style={[styles.infoRow, { marginTop: 6 }]}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Status</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(uiStatus) }]}>
              <Text style={styles.statusText}>{uiStatus}</Text>
            </View>
          </View>
        </View>

        {/* Cancel Button */}
        {booking.status !== "cancelled" && uiStatus !== "Done" && (
          <TouchableOpacity style={[styles.bookButton, { backgroundColor: "#d43131ff" }]} onPress={handleCancel}>
            <Text style={styles.bookText}>Cancel booking</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },

  carouselContainer: { width: "100%", height: 250 },
  heroImage: { width, height: 250 },
  dotsContainer: { position: "absolute", bottom: 10, flexDirection: "row", alignSelf: "center" },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#fff", marginHorizontal: 4 },

  carInfoContainer: { margin: 16, borderRadius: 14, padding: 16 },
  header: { fontSize: 28, fontWeight: "800", marginBottom: 16 },
  infoCard: { borderRadius: 16, padding: 16, marginTop: 16, marginHorizontal: 16 },
  sectionTitle: { fontSize: 18, fontWeight: "700", marginBottom: 8 },
  infoRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginVertical: 6 },
  label: { fontSize: 14 },
  value: { fontSize: 15, fontWeight: "600" },
  totalValue: { fontSize: 17, fontWeight: "700" },
  statusBadge: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 12 },
  statusText: { color: "#fff", fontWeight: "600", fontSize: 12 },
  separator: { height: 1, marginVertical: 12 },

  bookButton: { paddingVertical: 16, borderRadius: 50, alignItems: "center", marginHorizontal: 32, marginTop: 20, shadowColor: "#000", shadowOffset: { width:0, height:3 }, shadowOpacity:0.3, shadowRadius:5, elevation:5 },
  bookText: { color: "#fff", fontSize: 18, fontWeight: "700" },
});
