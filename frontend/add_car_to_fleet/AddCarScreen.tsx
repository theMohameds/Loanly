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
import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as ImagePicker from "expo-image-picker";

type Props = { navigation: any };

export default function AddCarScreen({ navigation }: Props) {
    const [make, setMake] = useState("");
    const [model, setModel] = useState("");
    const [year, setYear] = useState("");
    const [licensePlate, setLicensePlate] = useState("");
    const [pricePerDay, setPricePerDay] = useState("");
    const [image, setImage] = useState<string | null>(null);

    const [availabilityStart, setAvailabilityStart] = useState<Date | null>(null);
    const [availabilityEnd, setAvailabilityEnd] = useState<Date | null>(null);
    const [isStartVisible, setStartVisible] = useState(false);
    const [isEndVisible, setEndVisible] = useState(false);

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

    const roundToInterval = (date: Date, interval = 15) => {
        const d = new Date(date);
        const ms = 1000 * 60 * interval;
        return new Date(Math.round(d.getTime() / ms) * ms);
    };

    const formatShort = (d: Date | null) =>
        d
            ? d.toLocaleString(undefined, {
                day: "2-digit",
                month: "short",
                year: "numeric",
            })
            : "";

    const confirmCar = () => {
        if (!make || !model || !year || !licensePlate || !pricePerDay || !availabilityStart || !availabilityEnd) {
            alert("Please fill in all fields.");
            return;
        }

        navigation.goBack();
        alert("Car added to fleet successfully!");
    };

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
                        <ScrollView
                            contentContainerStyle={styles.content}
                            bounces={false}
                            keyboardShouldPersistTaps="handled"
                        >
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
                                    <Text style={styles.uploadText}>
                                        {image ? "Change Image" : "Upload Image"}
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            {/* Car Make */}
                            <View style={styles.inputWrapper}>
                                <Text style={styles.cardLabel}>MAKE</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="e.g. Toyota"
                                    placeholderTextColor="#9a9a9a"
                                    value={make}
                                    onChangeText={setMake}
                                />
                            </View>

                            {/* Car Model */}
                            <View style={styles.inputWrapper}>
                                <Text style={styles.cardLabel}>MODEL</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="e.g. Corolla"
                                    placeholderTextColor="#9a9a9a"
                                    value={model}
                                    onChangeText={setModel}
                                />
                            </View>

                            {/* Car Year */}
                            <View style={styles.inputWrapper}>
                                <Text style={styles.cardLabel}>YEAR</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="e.g. 2020"
                                    placeholderTextColor="#9a9a9a"
                                    keyboardType="numeric"
                                    value={year}
                                    onChangeText={setYear}
                                />
                            </View>

                            {/* Car License Plate */}
                            <View style={styles.inputWrapper}>
                                <Text style={styles.cardLabel}>LICENSE PLATE</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="e.g. ABC-1234"
                                    placeholderTextColor="#9a9a9a"
                                    value={licensePlate}
                                    onChangeText={setLicensePlate}
                                />
                            </View>

                            {/* Price Per Day */}
                            <View style={styles.inputWrapper}>
                                <Text style={styles.cardLabel}>PRICE PER DAY</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="e.g. 350"
                                    placeholderTextColor="#9a9a9a"
                                    keyboardType="numeric"
                                    value={pricePerDay}
                                    onChangeText={setPricePerDay}
                                />
                            </View>

                            {/* Available Dates */}
                            <View style={styles.dateWrapper}>
                                <TouchableOpacity
                                    style={styles.card}
                                    onPress={() => setStartVisible(true)}
                                    activeOpacity={0.9}
                                >
                                    <Text style={styles.cardLabel}>AVAILABLE FROM</Text>
                                    <Text style={styles.cardValue}>
                                        {availabilityStart ? formatShort(availabilityStart) : "Choose start date"}
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.card}
                                    onPress={() => setEndVisible(true)}
                                    activeOpacity={0.9}
                                >
                                    <Text style={styles.cardLabel}>AVAILABLE UNTIL</Text>
                                    <Text style={styles.cardValue}>
                                        {availabilityEnd ? formatShort(availabilityEnd) : "Choose end date"}
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            {/* Date Pickers */}
                            <DateTimePickerModal
                                isVisible={isStartVisible}
                                mode="date"
                                themeVariant="dark"
                                textColor="#fff"
                                isDarkModeEnabled
                                pickerContainerStyleIOS={{ backgroundColor: "#1c1c1e" }}
                                buttonTextColorIOS="#fff"
                                accentColor="#FFD400"
                                onConfirm={(date) => {
                                    const rounded = roundToInterval(date);
                                    setAvailabilityStart(rounded);
                                    setStartVisible(false);
                                    if (availabilityEnd && rounded >= availabilityEnd) setAvailabilityEnd(null);
                                }}
                                onCancel={() => setStartVisible(false)}
                            />

                            <DateTimePickerModal
                                isVisible={isEndVisible}
                                mode="date"
                                minimumDate={availabilityStart ?? undefined}
                                themeVariant="dark"
                                textColor="#fff"
                                isDarkModeEnabled
                                pickerContainerStyleIOS={{ backgroundColor: "#1c1c1e" }}
                                buttonTextColorIOS="#fff"
                                accentColor="#FFD400"
                                onConfirm={(date) => {
                                    const rounded = roundToInterval(date);
                                    setAvailabilityEnd(rounded);
                                    setEndVisible(false);
                                }}
                                onCancel={() => setEndVisible(false)}
                            />

                            {/* Confirm button */}
                            <View style={styles.confirmWrap}>
                                <TouchableOpacity
                                    style={styles.confirmButton}
                                    onPress={confirmCar}
                                    activeOpacity={0.9}
                                >
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
    background: {
        flex: 1
    },

    imageStyle: {
        resizeMode: "cover"
    },

    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.7)"
    },

    content: {
        paddingHorizontal: SIDE,
        paddingTop: 24,
        paddingBottom: 36
    },

    header: {
        fontSize: 28,
        fontWeight: "800",
        color: "#fff",
        textAlign: "center",
        letterSpacing: 2,
        marginBottom: 28,
    },

    imageSection: {
        marginBottom: 24,
        alignItems: "center",
    },

    imagePlaceholder: {
        width: "100%",
        height: 180,
        borderRadius: 16,
        backgroundColor: "rgba(255,255,255,0.1)",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 10,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.1)",
    },

    imagePlaceholderText: {
        color: "#ccc",
        fontSize: 14,
    },

    carImage: {
        width: "100%",
        height: 180,
        borderRadius: 16,
        marginBottom: 10,
    },

    uploadButton: {
        backgroundColor: "#fff",
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 24,
    },

    uploadText: {
        color: "#000",
        fontSize: 16,
        fontWeight: "700",
    },

    cardLabel: {
        color: "#fff",
        fontSize: 13,
        marginBottom: 6,
        fontWeight: "700",
        letterSpacing: 0.5,
        alignSelf: "flex-start",
    },

    inputWrapper: {
        marginTop: 6,
        marginBottom: 18
    },

    input: {
        backgroundColor: "#fff",
        height: 56,
        paddingHorizontal: 16,
        borderRadius: 14,
        fontSize: 16,
        color: "#000",
        marginTop: 10,
    },

    dateWrapper: {
        width: "100%",
        marginBottom: 22
    },

    card: {
        width: "100%",
        backgroundColor: "rgba(0,0,0,0.82)",
        paddingVertical: 18,
        paddingHorizontal: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.06)",
        minHeight: 92,
        justifyContent: "center",
        marginBottom: 14,
    },

    cardValue: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "700"
    },

    confirmWrap: {
        marginTop: 8,
        paddingBottom: 16
    },

    confirmButton: {
        backgroundColor: "#fff",
        height: 58,
        borderRadius: 18,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.18,
        shadowRadius: 12,
        elevation: 6,
    },

    confirmText: {
        color: "#151515",
        fontSize: 18,
        fontWeight: "900",
        letterSpacing: 1,
    },
});
