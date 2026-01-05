import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    TextInput,
    Pressable,
    useColorScheme,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CarData, getAvailableCars, getCarsByRating } from '../../backend/firebase/carFirestore';
import { QueryDocumentSnapshot } from 'firebase/firestore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LocationModal from './LocationModal';
import FilterModal from './FilterModal';

type RootStackParamList = {
    Rental: undefined;
    Confirmation: {
        carId: string;
        pickupDate: string | null;
        dropoffDate: string | null;
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

export default function HomeScreen() {
    const navigation = useNavigation<HomeScreenNavigationProp>();
    const scheme = useColorScheme();
    const theme = scheme === 'dark' ? lightTheme : darkTheme;
    const insets = useSafeAreaInsets();

    const [cars, setCars] = useState<(CarData & { id: string })[]>([]);
    const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot | null>(null);
    const [loadingMore, setLoadingMore] = useState(false);

    const [searchText, setSearchText] = useState('');
    const [locationText, setLocationText] = useState('Anywhere');
    const [isFilterModalVisible, setFilterModalVisible] = useState(false);
    const [isLocationModalVisible, setLocationModalVisible] = useState(false);

    const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
    const [seatRange, setSeatRange] = useState<[number, number]>([0, 10]);
    const [minRating, setMinRating] = useState(0);
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [selectedFuel, setSelectedFuel] = useState<string[]>([]);

    const [pickupDate, setPickupDate] = useState<string | null>(null);
    const [dropoffDate, setDropoffDate] = useState<string | null>(null);

    useFocusEffect(
        useCallback(() => {
            let isActive = true;

            const fetchCarsByDate = async () => {
                try {
                    if (pickupDate && dropoffDate) {
                        const availableCars = await getAvailableCars(pickupDate, dropoffDate);
                        if (isActive) setCars(availableCars);
                    } else {
                        const { cars: fetchedCars, lastDoc } = await getCarsByRating(5);
                        if (isActive) {
                            setCars(fetchedCars);
                            setLastDoc(lastDoc || null);
                        }
                    }
                } catch (err) {
                    console.error(err);
                }
            };

            fetchCarsByDate();

            return () => {
                isActive = false;
            };
        }, [pickupDate, dropoffDate])
    );


    const fetchMoreCars = async () => {
        if (loadingMore || !lastDoc) return;
        setLoadingMore(true);
        try {
            const { cars: newCars, lastDoc: newLastDoc } = await getCarsByRating(3, lastDoc);
            const uniqueNewCars = newCars.filter(nc => !cars.some(c => c.id === nc.id));
            setCars(prev => [...prev, ...uniqueNewCars]);
            setLastDoc(newLastDoc || null);
        } catch (err) {
            console.error('Failed to fetch more cars:', err);
        }
        setLoadingMore(false);
    };



    const filteredCars = useMemo(() => {
        const query = searchText.toLowerCase();
        return cars.filter(car => {
            const name = `${car.make || ''} ${car.model || ''}`.toLowerCase();
            const matchesSearch = name.includes(query);
            const matchesPrice = (car.pricePerDay || 0) >= priceRange[0] && (car.pricePerDay || 0) <= priceRange[1];
            const matchesSeats = (car.seats || 0) >= seatRange[0] && (car.seats || 0) <= seatRange[1];
            const matchesRating = (car.rating || 0) >= minRating;
            const matchesBrand = selectedBrands.length ? selectedBrands.includes(car.carType || '') : true;
            const matchesFuel = selectedFuel.length ? selectedFuel.includes(car.fuelType || '') : true;
            const matchesLocation = locationText === '' || locationText === 'Anywhere'
                ? true
                : car.pickupLocation?.toLowerCase().includes(locationText.toLowerCase());
            return matchesSearch && matchesPrice && matchesSeats && matchesRating &&
                matchesBrand && matchesFuel && matchesLocation;
        });
    }, [cars, searchText, priceRange, seatRange, minRating, selectedBrands, selectedFuel, locationText]);

    const hasActiveFilters = useMemo(() => {
        return searchText.trim() || selectedBrands.length || selectedFuel.length ||
            priceRange[0] !== 0 || priceRange[1] !== 5000 ||
            seatRange[0] !== 0 || seatRange[1] !== 10 ||
            minRating !== 0 || pickupDate || dropoffDate;
    }, [searchText, selectedBrands, selectedFuel, priceRange, seatRange, minRating, pickupDate, dropoffDate]);

    const sectionTitle = hasActiveFilters ? 'Search Results' : 'Best Rated Cars';
    const displayLocation = locationText.trim() === '' ? 'Anywhere' : locationText;

    return (
        <View style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top + 20 }]}>

            <View style={styles.topRow}>
                <Text style={[styles.logo, { color: theme.primary }]}>LOANLY</Text>
            </View>

            <View style={styles.locationRow}>
                <Text style={[styles.locationLabel, { color: theme.textSecondary }]}>Location</Text>
                <Text style={[styles.locationDot, { color: theme.textSecondary }]}>·</Text>
                <Text style={[styles.locationValue, { color: theme.primary }]}>{displayLocation}</Text>
                {pickupDate && dropoffDate && (
                    <>
                        <Text style={[styles.locationDot, { color: theme.textSecondary, marginHorizontal: 4 }]}>·</Text>
                        <Text style={[styles.locationValue, { color: theme.primary }]}>
                            {new Date(pickupDate).toLocaleDateString()} → {new Date(dropoffDate).toLocaleDateString()}
                        </Text>
                    </>
                )}
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
                <Pressable style={[styles.filterButton, { backgroundColor: theme.inputBackground }]} onPress={() => setFilterModalVisible(true)}>
                    <Ionicons name="filter-sharp" size={20} color={theme.textSecondary} />
                </Pressable>
                <Pressable style={[styles.filterButton, { backgroundColor: theme.inputBackground }]} onPress={() => setLocationModalVisible(true)}>
                    <Ionicons name="location" size={20} color={theme.textSecondary} />
                </Pressable>
            </View>

            <Text style={[styles.sectionTitle, { color: theme.primary }]}>{sectionTitle}</Text>

            <FlatList
                data={filteredCars}
                keyExtractor={item => item.id.toString()}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
                onEndReached={fetchMoreCars}
                onEndReachedThreshold={0.5}
                renderItem={({ item }) => (
                    <Pressable
                        key={item.id}
                        style={[styles.carCard, { backgroundColor: theme.card }]}
                        onPress={() =>
                            navigation.navigate('Confirmation', {
                                carId: item.id,
                                pickupDate,
                                dropoffDate,
                            })
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

            <LocationModal
                visible={isLocationModalVisible}
                setVisible={setLocationModalVisible}
                locationText={locationText}
                setLocationText={setLocationText}
                theme={theme}
            />

            <FilterModal
                visible={isFilterModalVisible}
                setVisible={setFilterModalVisible}
                theme={theme}
                selectedBrands={selectedBrands}
                setSelectedBrands={setSelectedBrands}
                selectedFuel={selectedFuel}
                setSelectedFuel={setSelectedFuel}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                seatRange={seatRange}
                setSeatRange={setSeatRange}
                minRating={minRating}
                setMinRating={setMinRating}
                pickupDate={pickupDate}
                setPickupDate={setPickupDate}
                dropoffDate={dropoffDate}
                setDropoffDate={setDropoffDate}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, paddingHorizontal: 20 },
    topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12 },
    logo: { fontSize: 36, fontWeight: '800', letterSpacing: 1.5 },
    locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
    locationLabel: { fontSize: 13, fontWeight: '500' },
    locationDot: { marginHorizontal: 6, fontSize: 14, fontWeight: '600' },
    locationValue: { fontSize: 15, fontWeight: '600' },
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
    searchWrapper: { flexDirection: 'row', alignItems: 'center', marginVertical: 10 },
    searchContainer: { flex: 1, flexDirection: 'row', alignItems: 'center', borderRadius: 12, paddingHorizontal: 12, height: 44 },
    searchInput: { flex: 1, fontSize: 16, paddingVertical: 8 },
});
