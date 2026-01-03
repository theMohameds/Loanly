import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    TextInput,
    useColorScheme,
    Pressable,
    Modal,
    ActivityIndicator,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { Ionicons, MaterialCommunityIcons, MaterialIcons, Octicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import PriceRangeSelector from './PriceRangeSelector';
import { CarData, getCarsByRating } from '../../backend/carFirestore';
import { QueryDocumentSnapshot } from 'firebase/firestore';
import * as Location from 'expo-location';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DateTimePickerModal from "react-native-modal-datetime-picker";
type RootStackParamList = {
    Rental: undefined;
    AddCarStack: undefined;
    Confirmation: {
        carId: string;
        theme?: "light" | "dark";
    };
};


type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Rental'>;

const lightTheme = {
    background: '#F8FAFC',
    primary: '#3B82F6',
    secondary: '#60A5FA',
    card: '#FFFFFF',
    textPrimary: '#1F2937',
    textSecondary: '#4B5563',
    inputBackground: '#F1F3F5',
    border: '#E5E7EB',
    backButtonOverlay: 'rgba(255,255,255,0.85)',
    textFilter: '#F9FAFB',
    textFilterBackground: '#D0E1FF',
    textFilterBackgroundActive: '#3865e0ff',
    textFilterActive: '#fff',
    textFilterReset: '#3865e0ff',
    textFilterButtonBackground: '#D0E1FF'
};

const darkTheme = {
    background: '#1B1B1B',
    primary: '#4F8EDC',
    secondary: '#3B82F6',
    card: '#242424',
    textPrimary: '#F9FAFB',
    textSecondary: '#A0AEC0',
    inputBackground: '#2C2C2C',
    border: '#3E3E3E',
    backButtonOverlay: 'rgba(0,0,0,0.35)',
    textFilter: '#000000ff',
    textFilterBackground: 'rgba(72, 72, 72, 1)',
    textFilterBackgroundActive: '#2e69c7ff',
    textFilterActive: '#fff',
    textFilterReset: '#ffffffff',
    textFilterButtonBackground: '#7d8696ff',
};




const Separator = ({ height = 2, color = '#E0E0E0', marginVertical = 8 }) => (
    <View style={{ height, backgroundColor: color, marginVertical, width: '100%' }} />
);

const carTypes = [
    { id: 1, name: 'Sedan' },
    { id: 2, name: 'SUV' },
    { id: 3, name: 'Hatchback' },
    { id: 4, name: 'Coupe' },
    { id: 5, name: 'Convertible' },
    { id: 6, name: 'Wagon' },
    { id: 7, name: 'Van' },
    { id: 8, name: 'Pickup Truck' },
    { id: 9, name: 'Crossover' },
    { id: 10, name: 'Minivan' },
];

const carFuel = [
    { id: 1, name: 'Electric' },
    { id: 2, name: 'Hybrid' },
    { id: 3, name: 'Plug-in Hybrid' },
    { id: 4, name: 'Petrol' },
    { id: 5, name: 'Diesel' },
    { id: 6, name: 'Hydrogen' },
    { id: 7, name: 'LPG' },
    { id: 8, name: 'CNG' },
    { id: 9, name: 'Flex Fuel' },
    { id: 10, name: 'Bio-Diesel' },
];

export default function HomeScreen() {
    const navigation = useNavigation<HomeScreenNavigationProp>();
    const scheme = useColorScheme();
    const theme = scheme === 'dark' ? lightTheme : darkTheme;

    // States
    const [cars, setCars] = useState<(CarData & { id: string })[]>([]);
    const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot | null>(null);
    const [loadingMore, setLoadingMore] = useState(false);

    const [searchText, setSearchText] = useState('');
    const [locationText, setLocationText] = useState('Anywhere');
    const [isFilterModalVisible, setFilterModalVisible] = useState(false);
    const [isLocationModalVisible, setLocationModalVisible] = useState(false);

    const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
    const [seatRange, setSeatRange] = useState<[number, number]>([0, 10]);
    const [minSeats, setMinSeats] = useState(0);
    const [minRating, setMinRating] = useState(0);
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [selectedFuel, setSelectedFuel] = useState<string[]>([]);
    const [modalContentWidth, setModalContentWidth] = useState(0);

    const [loadingLocation, setLoadingLocation] = useState(false);

    useEffect(() => {
        fetchInitialCars();
    }, []);

    const fetchInitialCars = async () => {
        try {
            const { cars: fetchedCars, lastDoc } = await getCarsByRating(20);
            setCars(fetchedCars);
            setLastDoc(lastDoc || null);
        } catch (err) {
            console.error('Failed to fetch cars:', err);
        }
    };

    const fetchMoreCars = async () => {
        if (loadingMore || !lastDoc) return;
        setLoadingMore(true);
        try {
            const { cars: newCars, lastDoc: newLastDoc } = await getCarsByRating(20, lastDoc);
            setCars(prev => [...prev, ...newCars]);
            setLastDoc(newLastDoc || null);
        } catch (err) {
            console.error('Failed to fetch more cars:', err);
        }
        setLoadingMore(false);
    };

    // GPS function
    const getCurrentCity = async () => {
        setLoadingLocation(true);
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                alert('Permission to access location was denied');
                setLoadingLocation(false);
                return;
            }
            const loc = await Location.getCurrentPositionAsync({});
            const [place] = await Location.reverseGeocodeAsync({
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude,
            });
            const cityName = place.city || place.region || place.country || 'Anywhere';
            setLocationText(cityName);
            setLocationModalVisible(false);
        } catch (err) {
            console.error(err);
            alert('Failed to get location');
        }
        setLoadingLocation(false);
    };

    // Filter helpers
    const toggleBrand = (brandName: string) => {
        setSelectedBrands(prev => (prev.includes(brandName) ? prev.filter(b => b !== brandName) : [...prev, brandName]));
    };
    const toggleFuel = (fuelName: string) => {
        setSelectedFuel(prev => (prev.includes(fuelName) ? prev.filter(f => f !== fuelName) : [...prev, fuelName]));
    };

    const renderStars = (rating: number) => {
        const fullStars = Math.floor(rating);
        const halfStar = rating - fullStars >= 0.5;
        const stars = [];
        for (let i = 0; i < fullStars; i++) stars.push(<Ionicons key={`f${i}`} name="star" size={14} color="#FFD700" />);
        if (halfStar) stars.push(<Ionicons key="half" name="star-half" size={14} color="#FFD700" />);
        while (stars.length < 5) stars.push(<Ionicons key={`e${stars.length}`} name="star-outline" size={14} color="#FFD700" />);
        return <View style={{ flexDirection: 'row' }}>{stars}</View>;
    };
    const displayLocation = locationText.trim() === '' ? 'Anywhere' : locationText;

    const filteredCars = cars.filter(car => {
        const name = `${car.make || ''} ${car.model || ''}`;
        const matchesSearch = name.toLowerCase().includes(searchText.toLowerCase());
        const matchesPrice = (car.pricePerDay || 0) >= priceRange[0] && (car.pricePerDay || 0) <= priceRange[1];
        const matchesSeats = (car.seats || 0) >= seatRange[0] && (car.seats || 0) <= seatRange[1];
        const matchesRating = (car.rating || 0) >= minRating;
        const matchesBrand = selectedBrands.length ? selectedBrands.includes(car.carType || '') : true;
        const matchesFuel = selectedFuel.length ? selectedFuel.includes(car.fuelType || '') : true;
        const matchesLocation =
            locationText.trim() === '' || locationText === 'Anywhere'
                ? true
                : car.pickupLocation?.toLowerCase().includes(locationText.toLowerCase());

        return matchesSearch && matchesPrice && matchesSeats && matchesRating && matchesBrand && matchesFuel && matchesLocation;
    });

    const insets = useSafeAreaInsets(); 
    const hasActiveFilters =
        searchText.trim() !== '' ||
        selectedBrands.length > 0 ||
        selectedFuel.length > 0 ||
        priceRange[0] !== 0 ||
        priceRange[1] !== 5000 ||
        seatRange[0] !== 0 ||
        seatRange[1] !== 10 ||
        minRating !== 0;

    const sectionTitle = hasActiveFilters ? 'Search Results' : 'Best Rated Cars';


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

        const combinedPickup = new Date(
            pickupDate!.getFullYear(),
            pickupDate!.getMonth(),
            pickupDate!.getDate(),
            pickupTime!.getHours(),
            pickupTime!.getMinutes()
        );

        const combinedDropoff = new Date(
            dropoffDate!.getFullYear(),
            dropoffDate!.getMonth(),
            dropoffDate!.getDate(),
            dropoffTime!.getHours(),
            dropoffTime!.getMinutes()
        );

        const diffMs = combinedDropoff.getTime() - combinedPickup.getTime();
        const diffHours = diffMs / (1000 * 60 * 60);

        if (combinedPickup.getTime() === combinedDropoff.getTime()) {
            alert("Pickup and dropoff time cannot be the same.");
            return;
        }

        if (diffHours < 0) {
            alert("Dropoff time must be after pickup time.");
            return;
        }

        if (diffHours < 1) {
            alert("Booking duration must be at least 1 hour.");
            return;
        }


    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            

            <View>
                <View style={styles.topRow}>
                    <Text style={[styles.logo, { color: theme.primary }]}>LOANLY</Text>
                </View>

                <View style={styles.locationRow}>
                    <Text style={[styles.locationLabel, { color: theme.textSecondary }]}>
                        Location
                    </Text>
                    <Text style={[styles.locationDot, { color: theme.textSecondary }]}>
                        ·
                    </Text>
                    <Text style={[styles.locationValue, { color: theme.primary }]}>
                        {displayLocation}
                    </Text>
                </View>
            </View>

            
            <View style={styles.searchWrapper}>
                <View style={[styles.searchContainer, { backgroundColor: theme.inputBackground }]}>
                    <MaterialIcons name="search" size={20} color={theme.textSecondary} style={styles.icon} />
                    <TextInput
                        value={searchText}
                        onChangeText={setSearchText}
                        style={[styles.searchInput, { color: theme.textPrimary }]}
                        placeholder="Search cars..."
                        placeholderTextColor={theme.textSecondary}
                    />
                </View>
                <Pressable
                    style={[styles.filterButton, { backgroundColor: theme.inputBackground }]}
                    onPress={() => setFilterModalVisible(true)}
                >
                    <Ionicons name="filter-sharp" size={20} color={theme.textSecondary} />
                </Pressable>
                <Pressable
                    style={[styles.filterButton, { backgroundColor: theme.inputBackground }]}
                    onPress={() => setLocationModalVisible(true)}
                >
                    <Ionicons name="location" size={20} color={theme.textSecondary} />
                </Pressable>
            </View>

            
            <Text style={[styles.sectionTitle, { color: theme.primary }]}>{sectionTitle}</Text>
            <FlatList
                data={filteredCars}
                keyExtractor={item => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
                onEndReached={fetchMoreCars}
                onEndReachedThreshold={0.5}
                renderItem={({ item }) => (
                    <Pressable
                        style={[styles.carCard, { backgroundColor: theme.card }]}
                        onPress={() =>
                            navigation.navigate("Confirmation", { carId: item.id, theme: "dark" })
                        }
                    >
                        <Image source={require('../assets/audi-etron-gt.png')} style={styles.carImage} resizeMode="cover" />
                        <View style={styles.carInfo}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text style={[styles.carName, { color: theme.textPrimary }]} numberOfLines={1}>
                                    {item.make} {item.model}
                                </Text>
                                <Text style={[styles.carPrice, { color: theme.primary }]}>${item.pricePerDay}/day</Text>
                            </View>
                            <Text style={[styles.carLocation, { color: theme.textSecondary }]} numberOfLines={1}>
                                {item.pickupLocation || locationText}
                            </Text>
                            <View style={styles.carSpecsRow}>
                                <View style={styles.specItem}>
                                    <Ionicons name="people-outline" size={18} color={theme.textSecondary} />
                                    <Text style={[styles.specText, { color: theme.textSecondary }]}>{item.seats || '-'}</Text>
                                </View>
                                <View style={styles.specItem}>
                                    <Ionicons name="car-outline" size={18} color={theme.textSecondary} />
                                    <Text style={[styles.specText, { color: theme.textSecondary }]}>{item.carType}</Text>
                                </View>
                                <View style={styles.specItem}>
                                    <MaterialCommunityIcons name="star" size={18} color="#FFD700" />
                                    <Text style={[styles.specText, { color: theme.textSecondary }]}>{item.rating || 0}</Text>
                                </View>
                            </View>
                        </View>
                    </Pressable>
                )}
            />


            <Modal
                visible={isLocationModalVisible}
                transparent
                animationType="none"
                //statusBarTranslucent
            >
                
                <Pressable
                    style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}
                    onPress={() => setLocationModalVisible(false)}
                >
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={{ flex: 1, }}>
                        <Pressable
                            onPress={() => { }}
                            style={[styles.modalContent, {
                                backgroundColor: theme.card,
                                paddingBottom: insets.bottom,
                            }]}
                        >

                            <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>
                                Search Location
                            </Text>

                            <TextInput
                                value={locationText === 'Anywhere' ? '' : locationText}
                                onChangeText={setLocationText}
                                placeholder="Type city..."
                                placeholderTextColor={theme.textSecondary}
                                style={[styles.locationInput, { backgroundColor: theme.inputBackground }]}
                            />

                            <Pressable
                                style={[styles.gpsButton, { backgroundColor: theme.textFilterBackgroundActive }]}
                                onPress={getCurrentCity}
                            >
                                {loadingLocation ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text style={{ color: '#fff', fontWeight: '600' }}>
                                        Use Current Location
                                    </Text>
                                )}
                            </Pressable>

                            <Pressable
                                style={[styles.applyButton2, { marginTop: 10, backgroundColor: theme.textFilterBackgroundActive }]}
                                onPress={() => setLocationModalVisible(false)}
                            >
                                <Text style={{ color: '#fff', fontWeight: '600' }}>Apply</Text>
                            </Pressable>

                        </Pressable>
                    </KeyboardAvoidingView>
                </Pressable>
            </Modal>




            
            <Modal
                visible={isFilterModalVisible}
                transparent
                animationType="none"
                statusBarTranslucent
            >
                <Pressable
                    style={styles.modalContainer}
                    onPress={() => setFilterModalVisible(false)}
                >
                    <Pressable
                        onPress={() => { }}
                        style={[
                            styles.modalContent,
                            {
                                backgroundColor: theme.card,
                                paddingBottom: insets.bottom + 20, 
                            },
                        ]}
                        onLayout={e => {
                            const { width } = e.nativeEvent.layout;
                            setModalContentWidth(width);
                        }}
                    >

                        <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>Filter</Text>
                        <Separator marginVertical={10} color="#CCC" />


                        <DateTimePickerModal
                            isVisible={isPickupDateVisible}
                            mode="date"
                            themeVariant={"dark"}

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


                        
                        <FlatList
                            data={carTypes}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={item => item.id.toString()}
                            renderItem={({ item }) => (
                                <Pressable
                                    style={[
                                        styles.brandOption,
                                        { backgroundColor: selectedBrands.includes(item.name) ? theme.textFilterBackgroundActive : theme.textFilterBackground }
                                    ]}
                                    onPress={() => toggleBrand(item.name)}
                                >
                                    <Text
                                        style={{
                                            color: selectedBrands.includes(item.name) ? theme.textFilter : theme.textPrimary,
                                        }}
                                    >
                                        {item.name}
                                    </Text>
                                </Pressable>
                            )}
                            contentContainerStyle={{ paddingVertical: 10 }}
                        />

                        
                        <FlatList
                            data={carFuel}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={item => item.id.toString()}
                            renderItem={({ item }) => (
                                <Pressable
                                    style={[
                                        styles.brandOption,
                                        { backgroundColor: selectedFuel.includes(item.name) ? theme.textFilterBackgroundActive : theme.textFilterBackground },
                                    ]}
                                    onPress={() => toggleFuel(item.name)}
                                >
                                    <Text
                                        style={{
                                            color: selectedFuel.includes(item.name) ? theme.textFilter : theme.textPrimary,
                                        }}
                                    >
                                        {item.name}
                                    </Text>
                                </Pressable>
                            )}
                            contentContainerStyle={{ paddingVertical: 10 }}
                        />

                        
                        <Text style={[styles.modalSectionTitle, { color: theme.textPrimary, marginBottom: 15 }]}>
                            Price Range
                        </Text>
                        <PriceRangeSelector
                            min={0}
                            max={5000}
                            sliderLength={modalContentWidth - 80}
                            value={priceRange}
                            text="$"
                            onChange={setPriceRange}
                        />

                        
                        <Text style={[styles.modalSectionTitle, { color: theme.textPrimary, marginTop: 15 }]}>
                            Minimum Seats: {minSeats}
                        </Text>
                        <PriceRangeSelector
                            min={1}
                            max={10}
                            step={1}
                            sliderLength={modalContentWidth - 80}
                            value={seatRange}
                            onChange={setSeatRange}
                        />

                        
                        <Text style={[styles.modalSectionTitle, { color: theme.textPrimary }]}>Minimum Rating</Text>
                        {modalContentWidth > 0 && (
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    width: modalContentWidth - 40,
                                }}
                            >
                                {Array.from({ length: 5 }, (_, i) => {
                                    const starNumber = i + 1;
                                    return (
                                        <Pressable
                                            key={i}
                                            style={{ flex: 1, alignItems: 'center' }}
                                            onPress={() =>
                                                setMinRating(prev => (prev === starNumber ? 0 : starNumber))
                                            }
                                        >
                                            <Ionicons
                                                name={starNumber <= minRating ? 'star' : 'star-outline'}
                                                size={32}
                                                color={starNumber <= minRating ? '#3865e0ff' : '#ccc'}
                                            />
                                        </Pressable>
                                    );
                                })}
                            </View>
                        )}

                        
                        <View style={styles.modalButtonsRow}>
                            <Pressable
                                style={[
                                    styles.clearButton,
                                    { backgroundColor: theme.textFilterButtonBackground, marginRight: 10 }
                                ]}
                                onPress={() => {
                                    setPriceRange([0, 5000]);
                                    setMinSeats(0);
                                    setMinRating(0);
                                    setSelectedBrands([]);
                                    setSelectedFuel([]);
                                }}
                            >
                                <Text style={{ color: theme.textFilterReset, fontWeight: '600' }}>Reset</Text>
                            </Pressable>

                            <Pressable
                                style={[styles.applyButton, { backgroundColor: theme.textFilterBackgroundActive }]}
                                onPress={() => setFilterModalVisible(false)}
                            >
                                <Text style={{ color: theme.textFilterActive, fontWeight: '600' }}>Apply</Text>
                            </Pressable>
                        </View>

                    </Pressable>
                </Pressable>
            </Modal>

        </View>
    );
}

