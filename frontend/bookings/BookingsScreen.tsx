import React, { useState, useCallback } from "react";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Image,
    ScrollView,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { getAllBookings } from "../../backend/database/bookingsDB";

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

    useFocusEffect(
        useCallback(() => {
            let isActive = true;

            async function loadBookings() {
                try {
                    const rows = await getAllBookings();
                    if (isActive) setBookings(rows);
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

    if (loading) {
        return (
            <View>
                <ActivityIndicator size="large" color="#fff" />
            </View>
        );
    }
    

 return (
    <ScrollView style={styles.container}>
        <View style={styles.header}>
            <Text style={styles.headerTitle}>My Bookings</Text>
        </View>

        <View style={styles.overlay}>
            {bookings.length === 0 ? (
                <Text style={styles.emptyText}>No bookings found.</Text>
            ) : (
                bookings.map((item) => {
                    const carName = `${item.make} ${item.model} ${item.trim}`;
                    return (
                        <TouchableOpacity
                                key={item.bookingId}
                                style={styles.card}
                                onPress={() =>
                                    navigation.navigate("BookingDetails", { booking: item })
                                }
                            >
                                <Image
                                    source={require("../assets/placeholderimage.png")}
                                    style={styles.image}
                                />
                                <View>
                                    <Text style={styles.car}>{carName}</Text>
                                    <Text style={styles.price}>{item.pricePerDay} DKK/day</Text>
                                    <Text style={styles.label}>
                                        Pickup: {formatDate(item.start_datetime)}
                                    </Text>
                                    <Text style={styles.label}>
                                        Dropoff: {formatDate(item.end_datetime)}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        );
                    })
                )}
            </View>
        </ScrollView>
    );

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#212121ff",
    },
    header: {
        backgroundColor: '#252525ff',
        padding: 20,
        paddingTop: 45,
        alignItems: 'center',
        // iOS shadow
        shadowColor: "#000000ff",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        // Android shadow
        elevation: 6,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    safeArea: {
        flex: 1,
        backgroundColor: "#212121ff",
    },
    overlay: {
        flex: 1,
        paddingVertical: 20,
        marginHorizontal: 20,
    },
    card: {
        backgroundColor: "#303030ff",
        borderRadius: 10,
        marginBottom: 18,
        overflow: "hidden",
        padding: 14,
    },
    image: {
        width: "100%",
        height: 160,
        borderRadius: 14,
        marginBottom: 8,
        resizeMode: "cover",
    },
    car: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "800",
        marginBottom: 4,
    },
    price: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
        marginBottom: 4,
    },
    label: {
        color: "#bbb",
        fontSize: 14,
        marginTop: 4,
    },
    emptyText: {
        color: "#fff",
        textAlign: "center",
        marginTop: 50,
    },
});

