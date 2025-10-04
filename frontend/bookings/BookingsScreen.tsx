import React, { useState } from "react";
import {View, Text, FlatList, StyleSheet, Image, TouchableOpacity, ImageBackground, SafeAreaView, StatusBar } from "react-native";

const calculateTotalPrice = (pickupDate: string, dropoffDate: string, pricePerDay: number) => {
    const start = new Date(pickupDate);
    const end = new Date(dropoffDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return days * pricePerDay;
};

// SKAL SKIFTES MED API TIL AT HENTE BOOKINGS FRA EN BRUGER ;)
const initialBookings = [
    {
        id: "1",
        bookingNumber: "21582733",
        car: "Tesla Model 3",
        image: require("../assets/tesla3.png"),
        pickupDate: "2025-09-29T15:15:00Z",
        dropoffDate: "2025-10-02T15:15:00Z",
        pickupLocation: "H.C. Andersen Boulevard 45, 5000 Odense",
        dropoffLocation: "H.C. Andersen Boulevard 45, 5000 Odense",
        pricePerDay: 470,
    },
    {
        id: "2",
        bookingNumber: "93458833",
        car: "BMW i4 eDrive40",
        image: require("../assets/bmw-i4.png"),
        pickupDate: "2025-10-05T12:00:00Z",
        dropoffDate: "2025-10-10T12:00:00Z",
        pickupLocation: "Odense Banegård Center, Østre Stationsvej 27, 5000 Odense",
        dropoffLocation: "Odense Banegård Center, Østre Stationsvej 27, 5000 Odense",
        pricePerDay: 520,
    },
    {
        id: "3",
        bookingNumber: "84567355",
        car: "Audi e-tron GT",
        image: require("../assets/audi-etron-gt.png"),
        pickupDate: "2025-11-01T09:30:00Z",
        dropoffDate: "2025-11-05T09:30:00Z",
        pickupLocation: "Sdr. Boulevard 29, 5000 Odense",
        dropoffLocation: "Sdr. Boulevard 29, 5000 Odense",
        pricePerDay: 640,
    },
];

export default function BookingsScreen({ navigation }: any) {
    const [bookings] = useState(initialBookings);

    const formatDate = (iso: string) =>
        new Date(iso).toLocaleString(undefined, {
            weekday: "short",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });

    return (
        <ImageBackground
            source={require("../assets/background.png")}
            style={styles.background}
            imageStyle={styles.imageStyle}
        >

            <SafeAreaView style={styles.safeArea}>
                <View style={styles.overlay}>
                    <Text style={styles.header}>MY BOOKINGS</Text>

                    <FlatList
                        data={bookings}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={{ paddingBottom: 30 }}
                        renderItem={({ item }) => {
                            const totalPrice = calculateTotalPrice(
                                item.pickupDate,
                                item.dropoffDate,
                                item.pricePerDay
                            );

                            return (
                                <TouchableOpacity
                                    style={styles.card}
                                    onPress={() =>
                                        navigation.navigate("BookingDetails", { booking: item })
                                    }
                                >
                                    <Image source={item.image} style={styles.image} />
                                    <View style={styles.info}>
                                        <Text style={styles.car}>{item.car}</Text>
                                        <Text style={styles.bookingNumber}>
                                            Booking #{item.bookingNumber}
                                        </Text>
                                        <Text style={styles.price}>
                                            Total: {totalPrice} DKK

                                        </Text>

                                        <Text style={styles.label}>
                                            Pickup: {formatDate(item.pickupDate)}
                                        </Text>

                                        <Text style={styles.label}>
                                            Dropoff: {formatDate(item.dropoffDate)}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            );
                        }}
                    />
                </View>
            </SafeAreaView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: { flex: 1 },
    imageStyle: { resizeMode: "cover" },
    safeArea: { flex: 1, backgroundColor: "rgba(0,0,0,0.7)" },
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.0)",
        padding: 16,
    },

    header: {
        fontSize: 26,
        fontWeight: "800",
        color: "#fff",
        textAlign: "center",
        marginBottom: 20,
        letterSpacing: 2,
    },

    card: {
        backgroundColor: "rgba(0,0,0,0.85)",
        borderRadius: 16,
        marginBottom: 18,
        overflow: "hidden",
    },

    image: {
        width: "100%",
        height: 160,
        resizeMode: "cover"
    },

    info: {
        padding: 14
    },

    car: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "800"
    },

    bookingNumber: {
        color: "#bbb",
        fontSize: 13,
        marginBottom: 4
    },

    price: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
        marginBottom: 6
    },

    label: {
        color: "#bbb",
        fontSize: 14,
        marginTop: 6
    },

    location: {
        color: "#ccc",
        fontSize: 13,
        marginLeft: 8
    },
});
