import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    ActivityIndicator,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Dimensions,
    SafeAreaView,
    Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { CarData } from "../../backend/firebase/carFirestore";
import { getCarWithOwnerName } from "../../backend/firebase/firestoreUser";
import { createBooking } from "../../backend/firebase/bookingsFirestore";

type RootStackParamList = {
    Confirmation: { carId: string };
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
    const { carId } = route.params;

    const [car, setCar] = useState<(CarData & { id: string; ownerName?: string }) | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);

    // Date pickers
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [endDate, setEndDate] = useState<Date>(new Date());
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);
    const [startMode, setStartMode] = useState<"date" | "time">("date");
    const [endMode, setEndMode] = useState<"date" | "time">("date");

    useEffect(() => {
        const fetchCar = async () => {
            const fetchedCar = await getCarWithOwnerName(carId);
            setCar(fetchedCar);
            setLoading(false);
        };
        fetchCar();
    }, [carId]);

    if (loading) return <ActivityIndicator size="large" style={styles.centered} color="#fff" />;
    if (!car) return <Text style={[styles.centered, { color: "#fff" }]}>Car not found</Text>;

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

    return (
        <SafeAreaView style={styles.background}>
            <ScrollView contentContainerStyle={{ paddingBottom: 70 }}>
                {/* Carousel */}
                <View style={styles.carouselContainer}>
                    <ScrollView
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onMomentumScrollEnd={ev => {
                            const index = Math.round(ev.nativeEvent.contentOffset.x / width);
                            setActiveImage(index);
                        }}
                    >
                        {carImages.map((img, i) => (
                            <Image key={i} source={img} style={styles.heroImage} />
                        ))}
                    </ScrollView>
                    <View style={styles.dotsContainer}>
                        {carImages.map((_, i) => (
                            <View key={i} style={[styles.dot, { opacity: i === activeImage ? 1 : 0.3 }]} />
                        ))}
                    </View>
                </View>

                {/* Car Info */}
                <View style={styles.carInfoContainer}>
                    <Text style={styles.header}>{car.make} {car.model}</Text>
                    {displayFields.map(({ key, label }) =>
                        car[key] !== undefined ? (
                            <View key={key} style={styles.infoRow}>
                                <Text style={styles.label}>{label}</Text>
                                <Text style={styles.value}>{car[key]?.toString()}</Text>
                            </View>
                        ) : null
                    )}
                </View>

                {/* Date Section */}
                <View style={styles.dateSection}>
                    <Text style={styles.dateHeader}>Select Start & End</Text>

                    <TouchableOpacity
                        style={styles.datePickerButton}
                        onPress={() => { setStartMode("date"); setShowStartPicker(true); }}
                    >
                        <Text style={styles.datePickerText}>Start: {formatDateTime(startDate)}</Text>
                    </TouchableOpacity>

                    {showStartPicker && (
                        <DateTimePicker
                            value={startDate}
                            mode={startMode}
                            display="inline"
                            themeVariant="dark"
                            minuteInterval={15}
                            textColor="#fff"
                            onChange={(event, selectedDate) => {
                                if (!selectedDate) { setShowStartPicker(false); return; }
                                if (startMode === "date") {
                                    setStartDate(prev => {
                                        const newDate = new Date(selectedDate.setHours(prev.getHours(), prev.getMinutes()));
                                        if (newDate > endDate) setEndDate(newDate);
                                        return newDate;
                                    });
                                    setStartMode("time");
                                    if (Platform.OS !== "ios") setShowStartPicker(true);
                                } else {
                                    setStartDate(selectedDate);
                                    if (selectedDate > endDate) setEndDate(selectedDate);
                                    setShowStartPicker(false);
                                }
                            }}
                        />
                    )}

                    <TouchableOpacity
                        style={styles.datePickerButton}
                        onPress={() => { setEndMode("date"); setShowEndPicker(true); }}
                    >
                        <Text style={styles.datePickerText}>End: {formatDateTime(endDate)}</Text>
                    </TouchableOpacity>

                    {showEndPicker && (
                        <DateTimePicker
                            value={endDate}
                            mode={endMode}
                            minimumDate={startDate}
                            display="inline"
                            themeVariant="dark"
                            minuteInterval={15}
                            textColor="#fff"
                            onChange={(event, selectedDate) => {
                                if (!selectedDate) { setShowEndPicker(false); return; }
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
                        <View style={styles.priceCard}>
                            <Text style={styles.priceText}>{dayCount} {dayCount === 1 ? "day" : "days"} × ${car.pricePerDay.toLocaleString()} per day</Text>
                            <Text style={[styles.priceText, { fontSize: 18 }]}>
                                Total: <Text style={{ fontWeight: "700", fontSize: 20 }}>${totalPrice}</Text>
                            </Text>
                        </View>
                    </View>
                </View>

                <TouchableOpacity style={styles.bookButton} onPress={handleBooking}>
                    <Text style={styles.bookText}>Book Now</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    background: { flex: 1, backgroundColor: "#1a1a1a" },
    centered: { flex: 1, justifyContent: "center", alignItems: "center" },

    carouselContainer: { width: "100%", height: 250 },
    heroImage: { width, height: 250 },
    dotsContainer: { position: "absolute", bottom: 10, left: 0, right: 0, flexDirection: "row", justifyContent: "center" },
    dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#fff", marginHorizontal: 4 },

    carInfoContainer: { marginHorizontal: 16, marginTop: 16, borderRadius: 14, padding: 16, backgroundColor: "#242424" },
    header: { fontSize: 28, fontWeight: "800", marginBottom: 16, color: "#fff" },
    infoRow: { flexDirection: "row", justifyContent: "space-between", marginVertical: 6 },
    label: { fontSize: 14, fontWeight: "600", color: "#C0C0C0" },
    value: { fontSize: 16, fontWeight: "700", color: "#fff" },

    dateSection: { marginHorizontal: 16, marginTop: 24, borderRadius: 14, padding: 16, backgroundColor: "#242424" },
    dateHeader: { fontSize: 16, fontWeight: "700", marginBottom: 8, color: "#fff" },
    datePickerButton: { paddingVertical: 12, paddingHorizontal: 16, borderRadius: 14, marginBottom: 12, backgroundColor: "#2e2e2e" },
    datePickerText: { fontSize: 16, fontWeight: "600", color: "#fff" },

    priceCard: { borderRadius: 14, padding: 16, width: "90%", backgroundColor: "#2e2e2eff", alignItems: "center" },
    priceText: { fontSize: 16, fontWeight: "600", color: "#C0C0C0", textAlign: "center" },

    bookButton: { paddingVertical: 16, borderRadius: 16, alignItems: "center", marginHorizontal: 16, marginTop: 32, backgroundColor: "#3865e0ff" },
    bookText: { color: "#fff", fontSize: 18, fontWeight: "700" },
});
