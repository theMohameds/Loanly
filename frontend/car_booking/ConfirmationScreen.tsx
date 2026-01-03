import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    ActivityIndicator,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Platform,
    FlatList,
    Dimensions,
    SafeAreaView,
} from "react-native";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { CarData } from "../../backend/carFirestore";
import { getCarWithOwnerName } from "../../backend/firestoreUser";
import { createBooking } from "../../backend/bookingsFirestore";

type RootStackParamList = {
    Rental: undefined;
    AddCarStack: undefined;
    Confirmation: {
        carId: string;
        theme?: "light" | "dark";
    };
};


type ConfirmationScreenRouteProp = RouteProp<RootStackParamList, "Confirmation">;

const { width } = Dimensions.get("window");

const carImages = [
    require("../assets/audi-etron-gt.png"),
    require("../assets/ford-transit.png"),
    require("../assets/polestar-2.png"),
    require("../assets/tesla3.png"),
    require("../assets/test.png"),
    require("../assets/placeholderimage.png"),
];

export default function ConfirmationScreen() {
    const route = useRoute<ConfirmationScreenRouteProp>();
    const navigation = useNavigation();
    const { carId, theme = "dark" } = route.params;

    const [car, setCar] = useState<(CarData & { id: string; ownerName?: string }) | null>(null);
    const [loading, setLoading] = useState(true);

    const [startDate, setStartDate] = useState<Date>(new Date());
    const [endDate, setEndDate] = useState<Date>(new Date());
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);
    const [startMode, setStartMode] = useState<"date" | "time">("date");
    const [endMode, setEndMode] = useState<"date" | "time">("date");

    const [activeImage, setActiveImage] = useState(0);

    useEffect(() => {
        const fetchCar = async () => {
            const fetchedCar = await getCarWithOwnerName(carId);
            setCar(fetchedCar);
            setLoading(false);
        };
        fetchCar();
    }, [carId]);

    if (loading)
        return <ActivityIndicator size="large" style={styles.centered} color={theme === "dark" ? "#fff" : "#000"} />;
    if (!car) return <Text style={[styles.centered, { color: theme === "dark" ? "#fff" : "#000" }]}>Car not found</Text>;

    const displayFields: { key: keyof CarData | "ownerName"; label: string }[] = [
        { key: "make", label: "Make" },
        { key: "model", label: "Model" },
        { key: "trim", label: "Trim" },
        { key: "carType", label: "Type" },
        { key: "fuelType", label: "Fuel Type" },
        { key: "year", label: "Year" },
        { key: "seats", label: "Seats" },
        { key: "pricePerDay", label: "Price per Day" },
        { key: "pickupLocation", label: "Pickup Location" },
        { key: "dropoffLocation", label: "Dropoff Location" },
        { key: "ownerName", label: "Owner" },
        { key: "rating", label: "Rating" },
    ];

    const dayCount = Math.max(
        1,
        Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    );
    const totalPrice = car.pricePerDay * dayCount;

    const formatDateTime = (date: Date) => {
        const dd = String(date.getDate()).padStart(2, "0");
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        const yyyy = date.getFullYear();
        const hh = String(date.getHours()).padStart(2, "0");
        const min = String(Math.floor(date.getMinutes() / 15) * 15).padStart(2, "0");
        return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
    };

    const handleBooking = async () => {
        try {
            const bookingId = await createBooking({
                carId: car.id,
                ownerId: car.ownerId ?? "unknown",
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
                totalPrice,
            });
            alert(`Booking successful! ID: ${bookingId}`);
            navigation.goBack();
        } catch (err) {
            if (err instanceof Error) alert(err.message);
        }
    };

    const colors = theme === "dark"
        ? {
            background: "#1a1a1a",
            textPrimary: "#FFFFFF",
            textSecondary: "#C0C0C0",
            card: "#242424",
            card2: "#2e2e2eff",
            separator: "#3A3A3A",
            button: "#3865e0ff",
            backButtonOverlay: "rgba(0,0,0,0.35)",
            backButton: "#FFFFFF",
        }
        : {
            background: "#FFFFFF",
            textPrimary: "#1F2937",
            textSecondary: "#4B5563",
            card: "#F9FAFB",
            card2: "#242424",
            separator: "#E5E7EB",
            button: "#3865e0ff",
            backButtonOverlay: "rgba(255,255,255,0.8)",
            backButton: "#FFFFFF",
        };


    return (
        <SafeAreaView style={[styles.background, { backgroundColor: colors.background }]}>
            <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={{ paddingBottom: 70 }}>
                

                <View style={styles.carouselContainer}>
                    <FlatList
                        data={carImages}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onMomentumScrollEnd={ev => {
                            const index = Math.round(ev.nativeEvent.contentOffset.x / width);
                            setActiveImage(index);
                        }}
                        keyExtractor={(_, i) => i.toString()}
                        renderItem={({ item }) => <Image source={item} style={styles.heroImage} />}
                    />
                    <View style={styles.dotsContainer}>
                        {carImages.map((_, i) => (
                            <View key={i} style={[styles.dot, { opacity: i === activeImage ? 1 : 0.3 }]} />
                        ))}
                    </View>
                </View>

                
                <View style={[styles.carInfoContainer, { backgroundColor: colors.card }]}>
                    <Text style={[styles.header, { color: colors.textPrimary }]}>{car.make} {car.model}</Text>
                    {displayFields.map(({ key, label }) =>
                        car[key] !== undefined ? (
                            <View key={key} style={styles.infoRow}>
                                <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
                                <Text style={[styles.value, { color: colors.textPrimary }]}>{car[key]?.toString()}</Text>
                            </View>
                        ) : null
                    )}
                </View>

                
                <View style={[styles.dateSection, { backgroundColor: colors.card }]}>
                    <Text style={[styles.dateHeader, { color: colors.textPrimary }]}>Select Start & End</Text>
                    <View style={[styles.separator, { backgroundColor: colors.separator }]} />

                    <TouchableOpacity
                        style={[styles.datePickerButton, { backgroundColor: colors.card2 }]}
                        onPress={() => { setStartMode("date"); setShowStartPicker(true); }}
                    >
                        <Text style={[styles.datePickerText, { color: colors.textPrimary }]}>
                            Start: {formatDateTime(startDate)}
                        </Text>
                    </TouchableOpacity>

                    {showStartPicker && (
                        <DateTimePicker
                            value={startDate}
                            mode={startMode}
                            display="inline"
                            themeVariant={theme === "dark" ? "dark" : "light"}
                            minuteInterval={15}
                            textColor={theme === "dark" ? "#fff" : "#000"}
                            style={{
                                borderRadius: 14,
                                marginBottom: 10,
                                alignSelf: "center",
                                backgroundColor: "transparent",
                            }}
                            onChange={(event, selectedDate) => {
                                if (!selectedDate) {
                                    setShowStartPicker(false);
                                    return;
                                }

                                if (startMode === "date") {
                                    // Keep previous time
                                    setStartDate(prev => {
                                        const newDate = new Date(selectedDate.setHours(prev.getHours(), prev.getMinutes()));
                                        // if new start > current end, update end
                                        if (newDate > endDate) setEndDate(newDate);
                                        return newDate;
                                    });
                                    setStartMode("time");
                                    if (Platform.OS !== "ios") setShowStartPicker(true);
                                } else {
                                    setStartDate(selectedDate);
                                    // if new start > current end, update end
                                    if (selectedDate > endDate) setEndDate(selectedDate);
                                    setShowStartPicker(false);
                                }
                            }}
                        />
                    )}


                    <TouchableOpacity
                        style={[styles.datePickerButton, { backgroundColor: colors.card2 }]}
                        onPress={() => { setEndMode("date"); setShowEndPicker(true); }}
                    >
                        <Text style={[styles.datePickerText, { color: colors.textPrimary }]}>
                            End: {formatDateTime(endDate)}
                        </Text>
                    </TouchableOpacity>



                    {showEndPicker && (
                        <DateTimePicker
                            value={endDate}
                            mode={endMode}
                            minimumDate={startDate} 
                            display="inline"
                            themeVariant={theme === "dark" ? "dark" : "light"}
                            minuteInterval={15}
                            textColor={theme === "dark" ? "#fff" : "#000"}
                            style={{
                                borderRadius: 14,
                                marginBottom: 10,
                                alignSelf: "center",
                                backgroundColor: "transparent",
                            }}
                            onChange={(event, selectedDate) => {
                                if (!selectedDate) {
                                    setShowEndPicker(false);
                                    return;
                                }

                                if (endMode === "date") {
                                    setEndDate(prev => new Date(selectedDate.setHours(prev.getHours(), prev.getMinutes())));
                                    setEndMode("time");
                                    if (Platform.OS !== "ios") setShowEndPicker(true);
                                } else {
                                    setEndDate(selectedDate);
                                    setShowEndPicker(false);
                                }
                            }}
                        />
                    )}


                    <View style={{ alignItems: "center", marginTop: 16 }}>
                        <View style={[styles.priceCard, { backgroundColor: colors.card2 }]}>
                            <Text style={[styles.label, { fontSize: 16, color: colors.textSecondary, textAlign: "center" }]}>
                                {dayCount} {dayCount === 1 ? "day" : "days"} × ${car.pricePerDay.toLocaleString()} per day
                            </Text>
                            <Text style={[styles.label, { marginTop: 4, fontSize: 18, color: colors.textPrimary, textAlign: "center" }]}>
                                Total: <Text style={{ fontWeight: "700", fontSize: 20 }}>${totalPrice}</Text>
                            </Text>
                        </View>
                    </View>

                </View>

                
                <TouchableOpacity style={[styles.bookButton, { backgroundColor: colors.button }]} onPress={handleBooking}>
                    <Text style={{ color: "#fff", fontSize: 18, fontWeight: "700" }}>Book Now</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    priceCard: {
        borderRadius: 14,
        padding: 16,
        width: "90%",           
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    background: { flex: 1 },
    centered: { flex: 1, justifyContent: "center", alignItems: "center" },
    carouselContainer: { width: "100%", height: 250, position: "relative" },
    heroImage: { width: width, height: 250 },
    dotsContainer: { position: "absolute", bottom: 10, left: 0, right: 0, flexDirection: "row", justifyContent: "center" },
    dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#fff", marginHorizontal: 4 },
    backButton: { position: "absolute", top: 40, left: 16, padding: 8, borderRadius: 999, backgroundColor: "rgba(0,0,0,0.4)" },
    carInfoContainer: { marginHorizontal: 16, marginTop: 16, borderRadius: 14, padding: 16 },
    header: { fontSize: 28, fontWeight: "800", marginBottom: 16 },
    infoRow: { flexDirection: "row", justifyContent: "space-between", marginVertical: 6 },
    label: { fontSize: 14, fontWeight: "600" },
    value: { fontSize: 16, fontWeight: "700" },
    dateSection: { marginHorizontal: 16, marginTop: 24, borderRadius: 14, padding: 16 },
    dateHeader: { fontSize: 16, fontWeight: "700", marginBottom: 8 },
    separator: { height: 1, marginVertical: 12, borderRadius: 1 },
    datePickerButton: { paddingVertical: 12, paddingHorizontal: 16, borderRadius: 14, marginBottom: 12 },
    datePickerText: { fontSize: 16, fontWeight: "600" },
    bookButton: { paddingVertical: 16, borderRadius: 16, alignItems: "center", marginHorizontal: 16, marginTop: 32, },
});
