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
import { addCar } from "../../backend/database/carsDB";
import { Car } from "../../backend/types/Car";

type Props = { navigation: any };

export default function AddCarScreen({ navigation }: Props) {
    const [make, setMake] = useState("");
    const [model, setModel] = useState("");
    const [trim, setTrim] = useState("");
    const [carType, setCarType] = useState("");
    const [fuelType, setFuelType] = useState("");
    const [year, setYear] = useState("");
    const [seats, setSeats] = useState("");
    const [pricePerDay, setPricePerDay] = useState("");
    const [pickupLocation, setPickupLocation] = useState("");
    const [dropoffLocation, setDropoffLocation] = useState("");
    const [image, setImage] = useState<string | null>(null);

    const [errors, setErrors] = useState({
        make: false,
        model: false,
        trim: false,
        carType: false,
        fuelType: false,
        year: false,
        seats: false,
        pricePerDay: false,
        pickupLocation: false,
        dropoffLocation: false,
    });

    const pickImage = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
            alert("Permission to access media library is required!");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const confirmCar = async () => {
        const newErrors = {
            make: !make,
            model: !model,
            trim: !trim,
            carType: !carType,
            fuelType: !fuelType,
            year: !year,
            seats: !seats,
            pricePerDay: !pricePerDay,
            pickupLocation: !pickupLocation,
            dropoffLocation: !dropoffLocation,
        };
        setErrors(newErrors);

        if (Object.values(newErrors).some(Boolean)) {
            alert("Please fill in all required fields.");
            return;
        }

        try {
            const newCar: Car = {
                make,
                model,
                trim,
                carType,
                fuelType,
                year: parseInt(year),
                seats: parseInt(seats),
                pricePerDay: parseFloat(pricePerDay),
                pickupLocation,
                dropoffLocation,
            };

            await addCar(newCar);
            alert("Car added to fleet successfully!");
            navigation.goBack();
        } catch (error) {
            console.error("Failed to add car:", error);
            alert("Error saving car.");
        }
    };

    const fields = [
        { label: "MAKE", value: make, setter: setMake, numeric: false },
        { label: "MODEL", value: model, setter: setModel, numeric: false },
        { label: "TRIM", value: trim, setter: setTrim, numeric: false },
        { label: "CAR TYPE", value: carType, setter: setCarType, numeric: false },
        { label: "FUEL TYPE", value: fuelType, setter: setFuelType, numeric: false },
        { label: "YEAR", value: year, setter: setYear, numeric: true },
        { label: "SEATS", value: seats, setter: setSeats, numeric: true },
        { label: "PRICE PER DAY", value: pricePerDay, setter: setPricePerDay, numeric: true },
        { label: "PICKUP LOCATION", value: pickupLocation, setter: setPickupLocation, numeric: false },
        { label: "DROPOFF LOCATION", value: dropoffLocation, setter: setDropoffLocation, numeric: false },
    ];

    return (
        <ImageBackground
            source={require("../assets/background.png")}
            style={styles.background}
            imageStyle={styles.imageStyle}
        >
            <View style={styles.overlay}>
                <SafeAreaView style={{ flex: 1 }}>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? "padding" : undefined}
                        style={{ flex: 1 }}
                    >
                        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
                            <Text style={styles.header}>ADD CAR</Text>

                            {/* Upload Image */}
                            <View style={styles.imageSection}>
                                <Text style={styles.cardLabel}>CAR IMAGE</Text>
                                {image ? (
                                    <Image source={{ uri: image }} style={styles.carImage} />
                                ) : (
                                    <View style={styles.imagePlaceholder}>
                                        <Text style={styles.imagePlaceholderText}>No image selected</Text>
                                    </View>
                                )}
                                <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
                                    <Text style={styles.uploadText}>{image ? "Change Image" : "Upload Image"}</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Inputs */}
                            {fields.map((field) => (
                                <View key={field.label} style={styles.inputWrapper}>
                                    <Text style={styles.cardLabel}>{field.label}</Text>
                                    <TextInput
                                        style={[
                                            styles.input,
                                            errors[field.label.replace(" ", "").toLowerCase() as keyof typeof errors] && styles.inputError,
                                        ]}
                                        placeholder={`Enter ${field.label.toLowerCase()}`}
                                        placeholderTextColor="#9a9a9a"
                                        value={field.value}
                                        onChangeText={(text) => {
                                            field.setter(text);
                                            setErrors((prev) => ({
                                                ...prev,
                                                [field.label.replace(" ", "").toLowerCase()]: false,
                                            }));
                                        }}
                                        keyboardType={field.numeric ? "numeric" : "default"}
                                    />
                                </View>
                            ))}

                            {/* Confirm Button */}
                            <View style={styles.confirmWrap}>
                                <TouchableOpacity style={styles.confirmButton} onPress={confirmCar} activeOpacity={0.9}>
                                    <Text style={styles.confirmText}>ADD CAR TO FLEET</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </KeyboardAvoidingView>
                </SafeAreaView>
            </View>
        </ImageBackground>
    );
}

const SIDE = 24;

const styles = StyleSheet.create({
    background: { flex: 1 },
    imageStyle: { resizeMode: "cover" },
    overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.7)" },
    content: { paddingHorizontal: SIDE, paddingTop: 24, paddingBottom: 36 },
    header: { fontSize: 28, fontWeight: "800", color: "#fff", textAlign: "center", letterSpacing: 2, marginBottom: 28 },
    imageSection: { marginBottom: 24, alignItems: "center" },
    imagePlaceholder: { width: "100%", height: 180, borderRadius: 16, backgroundColor: "rgba(255,255,255,0.1)", alignItems: "center", justifyContent: "center", marginBottom: 10, borderWidth: 1, borderColor: "rgba(255,255,255,0.1)" },
    imagePlaceholderText: { color: "#ccc", fontSize: 14 },
    carImage: { width: "100%", height: 180, borderRadius: 16, marginBottom: 10 },
    uploadButton: { backgroundColor: "#fff", borderRadius: 12, paddingVertical: 12, paddingHorizontal: 24 },
    uploadText: { color: "#000", fontSize: 16, fontWeight: "700" },
    cardLabel: { color: "#fff", fontSize: 13, marginBottom: 6, fontWeight: "700", letterSpacing: 0.5, alignSelf: "flex-start" },
    inputWrapper: { marginTop: 6, marginBottom: 18 },
    input: { backgroundColor: "#303030ff", height: 56, paddingHorizontal: 16, borderRadius: 14, fontSize: 16, color: "#fff", marginTop: 10, borderWidth: 2, borderColor: "#303030ff" },
    inputError: { borderColor: "#FF5A5F" },
    confirmWrap: { marginTop: 8, paddingBottom: 16 },
    confirmButton: { backgroundColor: "#0088FF", height: 58, borderRadius: 18, alignItems: "center", justifyContent: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.18, shadowRadius: 12, elevation: 6 },
    confirmText: { color: "#fff", fontSize: 18, fontWeight: "900", letterSpacing: 1 },
});
