import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, ImageBackground } from "react-native";
import { loadCars } from "../../services/carsDB";  // <-- import your DB loader

export default function AvailableCarsScreen({ route, navigation }: any) {
  const { location, pickupDate, dropoffDate } = route.params ?? {};
  const [cars, setCars] = useState<any[]>([]);   // state for DB cars

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
          keyExtractor={(i) => i.id?.toString()}   // id is integer in DB
          contentContainerStyle={{ paddingBottom: 28 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              {/* If you don't store images in DB, use placeholder */}
              <Image
                source={require("../assets/placeholderimage.png")} 
                style={styles.image}
              />

              <View style={styles.info}>
                <Text style={styles.name} numberOfLines={2} ellipsizeMode="tail">
                  {item.make} {item.model}
                </Text>

                <View style={styles.specRow}>
                  <Text style={styles.tag}>{item.year}</Text>
                  <Text style={styles.dot}>•</Text>
                  <Text style={styles.tag}>{item.color ?? "N/A"}</Text>
                </View>

                <Text style={styles.location}>📍 {location ?? "Unknown"}</Text>

                <View style={styles.actionRow}>
                  <View style={styles.pricePill}>
                    <Text style={styles.pricePillText}>
                      DKK {item.pricePerDay} per day
                    </Text>
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
