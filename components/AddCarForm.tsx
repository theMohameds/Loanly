import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Alert } from "react-native";
import { Car } from "../types/Car";
import { addCar } from "../services/carsDB";

interface AddCarFormProps {
    onCarAdded?: (car: Car) => void;
}

export default function AddCarForm({ onCarAdded }: AddCarFormProps) {
    const [make, setMake] = useState("");
    const [model, setModel] = useState("");
    const [year, setYear] = useState("");
    const [color, setColor] = useState("");
    const [pricePerDay, setPricePerDay] = useState("");
    const [isAvailable, setIsAvailable] = useState(true);

    const handleAddCar = async () => {
        if (!make || !model || !year || !color || !pricePerDay) {
            Alert.alert("Please fill all fields");
            return;
        }

        const newCar: Car = {
            id: Date.now(),
            make,
            model,
            year: parseInt(year),
            color,
            pricePerDay: parseFloat(pricePerDay),
            isAvailable,
        };

        try {
            await addCar(newCar);  // insert into DB
            if (onCarAdded) onCarAdded(newCar); // only update UI in App

            Alert.alert("Car added successfully!");

            // Clear form
            setMake("");
            setModel("");
            setYear("");
            setColor("");
            setPricePerDay("");
            setIsAvailable(true);
        } catch (error) {
            console.error("Failed to save car:", error);
            Alert.alert("Error saving car");
        }
    };

    return (
        <View style={styles.container}>
            <TextInput placeholder="Make" value={make} onChangeText={setMake} style={styles.input} />
            <TextInput placeholder="Model" value={model} onChangeText={setModel} style={styles.input} />
            <TextInput placeholder="Year" value={year} onChangeText={setYear} keyboardType="numeric" style={styles.input} />
            <TextInput placeholder="Color" value={color} onChangeText={setColor} style={styles.input} />
            <TextInput
                placeholder="Price per day"
                value={pricePerDay}
                onChangeText={setPricePerDay}
                keyboardType="numeric"
                style={styles.input}
            />
            <Button title="Add Car" onPress={handleAddCar} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { marginVertical: 10 },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 8,
        marginVertical: 5,
        borderRadius: 5,
    },
});
