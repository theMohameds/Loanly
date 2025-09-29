import React from "react";
import {View, Text, FlatList, Image, StyleSheet, TouchableOpacity, ImageBackground } from "react-native";

//TEMPORARY CAR DATA! SKAL SKIFTES MED API
const cars = [
    {
        id: "1",
        name: "TESLA MODEL 3",
        rating: 4.7,
        reviews: 15,
        type: "Electric",
        location: "5000, Odense",
        price: "DKK 470 per day",
        image: require("../assets/tesla3.png"),
    },
    {
        id: "2",
        name: "BMW i4 eDrive40",
        rating: 4.6,
        reviews: 18,
        type: "Electric",
        location: "5000, Odense",
        price: "DKK 520 per day",
        image: require("../assets/bmw-i4.png"),
    },
    {
        id: "3",
        name: "AUDI e-tron GT",
        rating: 4.8,
        reviews: 22,
        type: "Electric",
        location: "5000, Odense",
        price: "DKK 640 per day",
        image: require("../assets/audi-etron-gt.png"),
    },
    {
        id: "4",
        name: "FORD TRANSIT VAN",
        rating: 4.4,
        reviews: 11,
        type: "Gasoline",
        location: "5000, Odense",
        price: "DKK 430 per day",
        image: require("../assets/ford-transit.png"),
    },
    {
        id: "5",
        name: "POLESTAR 2",
        rating: 4.6,
        reviews: 17,
        type: "Electric",
        location: "5000, Odense",
        price: "DKK 490 per day",
        image: require("../assets/polestar-2.png"),
    },
];



export default function AvailableCarsScreen({ route, navigation }: any) {
    const { location, pickupDate, dropoffDate } = route.params ?? {};

    const formatShort = (iso?: string) =>
        iso ? new Date(iso).toLocaleString(undefined, {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            })
            : "";

    return (
        <ImageBackground
            source={require("../assets/background.png")}
            style={styles.background}
            imageStyle={styles.imageStyle}
        >
            <View style={styles.overlay}>
                {/* Header */}
                <View style={styles.headerBox}>
                    <Text style={styles.header}>SELECT CAR</Text>
                    <Text style={styles.metaText}>{location ?? "—"}</Text>
                    <Text style={styles.metaText}>
                        {pickupDate && dropoffDate
                            ? `${formatShort(pickupDate)}  —  ${formatShort(dropoffDate)}`
                            : "Dates not set"}
                    </Text>
                </View>

                {/* Car List */}
                <FlatList
                    data={cars}
                    keyExtractor={(i) => i.id}
                    contentContainerStyle={{ paddingBottom: 28 }}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <Image source={item.image} style={styles.image} />

                            <View style={styles.info}>
                                <Text style={styles.name} numberOfLines={2} ellipsizeMode="tail">
                                    {item.name}
                                </Text>

                                <View style={styles.specRow}>
                                    <Text style={styles.tag}>
                                        ⭐ {item.rating} ({item.reviews})
                                    </Text>
                                    <Text style={styles.dot}>•</Text>
                                    <Text style={styles.tag}>{item.type}</Text>
                                </View>

                                <Text style={styles.location}>📍 {item.location}</Text>

                                <View style={styles.actionRow}>
                                    <View style={styles.pricePill}>
                                        <Text style={styles.pricePillText}>{item.price}</Text>
                                    </View>

                                    <TouchableOpacity
                                        style={styles.selectBtn}
                                        onPress={() =>
                                            navigation.navigate("Confirmation", {
                                                car: item,
                                                location,
                                                pickupDate,
                                                dropoffDate,
                                            })
                                        }
                                    >
                                        <Text style={styles.selectText}>Select</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    )}
                />

            </View>
        </ImageBackground>
    );
}

const SIDE = 16;

const styles = StyleSheet.create({
    background: {
        flex: 1
    },
    imageStyle: {
        resizeMode: "cover"
    },

    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.7)",
        paddingHorizontal: SIDE,
        paddingTop: 10,
    },

    headerBox: {
        alignItems: "center",
        marginBottom: 12,
    },
    header: {
        fontSize: 26,
        fontWeight: "800",
        color: "#fff",
        letterSpacing: 2,
    },
    metaText: {
        color: "#d0d0d0",
        fontSize: 12,
        marginTop: 4
    },

    card: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.78)",
        borderRadius: 16,
        overflow: "hidden",
        marginVertical: 10,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.06)",
    },

    image: {
        width: 132,
        height: 110
    },

    info: {
        flex: 1,
        padding: 12,
        justifyContent: "center"
    },

    name: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "800",
        marginBottom: 6,
    },

    specRow: {
        flexDirection: "row",
        alignItems: "center",
        flexWrap: "wrap",
        marginBottom: 6,
    },
    tag: {
        color: "#c9c9c9",
        fontSize: 13
    },
    dot: {
        color: "#c9c9c9",
        marginHorizontal: 6
    },

    location: {
        color: "#bdbdbd",
        fontSize: 12,
        marginBottom: 10
    },

    actionRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 4,
    },
    pricePill: {
        backgroundColor: "rgba(0,0,0,0.78)",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 999,
    },
    pricePillText: {
        color: "#fff",
        fontWeight: "900",
        fontSize: 12,
        letterSpacing: 0.3,
    },

    selectBtn: {
        backgroundColor: "#fff",
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 10,
    },
    selectText: {
        fontWeight: "900",
        color: "#111",
        fontSize: 14
    },
});
