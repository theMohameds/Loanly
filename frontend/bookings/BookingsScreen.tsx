import React, { useState, useCallback } from "react";
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Image,
    SafeAreaView,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { getMyBookings } from "../../backend/firebase/bookingsFirestore";
import { getCarWithOwnerName } from "../../backend/firebase/firestoreUser";

type UIStatus = "Upcoming" | "Ongoing" | "Done" | "Cancelled";

const getBookingUIStatus = (
    firestoreStatus: "pending" | "cancelled",
    start: string | number,
    end: string | number
): UIStatus => {
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

export default function BookingsScreen() {
    const navigation = useNavigation<any>();
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<UIStatus | undefined>();

    const formatDate = (value: string | number | undefined) => {
        if (!value) return "Invalid Date";
        const date = new Date(value);
        if (isNaN(date.getTime())) return "Invalid Date";
        return date.toLocaleString(undefined, {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        });
    };

    useFocusEffect(
        useCallback(() => {
            let isActive = true;

            async function loadBookings() {
                try {
                    const rows = await getMyBookings();
                    const bookingsWithCars = await Promise.all(
                        rows.map(async (booking: any) => {
                            const car = await getCarWithOwnerName(booking.carId);
                            return { ...booking, car };
                        })
                    );
                    if (isActive) setBookings(bookingsWithCars);
                } catch (err) {
                    console.error("Failed to load bookings:", err);
                } finally {
                    if (isActive) setLoading(false);
                }
            }

            loadBookings();
            return () => {
                isActive = false;
            };
        }, [])
    );

    const filteredBookings = bookings
        .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
        .filter((item) => {
            const status = getBookingUIStatus(item.status, item.startDate, item.endDate);
            return !statusFilter || status === statusFilter;
        });

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#3B82F6" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.overlay}>
            <ScrollView>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>My Bookings</Text>
                </View>

                {/* Filter Bar */}
                <View style={styles.filterBar}>
                    {["Upcoming", "Ongoing", "Done", "Cancelled"].map((option) => (
                        <TouchableOpacity
                            key={option}
                            style={[styles.filterButton, statusFilter === option && styles.filterButtonActive]}
                            onPress={() => setStatusFilter(statusFilter === option ? undefined : (option as UIStatus))}
                        >
                            <Text style={styles.filterText}>{option}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Booking List */}
                <View style={styles.overlay2}>
                    {filteredBookings.map((item) => {
                        const status = getBookingUIStatus(item.status, item.startDate, item.endDate);

                        return (
                            <TouchableOpacity
                                key={item.bookingId}
                                activeOpacity={0.85}
                                onPress={() => navigation.navigate("BookingDetails", { bookingId: item.bookingId })}
                            >
                                <View style={styles.card}>
                                    <Image
                                        source={
                                            item.car?.imageUrl
                                                ? { uri: item.car.imageUrl }
                                                : require("../assets/audi-etron-gt.png")
                                        }
                                        style={styles.image}
                                    />
                                    <View style={styles.cardInfo}>
                                        <View style={styles.topRow}>
                                            <Text style={styles.car} numberOfLines={1} ellipsizeMode="tail">
                                                {item.car?.make} {item.car?.model}
                                            </Text>
                                            <Text style={styles.price}>{item.car?.pricePerDay ?? 0} DKK/day</Text>
                                        </View>
                                        <Text style={styles.label}>Pickup: {formatDate(item.startDate)}</Text>
                                        <View style={styles.dropoffRow}>
                                            <Text style={styles.label}>Dropoff: {formatDate(item.endDate)}</Text>
                                            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(status) }]}>
                                                <Text style={styles.statusText}>{status}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: "#1a1a1a" },
    centered: { flex: 1, justifyContent: "center", alignItems: "center" },
    header: { padding: 20, paddingTop: 45, alignItems: "center", backgroundColor: "#1d1d1d" },
    headerTitle: { color: "#fff", fontSize: 22, fontWeight: "bold" },
    filterBar: { flexDirection: "row", justifyContent: "space-around", marginTop: 16, marginHorizontal: 16 },
    filterButton: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20, backgroundColor: "#444" },
    filterButtonActive: { backgroundColor: "#2563EB" },
    filterText: { color: "#fff", fontWeight: "600" },
    overlay2: { padding: 16 },
    card: { backgroundColor: "#242424", borderRadius: 16, marginBottom: 18, overflow: "hidden" },
    image: { width: "100%", height: 180 },
    cardInfo: { padding: 14 },
    topRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
    car: { color: "#fff", fontSize: 18, fontWeight: "700" },
    price: { color: "#fff", fontWeight: "600" },
    label: { color: "#bbb", marginTop: 4 },
    dropoffRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    statusBadge: { paddingVertical: 4, paddingHorizontal: 8, borderRadius: 12 },
    statusText: { color: "#fff", fontWeight: "600", fontSize: 12 },
});
