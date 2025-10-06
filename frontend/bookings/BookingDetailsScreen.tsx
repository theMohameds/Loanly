import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
  Linking,
  Platform,
  Image
} from "react-native";

export default function BookingDetailsScreen({ route, navigation }: any) {
  const { booking } = route.params;

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const openInMaps = (address: string) => {
    const url = Platform.select({
      ios: `http://maps.apple.com/?q=${encodeURIComponent(address)}`,
      android: `geo:0,0?q=${encodeURIComponent(address)}`,
    });
    Linking.openURL(url!);
  };

  return (
    <ImageBackground
      source={require("../assets/background.png")}
      style={styles.background}
      imageStyle={styles.imageStyle}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.overlay}>
          <Image
            source={require("../assets/placeholderimage.png")}
            style={styles.image}
          />

          <View style={styles.info}>
            <Text style={styles.car}>{booking.make} {booking.model} {booking.trim}</Text>
            <Text style={styles.price}>{booking.pricePerDay} DKK/day</Text>

            <Text style={styles.label}>Pickup:</Text>
            <Text style={styles.value}>{formatDate(booking.start_datetime)}</Text>
            <TouchableOpacity onPress={() => openInMaps(booking.pickupLocation)}>
              <Text style={styles.location}>{booking.pickupLocation}</Text>
            </TouchableOpacity>

            <Text style={styles.label}>Dropoff:</Text>
            <Text style={styles.value}>{formatDate(booking.end_datetime)}</Text>
            <TouchableOpacity onPress={() => openInMaps(booking.dropoffLocation)}>
              <Text style={styles.location}>{booking.dropoffLocation}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => {
              alert("Booking cancelled!");
              navigation.goBack();
            }}
          >
            <Text style={styles.cancelText}>Cancel Booking</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  imageStyle: { resizeMode: "cover" },
  safeArea: { flex: 1, backgroundColor: "rgba(0,0,0,0.7)" },
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.7)", padding: 16 },
  image: { width: "100%", height: 200, borderRadius: 14, marginBottom: 20 },
  info: { marginBottom: 20 },
  car: { fontSize: 22, fontWeight: "800", color: "#fff", marginBottom: 6 },
  price: { color: "#fff", fontSize: 18, fontWeight: "700", marginBottom: 10 },
  label: { color: "#fff", fontSize: 18, marginTop: 10, fontWeight: "bold" },
  value: { color: "#fff", fontSize: 16, fontWeight: "500" },
  location: { color: "#2563EB", fontSize: 16, textDecorationLine: "underline", fontWeight: "600", marginTop: 2 },
  cancelButton: { backgroundColor: "#ff4444", borderRadius: 12, paddingVertical: 16, alignItems: "center", marginTop: "auto" },
  cancelText: { color: "#fff", fontWeight: "800", fontSize: 16 },
});
