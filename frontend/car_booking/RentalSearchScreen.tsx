import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Appearance } from "react-native";

const colorScheme = Appearance.getColorScheme(); // 'dark' or 'light'
type Props = { navigation: any };

export default function RentalSearchScreen({ navigation }: Props) {
    const [location, setLocation] = useState("");

    // Date states
    const [pickupDate, setPickupDate] = useState<Date | null>(null);
    const [dropoffDate, setDropoffDate] = useState<Date | null>(null);

    // Time states
    const [pickupTime, setPickupTime] = useState<Date | null>(null);
    const [dropoffTime, setDropoffTime] = useState<Date | null>(null);

    // Modal visibility
    const [isPickupDateVisible, setPickupDateVisible] = useState(false);
    const [isDropoffDateVisible, setDropoffDateVisible] = useState(false);
    const [isPickupTimeVisible, setPickupTimeVisible] = useState(false);
    const [isDropoffTimeVisible, setDropoffTimeVisible] = useState(false);

    // Error states
    const [errors, setErrors] = useState({
        location: false,
        dateBox: false,
        timeBox: false,
    });

    const roundToInterval = (date: Date, interval = 15) => {
        const d = new Date(date);
        const ms = 1000 * 60 * interval;
        return new Date(Math.round(d.getTime() / ms) * ms);
    };

    const formatDate = (d: Date | null) =>
        d ? d.toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" }) : "";

    const formatTime = (d: Date | null) =>
        d ? d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" }) : "";

    const confirmSelection = () => {
    const newErrors = {
        location: !location,
        dateBox: !pickupDate || !dropoffDate,
        timeBox: !pickupTime || !dropoffTime,
    };
    setErrors(newErrors);

    if (Object.values(newErrors).some(Boolean)) return;

    // Combine date + time
    const combinedPickup = new Date(
        pickupDate!.getFullYear(),
        pickupDate!.getMonth(),
        pickupDate!.getDate(),
        pickupTime!.getHours(),
        pickupTime!.getMinutes()
    ).toISOString();

    const combinedDropoff = new Date(
        dropoffDate!.getFullYear(),
        dropoffDate!.getMonth(),
        dropoffDate!.getDate(),
        dropoffTime!.getHours(),
        dropoffTime!.getMinutes()
    ).toISOString();

    navigation.navigate("AvailableCars", {
        location,
        pickupDate: combinedPickup,
        dropoffDate: combinedDropoff,
    });
};


    return (
        <View style={styles.overlay}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={styles.content}
                    bounces={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Location input field */}
                    <View style={styles.inputWrapper}>
                        <Text style={styles.cardLabel}>Pickup Location</Text>
                        <TextInput
                            style={[styles.input, errors.location && styles.inputError]}
                            placeholder="Enter city or postcode"
                            placeholderTextColor="#9a9a9a"
                            value={location}
                            onChangeText={(text) => {
                                setLocation(text);
                                if (text) setErrors((prev) => ({ ...prev, location: false }));
                            }}
                            returnKeyType="done"
                        />
                    </View>

                    {/* Date pickers */}
                    <View
                        style={[
                            styles.boxDate,
                            errors.dateBox && styles.boxError, // 🔴 full red border if invalid
                        ]}
                    >
                        <TouchableOpacity
                            style={styles.card}
                            onPress={() => setPickupDateVisible(true)}
                            activeOpacity={0.9}
                        >
                            <Text style={styles.cardLabel}>PICKUP DATE</Text>
                            <Text style={styles.cardValue}>
                                {pickupDate ? formatDate(pickupDate) : "Choose date"}
                            </Text>
                        </TouchableOpacity>

                        <View style={styles.separator} />

                        <TouchableOpacity
                            style={styles.card}
                            onPress={() => setDropoffDateVisible(true)}
                            activeOpacity={0.9}
                        >
                            <Text style={styles.cardLabel}>DROPOFF DATE</Text>
                            <Text style={styles.cardValue}>
                                {dropoffDate ? formatDate(dropoffDate) : "Choose date"}
                            </Text>
                        </TouchableOpacity>
                    </View>










                    {/* Time pickers */}
                    <View
                        style={[
                            styles.boxTime,
                            errors.timeBox && styles.boxError, // 🔴 full red border if invalid
                        ]}
                    >
                        <TouchableOpacity
                            style={styles.card}
                            onPress={() => setPickupTimeVisible(true)}
                            activeOpacity={0.9}
                        >
                            <Text style={styles.cardLabel}>PICKUP TIME</Text>
                            <Text style={styles.cardValue}>
                                {pickupTime ? formatTime(pickupTime) : "Choose time"}
                            </Text>
                        </TouchableOpacity>

                        <View style={styles.separator} />

                        <TouchableOpacity
                            style={styles.card}
                            onPress={() => setDropoffTimeVisible(true)}
                            activeOpacity={0.9}
                        >
                            <Text style={styles.cardLabel}>DROPOFF TIME</Text>
                            <Text style={styles.cardValue}>
                                {dropoffTime ? formatTime(dropoffTime) : "Choose time"}
                            </Text>
                        </TouchableOpacity>
                    </View>








                    {/* === DATE PICKERS === */}
                    <DateTimePickerModal
                        isVisible={isPickupDateVisible}
                        mode="date"
                        themeVariant={colorScheme === "dark" ? "dark" : "light"}
                        isDarkModeEnabled={colorScheme === "dark"}
                        textColor="#fff"
                        accentColor="#FFD400"
                        buttonTextColorIOS="#ffffffff"
                        pickerContainerStyleIOS={{ backgroundColor: "#1c1c1e" }}
                        onConfirm={(date) => {
                            setPickupDate(date);
                            setPickupDateVisible(false);
                        }}
                        onCancel={() => setPickupDateVisible(false)}
                    />

                    <DateTimePickerModal
                        isVisible={isDropoffDateVisible}
                        mode="date"
                        minimumDate={pickupDate ?? undefined}
                        themeVariant={colorScheme === "dark" ? "dark" : "light"}
                        isDarkModeEnabled={colorScheme === "dark"}
                        textColor="#fff"
                        accentColor="#FFD400"
                        buttonTextColorIOS="#ffffffff"
                        pickerContainerStyleIOS={{ backgroundColor: "#1c1c1e" }}
                        // Dropoff date
                        onConfirm={(date) => {
                            setDropoffDate(date);
                            setDropoffDateVisible(false);
                        }}
                        onCancel={() => setDropoffDateVisible(false)}
                    />







                    {/* === TIME PICKERS === */}
                    <DateTimePickerModal
                        isVisible={isPickupTimeVisible}
                        mode="time"
                        minuteInterval={15}
                        themeVariant={colorScheme === "dark" ? "dark" : "light"}
                        isDarkModeEnabled={colorScheme === "dark"}
                        textColor="#fff"
                        accentColor="#FFD400"
                        buttonTextColorIOS="#ffffffff"
                        pickerContainerStyleIOS={{ backgroundColor: "#1c1c1e" }}
                        onConfirm={(time) => {
                            const rounded = roundToInterval(time, 15);
                            setPickupTime(rounded);
                            setPickupTimeVisible(false);
                        }}
                        onCancel={() => setPickupTimeVisible(false)}
                    />

                    <DateTimePickerModal
                        isVisible={isDropoffTimeVisible}
                        mode="time"
                        minuteInterval={15}
                        minimumDate={pickupDate ?? undefined}
                        themeVariant={colorScheme === "dark" ? "dark" : "light"}
                        isDarkModeEnabled={colorScheme === "dark"}
                        textColor="#fff"
                        accentColor="#f5f5f5ff"
                        buttonTextColorIOS="#ffffffff"
                        pickerContainerStyleIOS={{ backgroundColor: "#1c1c1e" }}
                        onConfirm={(time) => {
                            const rounded = roundToInterval(time, 15);
                            setDropoffTime(rounded);
                            setDropoffTimeVisible(false);
                        }}
                        onCancel={() => setDropoffTimeVisible(false)}
                    />




                    {/* Confirm Button */}
                    <View style={styles.confirmWrap}>
                        <TouchableOpacity
                            style={styles.confirmButton}
                            onPress={confirmSelection}
                            activeOpacity={0.9}
                        >
                            <Text style={styles.confirmText}>CONFIRM DATES & TIMES</Text>
                        </TouchableOpacity>
                    </View>





                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const SIDE = 24;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "#212121ff",
    },
    content: {
        paddingHorizontal: SIDE,
        paddingTop: 24,
        paddingBottom: 36,
    },
    boxDate: {
        backgroundColor: "#303030ff",
        borderRadius: 16,
        marginBottom: 20,
        borderWidth: 2,
        borderColor: "#303030ff"
    },
    boxTime: {
        backgroundColor: "#303030ff",
        borderRadius: 16,
        marginBottom: 20,
        borderWidth: 2,
        borderColor: "#303030ff"
    },
    boxError: {
        borderWidth: 2,
        borderColor: "#FF5A5F",
    },
    separator: {
        height: 2,
        backgroundColor: "#858585ff",
        width: "92%",
        alignSelf: "center",
        borderRadius: 50,
    },
    card: {
        width: "100%",
        paddingVertical: 18,
        paddingHorizontal: 16,
        minHeight: 75,
        justifyContent: "center",
    },
    cardLabel: {
        color: "#fff",
        fontSize: 14,
        marginBottom: 6,
        fontWeight: "700",
        letterSpacing: 0.5,
    },
    cardValue: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "700",
    },
    inputWrapper: {
        marginTop: 6,
        marginBottom: 20,
    },
    input: {
        backgroundColor: "#303030ff",
        height: 56,
        paddingHorizontal: 16,
        borderRadius: 14,
        fontSize: 16,
        color: "#ffffffff",
        marginTop: 10,
        borderWidth: 2,
        borderColor: "#303030ff"
    },
    inputError: {
        borderWidth: 2,
        borderColor: "#FF5A5F",
    },
    confirmWrap: {
        marginTop: 8,
        paddingBottom: 16,
    },
    confirmButton: {
        backgroundColor: "#0088FF",
        height: 54,
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
        color: "#ffffffff",
        fontSize: 16,
        fontWeight: "900",
        letterSpacing: 1,
    },
});
