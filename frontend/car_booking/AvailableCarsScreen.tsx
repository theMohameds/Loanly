import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from "react-native";
import { loadCars } from "../../backend/database/carsDB";
import { Ionicons } from "@expo/vector-icons";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function AvailableCarsScreen({ route, navigation }: any) {
    const { location, pickupDate, dropoffDate } = route.params ?? {};
    const [cars, setCars] = useState<any[]>([]);

    // Load cars when screen mounts
    useEffect(() => {
        async function fetchCarsFromDB() {
            try {
                const dbCars = await loadCars();
                setCars(dbCars);
            } catch (error) {
                console.error("Error loading cars from DB:", error);
            }
        }
        fetchCarsFromDB();
    }, []);

    const formatShort = (iso?: string) =>
        iso
            ? new Date(iso).toLocaleString(undefined, {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            })
            : "";

    return (

        <FlatList
            style={styles.background}
            data={cars}
            contentContainerStyle={{ paddingBottom: 75 }}
            renderItem={({ item }) => (
                <TouchableOpacity
                    style={styles.card}
                    onPress={() =>
                        navigation.navigate("Confirmation", {
                            car: item,
                            pickupLocation: item.pickupLocation,
                            dropoffLocation: item.dropoffLocation,
                            pickupDate,
                            dropoffDate,
                        })
                    }
                >
                    <Image
                        source={require("../assets/placeholderimage.png")}
                        style={styles.image}
                    />

                    <View style={styles.info}>

                        <View >
                            <View>
                                <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
                                    {item.make} {item.model}
                                </Text>
                            </View>

                            <View style={styles.upperInfo}>
                                <Text style={styles.specialText}>
                                    {item.year}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.infoIcons}>
                            <Ionicons name="car-outline" size={23} color="#ffffffff" />
                            <Text style={styles.normalText}>
                                {item.carType}
                            </Text>
                        </View>

                        <View style={styles.infoIcons}>
                            <MaterialCommunityIcons name="gas-station-outline" size={23} color="#ffffffff" />
                            <Text style={styles.normalText}>
                                {item.fuelType}
                            </Text>
                        </View>

                        <View style={styles.infoIcons}>
                            <Ionicons name="people-outline" size={23} color="#ffffffff" />
                            <Text style={styles.normalText}>
                                {item.seats}
                            </Text>
                        </View>

                        <View>
                            <Text style={styles.normalText}>
                                DKK {item.pricePerDay}/Day
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>
            )}
        />
    );
}




const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: "#212121ff",
    },


    header: {
        fontSize: 26,
        fontWeight: "800",
        color: "#ffffffff",
        letterSpacing: 2,
    },


    card: {
        flexDirection: "row",
        backgroundColor: "#303030ff",
        borderRadius: 10,
        overflow: "hidden",
        borderWidth: 0,
        padding: 16,
        marginVertical: 10,
        marginHorizontal: 15,

        // iOS shadow
        shadowColor: "#000000ff",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,

        // Android shadow
        elevation: 6,
    },

    image: {
        width: 160,
        height: 140,
        resizeMode: "cover"
    },

    info: {
        flex: 1,
        height: 140,
        marginHorizontal: 15,
        marginVertical: -3,
        justifyContent: "space-between",
    },

    infoIcons: {
        flexDirection: "row",
        alignItems: "center",
        gap: 3,

    },


    upperInfo: {
        marginVertical: -5,
    },

    name: {
        color: "#ffffffff",
        fontSize: 18,
        fontWeight: "700",
        

    },

    normalText: {
        marginVertical: -5,
        color: "#ffffffff",
        fontSize: 14,

    },

    specialText: {
        color: "#B0B0B0",
        fontSize: 14,
        marginTop: 4
    }


});
