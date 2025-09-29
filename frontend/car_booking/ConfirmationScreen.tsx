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

export default function ConfirmationScreen({ route, navigation }: any) {
    const { car, location, pickupDate, dropoffDate } = route.params ?? {};

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

    const handleConfirm = () => {
        // ATTENZIONE API NEEDED HERE
        // We need to add an api here to store the booking in a database
        alert("Booking confirmed!");
        navigation.navigate("MainTabs", { screen: "MainMenu" });
    };

    return (
        <ImageBackground
            source={require("../assets/background.png")}
            style={styles.background}
            imageStyle={styles.imageStyle}
        >
            <ScrollView contentContainerStyle={styles.overlay}>
                <Text style={styles.header}>CONFIRM BOOKING</Text>

                {/* Car Image */}
                <Image source={car.image} style={styles.carImage} />

                {/* Card with car info */}
                <View style={styles.infoCard}>
                    <Text style={styles.name}>{car?.name}</Text>
                    <Text style={styles.price}>{car?.price}</Text>
                    <Text style={styles.specs}>
                        ⭐ {car?.rating} ({car?.reviews}) • {car?.type}
                    </Text>
                    <Text style={styles.location}>📍 {location}</Text>
                </View>

                {/* Card with selected pick up and dropoff dates */}
                <View style={styles.detailsBox}>
                    <Text style={styles.label}>Pickup</Text>
                    <Text style={styles.value}>{formatLong(pickupDate)}</Text>

                    <Text style={styles.label}>Dropoff</Text>
                    <Text style={styles.value}>{formatLong(dropoffDate)}</Text>
                </View>

                {/* Confirm button */}
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
        padding: 20,
    },
    header: {
        fontSize: 26,
        fontWeight: "800",
        color: "#fff",
        textAlign: "center",
        marginBottom: 16,
        letterSpacing: 2,
    },
    carImage: {
        width: "100%",
        height: 200,
        borderRadius: 16,
        marginBottom: 16,
    },
    infoCard: {
        backgroundColor: "rgba(0,0,0,0.8)",
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.06)",
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
        marginBottom: 24,
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
        backgroundColor: "#fff",
        borderRadius: 16,
        paddingVertical: 16,
        alignItems: "center",
    },
    confirmText: {
        fontWeight: "900",
        fontSize: 16,
        color: "#111"
    },
});