const styles = StyleSheet.create({
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
    },

    locationLabel: {
        fontSize: 13,
        fontWeight: '500',
    },

    locationDot: {
        marginHorizontal: 6,
        fontSize: 14,
        fontWeight: '600',
    },

    locationValue: {
        fontSize: 15,
        fontWeight: '600',
    },

    container: { flex: 1, paddingTop: 40, paddingHorizontal: 20 },
    container2: { flex: 1, justifyContent: 'flex-end' },
    topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12 },
    logo: { fontSize: 36, fontWeight: '800', letterSpacing: 1.5 },
    tagline: { fontSize: 14, fontWeight: '500', marginBottom: 4 },
    searchWrapper: { flexDirection: 'row', alignItems: 'center', marginVertical: 10 },
    searchContainer: { flex: 1, flexDirection: 'row', alignItems: 'center', borderRadius: 12, paddingHorizontal: 12, height: 44 },
    searchInput: { flex: 1, fontSize: 16, paddingVertical: 8 },
    icon: { marginRight: 8 },
    filterButton: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginLeft: 8 },
    sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8, marginTop: 16 },
    carCard: { width: '100%', borderRadius: 16, overflow: 'hidden', elevation: 3, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, marginBottom: 16 },
    carImage: { width: '100%', height: 160, borderTopLeftRadius: 16, borderTopRightRadius: 16 },
    carInfo: { padding: 12 },
    carName: { fontSize: 18, fontWeight: '700' },
    carLocation: { fontSize: 13, marginTop: 4 },
    carPrice: { fontSize: 16, fontWeight: '600' },
    carSpecsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
    specItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    specText: { fontSize: 12 },
    locationContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 10 },
    locationText: { marginLeft: 4, fontSize: 14, fontWeight: '600' },
    modalContainer: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
    modalContent: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        maxHeight: '80%',
        paddingTop: 30,
        paddingBottom: 20,
        paddingHorizontal: 20,
        borderTopRightRadius: 24,
        borderTopLeftRadius: 24,
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 1)'
    },
    modalTitle: { fontSize: 22, fontWeight: '700', marginBottom: 10 },
    locationInput: { width: '100%', borderRadius: 12, padding: 12, fontSize: 16, marginTop: 10, marginBottom: 10, color: '#111' },
    gpsButton: { width: '100%', paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginBottom: 10, elevation: 2 },
    applyButton2: { width: '100%', paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginBottom: 10, elevation: 2 },
    modalSectionTitle: { fontSize: 19, fontWeight: '600', marginTop: 5, marginBottom: 12 },
    brandsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
    brandOption: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12, marginRight: 8, marginBottom: 8 },
    modalButtonsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 },
    clearButton: { flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
    applyButton: { flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
});

