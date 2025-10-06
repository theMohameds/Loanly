import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
  ActivityIndicator,
  Image
} from "react-native";
import { database } from "../../backend/database/database";

export default function BookingsScreen({ navigation }: any) {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  useEffect(() => {
    async function loadBookings() {
      try {
        const db = await database;
        const rows = await db.getAllAsync(`
          SELECT b.id AS bookingId, b.start_datetime, b.end_datetime, b.total_price, 
                 b.pickupLocation, b.dropoffLocation,
                 c.id AS carId, c.make, c.model, c.trim, c.pricePerDay
          FROM bookings b
          JOIN cars c ON b.car_id = c.id
          ORDER BY b.start_datetime ASC
        `);
        setBookings(rows);
      } catch (err) {
        console.error("Failed to load bookings:", err);
      } finally {
        setLoading(false);
      }
    }
    loadBookings();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <ImageBackground
      source={require("../assets/background.png")}
      style={styles.background}
      imageStyle={styles.imageStyle}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.overlay}>
          <Text style={styles.header}>MY BOOKINGS</Text>

          {bookings.length === 0 ? (
            <Text style={styles.emptyText}>No bookings found.</Text>
          ) : (
            <FlatList
              data={bookings}
              keyExtractor={(item) => item.bookingId.toString()}
              contentContainerStyle={{ paddingBottom: 30 }}
              renderItem={({ item }) => {
                const carName = `${item.make} ${item.model} ${item.trim}`;
                return (
                  <TouchableOpacity
                    style={styles.card}
                    onPress={() => navigation.navigate("BookingDetails", { booking: item })}
                  >
                    <Image
                      source={require("../assets/placeholderimage.png")}
                      style={styles.image}
                    />
                    <View style={styles.info}>
                      <Text style={styles.car}>{carName}</Text>
                      <Text style={styles.price}>{item.pricePerDay} DKK/day</Text>
                      <Text style={styles.label}>
                        Pickup: {formatDate(item.start_datetime)}
                      </Text>
                      <Text style={styles.location}>{item.pickupLocation}</Text>
                      <Text style={styles.label}>
                        Dropoff: {formatDate(item.end_datetime)}
                      </Text>
                      <Text style={styles.location}>{item.dropoffLocation}</Text>
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
          )}
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  imageStyle: { resizeMode: "cover" },
  safeArea: { flex: 1, backgroundColor: "rgba(0,0,0,0.7)" },
  overlay: { flex: 1, padding: 16 },
  header: { fontSize: 26, fontWeight: "800", color: "#fff", textAlign: "center", marginBottom: 20 },
  card: {
    backgroundColor: "rgba(0,0,0,0.85)",
    borderRadius: 16,
    marginBottom: 18,
    overflow: "hidden",
    padding: 14,
  },
  image: { width: "100%", height: 160, borderRadius: 14, marginBottom: 8 },
  info: {},
  car: { color: "#fff", fontSize: 20, fontWeight: "800", marginBottom: 4 },
  price: { color: "#fff", fontSize: 16, fontWeight: "700", marginBottom: 4 },
  label: { color: "#bbb", fontSize: 14, marginTop: 4 },
  location: { color: "#2563EB", fontSize: 16, textDecorationLine: "underline", fontWeight: "600" },
  emptyText: { color: "#fff", textAlign: "center", marginTop: 50 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
});
