import React, { useState } from "react";
import {View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

type Props = { navigation: any };

export default function RentalSearchScreen({ navigation }: Props) {
    const [pickupDate, setPickupDate] = useState<Date | null>(null);
    const [dropoffDate, setDropoffDate] = useState<Date | null>(null);
    const [location, setLocation] = useState("");

    const [isPickupVisible, setPickupVisible] = useState(false);
    const [isDropoffVisible, setDropoffVisible] = useState(false);

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
                hour: "2-digit",
                minute: "2-digit",
            })
            : "";

    const confirmSelection = () => {
        if (!pickupDate || !dropoffDate || !location) {
            alert("Please select pickup, drop-off, and location.");
            return;
        }
        navigation.navigate("AvailableCars", {
            location,
            pickupDate: pickupDate.toISOString(),
            dropoffDate: dropoffDate.toISOString(),
        });
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
                            <Text style={styles.header}>SELECT INFO</Text>

                            {/* Cards row */}
                            <View style={styles.row}>
                                <TouchableOpacity
                                    style={[styles.card, styles.leftCard]}
                                    onPress={() => setPickupVisible(true)}
                                    activeOpacity={0.9}
                                >
                                    <Text style={styles.cardLabel}>PICKUP</Text>
                                    <Text style={styles.cardValue}>
                                        {pickupDate ? formatShort(pickupDate) : "Choose date & time"}
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.card}
                                    onPress={() => setDropoffVisible(true)}
                                    activeOpacity={0.9}
                                >
                                    <Text style={styles.cardLabel}>DROPOFF</Text>
                                    <Text style={styles.cardValue}>
                                        {dropoffDate ? formatShort(dropoffDate) : "Choose date & time"}
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            {/* PICKUP picker - Dark Mode  - 15 min intervals */}
                            <DateTimePickerModal
                                isVisible={isPickupVisible}
                                mode="datetime"
                                minuteInterval={15}
                                themeVariant="dark"
                                textColor="#fff"
                                isDarkModeEnabled
                                pickerContainerStyleIOS={{ backgroundColor: "#1c1c1e" }}
                                buttonTextColorIOS="#fff"
                                accentColor="#FFD400"
                                onConfirm={(date) => {
                                    const rounded = roundToInterval(date, 15);
                                    setPickupDate(rounded);
                                    setPickupVisible(false);
                                    if (dropoffDate && rounded >= dropoffDate) setDropoffDate(null);
                                }}
                                onCancel={() => setPickupVisible(false)}
                            />

                            {/* DROP OFF picker - Dark Mode  - 15 min intervals */}
                            <DateTimePickerModal
                                isVisible={isDropoffVisible}
                                mode="datetime"
                                minuteInterval={15}
                                minimumDate={pickupDate ?? undefined}
                                themeVariant="dark"
                                textColor="#fff"
                                isDarkModeEnabled
                                pickerContainerStyleIOS={{ backgroundColor: "#1c1c1e" }}
                                buttonTextColorIOS="#fff"
                                accentColor="#FFD400"
                                onConfirm={(date) => {
                                    const rounded = roundToInterval(date, 15);
                                    setDropoffDate(rounded);
                                    setDropoffVisible(false);
                                }}
                                onCancel={() => setDropoffVisible(false)}
                            />

                            {/* Location input field */}
                            <View style={styles.inputWrapper}>
                                <Text style={styles.cardLabel}>PICKUP LOCATION</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter city or postcode"
                                    placeholderTextColor="#9a9a9a"
                                    value={location}
                                    onChangeText={setLocation}
                                    returnKeyType="done"
                                />
                            </View>


                            {/* Confirm dates and location button */}
                            <View style={styles.confirmWrap}>
                                <TouchableOpacity
                                    style={styles.confirmButton}
                                    onPress={confirmSelection}
                                    activeOpacity={0.9}
                                >
                                    <Text style={styles.confirmText}>CONFIRM DATES & LOCATION</Text>
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
const GAP = 14;

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
    },

    content: {
        paddingHorizontal: SIDE,
        paddingTop: 24,
        paddingBottom: 36,
    },

    header: {
        fontSize: 28,
        fontWeight: "800",
        color: "#fff",
        textAlign: "center",
        letterSpacing: 2,
        marginBottom: 28,
    },

    row: {
        flexDirection: "row",
        width: "100%",
        marginBottom: 22,
    },

    card: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.82)",
        paddingVertical: 18,
        paddingHorizontal: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.06)",
        minHeight: 92,
        justifyContent: "center",
    },

    leftCard: {
        marginRight: GAP
    },

    cardLabel: {
        color: "#fff",
        fontSize: 13,
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

    confirmWrap: {
        marginTop: 8,
        paddingBottom: 16,
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
        letterSpacing: 1
    },
});

