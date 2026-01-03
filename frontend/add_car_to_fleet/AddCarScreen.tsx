import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ImageBackground,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { addCar, CarData } from "../../backend/carFirestore";

const carTypes = [
    "Sedan", "SUV", "Hatchback", "Coupe", "Convertible",
    "Wagon", "Van", "Pickup Truck", "Crossover", "Minivan",
];

const carFuel = [
    "Electric", "Hybrid", "Plug-in Hybrid", "Petrol",
    "Diesel", "Hydrogen", "LPG", "CNG", "Flex Fuel", "Bio-Diesel",
];

type Props = { navigation: any };

export default function AddCarScreen({ navigation }: Props) {
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

    const pickImage = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) return alert("Media permission required");

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) setImage(result.assets[0].uri);
    };

    const confirmCar = async () => {
        const newErrors = {
            make: make.trim() === "",
            model: model.trim() === "",
            trim: trim.trim() === "",
            carType: !carType,
            fuelType: !fuelType,
            year: isNaN(Number(year)),
            seats: isNaN(Number(seats)),
            pricePerDay: isNaN(Number(pricePerDay)),
            pickupLocation: pickupLocation.trim() === "",
            dropoffLocation: dropoffLocation.trim() === "",
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
            alert("Car added successfully!");
            navigation.goBack();
        } catch (err) {
            console.error(err);
            alert("Failed to save car");
        }
    };

    return (


        <View style={styles.overlay}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Add Car</Text>
            </View>
            <SafeAreaView style={{ flex: 1 }}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : undefined}
                    style={{ flex: 1 }}
                >

                    <ScrollView contentContainerStyle={styles.content}>


                        <Text style={styles.cardLabel}>CAR IMAGE</Text>
                        <TouchableOpacity style={styles.carImage} onPress={pickImage}>
                            {image ? (
                                <Image source={{ uri: image }} style={styles.image} />
                            ) : (
                                <Text style={styles.placeholder}>Tap to select image</Text>
                            )}
                        </TouchableOpacity>

                        {[
                            ["MAKE", make, setMake],
                            ["MODEL", model, setModel],
                            ["TRIM", trim, setTrim],
                            ["PICKUP LOCATION", pickupLocation, setPickupLocation],
                            ["DROPOFF LOCATION", dropoffLocation, setDropoffLocation],
                        ].map(([label, value, setter]: any) => (
                            <View key={label}>
                                <Text style={styles.cardLabel}>{label}</Text>
                                <TextInput
                                    style={[styles.input, errors[label] && styles.error]}
                                    value={value}
                                    onChangeText={setter}
                                    placeholder={`Enter ${label.toLowerCase()}`}
                                    placeholderTextColor="#999"
                                />
                            </View>
                        ))}

                        

                        <Text style={styles.cardLabel}>CAR TYPE</Text>
                        <View style={styles.chipWrap}>
                            {carTypes.map(type => (
                                <TouchableOpacity
                                    key={type}
                                    style={[
                                        styles.chip,
                                        carType === type && styles.chipActive,
                                    ]}
                                    onPress={() => setCarType(type)}
                                >
                                    <Text style={styles.chipText}>{type}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        

                        <Text style={styles.cardLabel}>FUEL TYPE</Text>
                        <View style={styles.chipWrap}>
                            {carFuel.map(fuel => (
                                <TouchableOpacity
                                    key={fuel}
                                    style={[
                                        styles.chip,
                                        fuelType === fuel && styles.chipActive,
                                    ]}
                                    onPress={() => setFuelType(fuel)}
                                >
                                    <Text style={styles.chipText}>{fuel}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        
                        {[
                            ["YEAR", year, setYear],
                            ["SEATS", seats, setSeats],
                            ["PRICE PER DAY", pricePerDay, setPricePerDay],
                        ].map(([label, value, setter]: any) => (
                            <View key={label}>
                                <Text style={styles.cardLabel}>{label}</Text>
                                <TextInput
                                    style={[styles.input, errors[label] && styles.error]}
                                    keyboardType="number-pad"
                                    value={value}
                                    onChangeText={setter}
                                />
                            </View>
                        ))}

                        
                        <TouchableOpacity style={[styles.bookButton, { backgroundColor: "#3865e0ff" }]} onPress={confirmCar}>
                            <Text style={{ color: "#fff", fontSize: 18, fontWeight: "700" }}>Add Car</Text>
                        </TouchableOpacity>


                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>

    );
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#1d1d1d',
        padding: 20,
        paddingTop: 45,
        alignItems: 'center',
        shadowColor: "#000000ff",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 6,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    background: { flex: 1 },
    overlay: { flex: 1, backgroundColor: "#1a1a1a" },
    content: { padding: 24 },
    cardLabel: { color: "#fff", marginBottom: 6, fontWeight: "700" },
    input: {
        backgroundColor: "#303030",
        height: 54,
        borderRadius: 14,
        paddingHorizontal: 16,
        color: "#fff",
        marginBottom: 18,
    },
    error: { borderColor: "#FF5A5F", borderWidth: 2 },
    carImage: {
        height: 180,
        borderRadius: 16,
        backgroundColor: "#303030",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 24,
    },
    image: { width: "100%", height: "100%", borderRadius: 16 },
    placeholder: { color: "#aaa" },
    chipWrap: { flexDirection: "row", flexWrap: "wrap", marginBottom: 24 },
    chip: {
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 20,
        backgroundColor: "#303030",
        margin: 4,
    },
    chipActive: { backgroundColor: "#3865e0ff" },
    chipText: { color: "#fff", fontSize: 13 },
    confirm: {
        backgroundColor: "#3865e0ff",
        height: 56,
        borderRadius: 18,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10,
    },
    bookButton: { paddingVertical: 16, borderRadius: 16, alignItems: "center", marginTop: 32, },
});
