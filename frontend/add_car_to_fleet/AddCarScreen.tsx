import React, { useState, useCallback, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
    Alert,
    ScrollView,
    KeyboardAvoidingView,
    Keyboard,
    Platform,
    SafeAreaView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { addCar, CarData } from "../../backend/firebase/carFirestore";

// Constants
const carTypes = ["Sedan", "SUV", "Hatchback", "Coupe", "Convertible", "Wagon", "Van", "Pickup Truck", "Crossover", "Minivan"];
const carFuel = ["Electric", "Hybrid", "Plug-in Hybrid", "Petrol", "Diesel", "Hydrogen", "LPG", "CNG", "Flex Fuel", "Bio-Diesel"];

type Props = { navigation: any };

export default function AddCarScreen({ navigation }: Props) {
    // Input states
    const [make, setMake] = useState("");
    const [model, setModel] = useState("");
    const [trim, setTrim] = useState("");
    const [carType, setCarType] = useState<string | null>(null);
    const [fuelType, setFuelType] = useState<string | null>(null);
    const [year, setYear] = useState("");
    const [seats, setSeats] = useState("");
    const [pricePerDay, setPricePerDay] = useState("");
    const [pickupLocation, setPickupLocation] = useState("");
    const [dropoffLocation, setDropoffLocation] = useState("");
    const [image, setImage] = useState<string | null>(null);
    const [errors, setErrors] = useState<Record<string, boolean>>({});

    // Keyboard height
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const MAX_EXTRA_SCROLL = 10;

    useEffect(() => {
        const showListener = Keyboard.addListener("keyboardDidShow", e => setKeyboardHeight(e.endCoordinates.height));
        const hideListener = Keyboard.addListener("keyboardDidHide", () => setKeyboardHeight(0));
        return () => { showListener.remove(); hideListener.remove(); };
    }, []);

    // Image picker
    const pickImage = useCallback(async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) return Alert.alert("Media permission required");

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) setImage(result.assets[0].uri);
    }, []);

    // Confirm car
    const confirmCar = useCallback(async () => {
        const newErrors = {
            make: !make.trim(),
            model: !model.trim(),
            trim: !trim.trim(),
            carType: !carType,
            fuelType: !fuelType,
            year: isNaN(Number(year)),
            seats: isNaN(Number(seats)),
            pricePerDay: isNaN(Number(pricePerDay)),
            pickupLocation: !pickupLocation.trim(),
            dropoffLocation: !dropoffLocation.trim(),
        };
        setErrors(newErrors);
        if (Object.values(newErrors).some(Boolean)) return;

        const newCar: CarData = {
            make: make.trim(),
            model: model.trim(),
            trim: trim.trim(),
            carType: carType!,
            fuelType: fuelType!,
            year: Number(year),
            seats: Number(seats),
            pricePerDay: Number(pricePerDay),
            pickupLocation: pickupLocation.trim(),
            dropoffLocation: dropoffLocation.trim(),
            rating: 0,
        };

        try {
            await addCar(newCar);
            Alert.alert("Success", "Car added successfully!");
            navigation.goBack();
        } catch (err) {
            console.error(err);
            Alert.alert("Error", "Failed to save car");
        }
    }, [make, model, trim, carType, fuelType, year, seats, pricePerDay, pickupLocation, dropoffLocation]);

    // Helper to render input fields
    const renderInput = (label: string, value: string, setter: (text: string) => void, keyboardType: any = "default") => (
        <View style={{ marginBottom: 16 }}>
            <Text style={styles.cardLabel}>{label}</Text>
            <TextInput
                style={[styles.input, errors[label] && styles.error]}
                value={value}
                onChangeText={setter}
                placeholder={`Enter ${label.toLowerCase()}`}
                placeholderTextColor="#999"
                keyboardType={keyboardType}
            />
        </View>
    );

    const renderChipSelector = (label: string, options: string[], selected: string | null, setter: (val: string) => void) => (
        <View style={{ marginBottom: 24 }}>
            <Text style={styles.cardLabel}>{label}</Text>
            <View style={styles.chipWrap}>
                {options.map(opt => (
                    <TouchableOpacity
                        key={opt}
                        style={[styles.chip, selected === opt && styles.chipActive]}
                        onPress={() => setter(opt)}
                    >
                        <Text style={styles.chipText}>{opt}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.overlay}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Add Car</Text>
            </View>

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
            >
                <ScrollView
                    contentContainerStyle={{
                        padding: 24,
                        paddingBottom: 24 + Math.min(keyboardHeight, MAX_EXTRA_SCROLL),
                    }}
                    keyboardShouldPersistTaps="handled"
                >

                    <View style={{ marginBottom: 24 }}>
                        <Text style={styles.cardLabel}>CAR IMAGE</Text>
                        <TouchableOpacity style={styles.carImage} onPress={pickImage}>
                            {image ? <Image source={{ uri: image }} style={styles.image} /> : <Text style={styles.placeholder}>Tap to select image</Text>}
                        </TouchableOpacity>
                    </View>

                    {renderInput("MAKE", make, setMake)}
                    {renderInput("MODEL", model, setModel)}
                    {renderInput("TRIM", trim, setTrim)}
                    {renderInput("PICKUP LOCATION", pickupLocation, setPickupLocation)}
                    {renderInput("DROPOFF LOCATION", dropoffLocation, setDropoffLocation)}

                    {renderChipSelector("CAR TYPE", carTypes, carType, setCarType)}
                    {renderChipSelector("FUEL TYPE", carFuel, fuelType, setFuelType)}

                    {renderInput("YEAR", year, setYear, "number-pad")}
                    {renderInput("SEATS", seats, setSeats, "number-pad")}
                    {renderInput("PRICE PER DAY", pricePerDay, setPricePerDay, "number-pad")}

                    <View style={{ marginBottom: 24 }}>
                        <TouchableOpacity style={styles.button} onPress={confirmCar}>
                            <Text style={styles.buttonText}>Add Car</Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: "#1a1a1a" },
    header: { backgroundColor: "#1d1d1d", padding: 20, paddingTop: 45, alignItems: "center" },
    headerTitle: { fontSize: 22, fontWeight: "bold", color: "#fff" },
    cardLabel: { color: "#fff", marginBottom: 6, fontWeight: "700" },
    input: { backgroundColor: "#303030", height: 54, borderRadius: 14, paddingHorizontal: 16, color: "#fff" },
    error: { borderColor: "#FF5A5F", borderWidth: 2 },
    carImage: { height: 180, borderRadius: 16, backgroundColor: "#303030", alignItems: "center", justifyContent: "center", marginBottom: 24 },
    image: { width: "100%", height: "100%", borderRadius: 16 },
    placeholder: { color: "#aaa" },
    chipWrap: { flexDirection: "row", flexWrap: "wrap" },
    chip: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20, backgroundColor: "#303030", margin: 4 },
    chipActive: { backgroundColor: "#3865e0ff" },
    chipText: { color: "#fff", fontSize: 13 },
    button: { paddingVertical: 16, borderRadius: 16, alignItems: "center", marginTop: 16,  backgroundColor: "#3865e0ff" },
    buttonText: { color: "#fff", fontSize: 18, fontWeight: "700" },
});
