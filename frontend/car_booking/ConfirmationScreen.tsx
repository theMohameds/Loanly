import React from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ImageBackground,
    ScrollView,
} from "react-native";

import { addBooking } from "../../backend/database/bookingsDB";

export default function ConfirmationScreen({ route, navigation }: any) {
    const { car, pickupLocation, dropoffLocation, pickupDate, dropoffDate } = route.params!;

    const formatLong = (iso?: string) =>
        iso
            ? new Date(iso).toLocaleString(undefined, {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            })
            : "";

    const handleConfirm = async () => {
        if (!car || !pickupDate || !dropoffDate || !pickupLocation || !dropoffLocation) {
            alert("Please select all booking details.");
            return;
        }

        try {
            const defaultUserId = 1;
            const totalPrice = car.pricePerDay;

            await addBooking({
                user_id: defaultUserId,
                car_id: car.id,
                start_datetime: pickupDate,
                end_datetime: dropoffDate,
                total_price: totalPrice,
                pickupLocation,
                dropoffLocation,
            });

            alert("Booking confirmed!");
            navigation.navigate("MainTabs", { screen: "MainMenu" });
        } catch (err) {
            console.error("Booking error:", err);
            alert("Failed to create booking");
        }
    };

    if (!car) return <View style={styles.centered}><Text style={{ color: "#fff" }}>No car selected</Text></View>;

    return (
        <ImageBackground source={require("../assets/background.png")} style={styles.background} imageStyle={styles.imageStyle}>
            <ScrollView contentContainerStyle={styles.overlay}>

                <Image source={require("../assets/placeholderimage.png")} style={styles.carImage} />

                <View style={styles.infoCard}>
                    <Text style={styles.name}>{car.make} {car.model}</Text>
                    <Text style={styles.specs}>
                        ⭐ {car.rating || "-"} ({car.reviews || 0})
                    </Text>
                </View>
                <Text style={styles.price}>{car.pricePerDay} DKK/day</Text>
                <View style={styles.detailsBox}>
                    <Text style={styles.label}>Pickup</Text>
                    <Text style={styles.value}>{formatLong(pickupDate)}</Text>

                    <Text style={styles.label}>Dropoff</Text>
                    <Text style={styles.value}>{formatLong(dropoffDate)}</Text>
                    <Text style={styles.location}>📍 {dropoffLocation}</Text>
                </View>

                <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
                    <Text style={styles.confirmText}>CONFIRM BOOKING</Text>
                </TouchableOpacity>
            </ScrollView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1
    },
    imageStyle: {
        resizeMode: "cover"
    },
    overlay: {
        flexGrow: 1,
        backgroundColor: "rgba(0,0,0,0.7)",
        padding: 20
    },
    header: {
        fontSize: 26,
        fontWeight: "800",
        color: "#fff",
        textAlign: "center",
        marginBottom: 16,
        letterSpacing: 2
    },
    carImage: {
        width: "100%",
        height: 200,
        borderRadius: 16,
        marginBottom: 16
    },
    infoCard: {
        backgroundColor: "rgba(0,0,0,0.8)",
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.06)"
    },
    name: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "800",
        marginBottom: 6
    },
    price: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
        marginBottom: 6
    },
    specs: {
        color: "#c9c9c9",
        fontSize: 13,
        marginBottom: 6
    },
    location: {
        color: "#bdbdbd",
        fontSize: 12
    },
    detailsBox: {
        backgroundColor: "rgba(255,255,255,0.05)",
        borderRadius: 14,
        padding: 16,
        marginBottom: 24
    },
    label: {
        color: "#bbb",
        fontSize: 16,
        marginTop: 6
    },
    value: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "600",
        marginBottom: 8
    },
    confirmButton: {
        backgroundColor: "#0088FF",
        height: 54,
        borderRadius: 18,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.18,
        shadowRadius: 12,
        elevation: 6,
    },
    confirmText: {
        color: "#ffffffff",
        fontSize: 16,
        fontWeight: "900",
        letterSpacing: 1,
    },
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#000"
    },
});
