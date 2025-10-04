import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { Car } from "../types/Car";

type Props = {
  cars: Car[];
};

export default function CarList({ cars }: Props) {
  return (
    <FlatList
      data={cars}
      extraData={cars} // forces FlatList to re-render when state changes
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.title}>
            {item.make} {item.model} ({item.year})
          </Text>
          <Text>Color: {item.color}</Text>
          <Text>Price/Day: ${item.pricePerDay}</Text>
          <Text>Available: {item.isAvailable ? "✅ Yes" : "❌ No"}</Text>
        </View>
      )}
      ListEmptyComponent={
        <Text style={styles.empty}>No cars available yet.</Text>
      }
    />
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 12,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
  empty: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#666",
  },
});
