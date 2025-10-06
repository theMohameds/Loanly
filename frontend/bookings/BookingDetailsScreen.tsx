import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    SafeAreaView,
    Linking,
    Platform,
    Alert,
    ScrollView,
    ActivityIndicator,
} from "react-native";
import { deleteBooking } from "../../backend/database/bookingsDB";
import { getCarById } from "../../backend/database/carsDB";
import { Car } from "../../backend/types/Car";

export default function BookingDetailsScreen({ route, navigation }: any) {
    const { booking } = route.params;
    const [car, setCar] = useState<Car | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadCar() {
            try {
                const carData = await getCarById(booking.carId);
                setCar(carData);
            } catch (err) {
                console.error("Failed to load car:", err);
            } finally {
                setLoading(false);
            }
        }
        loadCar();
    }, [booking.carId]);

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

    const handleCancelBooking = async () => {
        Alert.alert(
            "Cancel Booking",
            "Are you sure you want to cancel this booking?",
            [
                { text: "No", style: "cancel" },
                {
                    text: "Yes",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteBooking(booking.bookingId);
                            Alert.alert("Booking cancelled!");
                            navigation.goBack();
                        } catch (error) {
                            console.error("Error cancelling booking:", error);
                            Alert.alert("Failed to cancel booking. Please try again.");
                        }
                    },
                },
            ]
        );
    };

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#fff" />
            </View>
        );
    }

    if (!car) {
        return (
            <View style={styles.centered}>
                <Text style={{ color: "#fff" }}>Car not found</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.overlay}>
                <Image
                    source={require("../assets/placeholderimage.png")}
                    style={styles.image}
                />

                <View style={styles.info}>
                    <Text style={styles.car}>
                        {car.make} {car.model} {car.trim}
                    </Text>
                    <Text style={styles.price}>{car.pricePerDay} DKK/day</Text>

                    {/* ✅ Car details section */}
                    <View style={styles.detailsContainer}>
                        <Text style={styles.detailItem}>Year: {car.year}</Text>
                        <Text style={styles.detailItem}>Fuel Type: {car.fuelType}</Text>
                        <Text style={styles.detailItem}>Car Type: {car.carType}</Text>
                        <Text style={styles.detailItem}>Seats: {car.seats}</Text>
                    </View>

                    <Text style={styles.label}>Pickup:</Text>
                    <Text style={styles.value}>{formatDate(booking.start_datetime)}</Text>
                    <TouchableOpacity onPress={() => openInMaps(car.pickupLocation)}>
                        <Text style={styles.location}>{car.pickupLocation}</Text>
                    </TouchableOpacity>

                    <Text style={styles.label}>Dropoff:</Text>
                    <Text style={styles.value}>{formatDate(booking.end_datetime)}</Text>
                    <TouchableOpacity onPress={() => openInMaps(car.dropoffLocation)}>
                        <Text style={styles.location}>{car.dropoffLocation}</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={handleCancelBooking}
                >
                    <Text style={styles.cancelText}>Cancel Booking</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.7)"
    },
    overlay: {
        flexGrow: 1,
        backgroundColor: "#212121ff",
        padding: 16
    },
    image: {
        width: "100%",
        height: 200,
        borderRadius: 14,
        marginBottom: 20
    },
    info: {
        marginBottom: 20
    },
    car: {
        fontSize: 22,
        fontWeight: "800",
        color: "#fff",
        marginBottom: 6
    },
    price: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 10
    },
    detailsContainer: {
        backgroundColor: "#2d2d2d",
        borderRadius: 10,
        padding: 10,
        marginBottom: 12,
    },
    detailItem: {
        color: "#ddd",
        fontSize: 16,
        marginBottom: 4
    },
    label: {
        color: "#fff",
        fontSize: 18,
        marginTop: 10,
        fontWeight: "bold"
    },
    value: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "500"
    },
    location: {
        color: "#2563EB",
        fontSize: 16,
        textDecorationLine: "underline",
        fontWeight: "600",
        marginTop: 2,
    },
    cancelButton: {
        backgroundColor: "#ff4444",
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: "center",
        marginTop: "auto",
    },
    cancelText: {
        color: "#fff",
        fontWeight: "800",
        fontSize: 16
    },
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
});
