import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Pressable,
    FlatList,
    Modal,
    StyleSheet,
    useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PriceRangeSelector from './PriceRangeSelector';

interface FilterModalProps {
    visible: boolean;
    setVisible: (visible: boolean) => void;
    priceRange: [number, number];
    setPriceRange: React.Dispatch<React.SetStateAction<[number, number]>>;
    seatRange: [number, number];
    setSeatRange: React.Dispatch<React.SetStateAction<[number, number]>>;
    minRating: number;
    setMinRating: React.Dispatch<React.SetStateAction<number>>;
    selectedBrands: string[];
    setSelectedBrands: React.Dispatch<React.SetStateAction<string[]>>;
    selectedFuel: string[];
    setSelectedFuel: React.Dispatch<React.SetStateAction<string[]>>;
    theme: any;
}

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

export default function FilterModal({
    visible,
    setVisible,
    priceRange,
    setPriceRange,
    seatRange,
    setSeatRange,
    minRating,
    setMinRating,
    selectedBrands,
    setSelectedBrands,
    selectedFuel,
    setSelectedFuel,
    theme,
}: FilterModalProps) {
    const { width } = useWindowDimensions();

    // Toggle functions
    const toggleBrand = (brand: string) => {
        setSelectedBrands(prev =>
            prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
        );
    };

    const toggleFuel = (fuel: string) => {
        setSelectedFuel(prev =>
            prev.includes(fuel) ? prev.filter(f => f !== fuel) : [...prev, fuel]
        );
    };

    const resetFilters = () => {
        setPriceRange([0, 5000]);
        setSeatRange([0, 10]);
        setMinRating(0);
        setSelectedBrands([]);
        setSelectedFuel([]);
    };

    return (
        <Modal visible={visible} transparent animationType="none">
            <Pressable style={styles.modalContainer} onPress={() => setVisible(false)}>
                <Pressable
                    onPress={() => {}}
                    style={[styles.modalContent, { backgroundColor: theme.card }]}
                >
                    <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>
                        Filter
                    </Text>

                    {/* Car Types */}
                    <FlatList
                        data={carTypes}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={item => item.id.toString()}
                        renderItem={({ item }) => (
                            <Pressable
                                style={[
                                    styles.brandOption,
                                    {
                                        backgroundColor: selectedBrands.includes(item.name)
                                            ? theme.textFilterBackgroundActive
                                            : theme.textFilterBackground,
                                    },
                                ]}
                                onPress={() => toggleBrand(item.name)}
                            >
                                <Text
                                    style={{
                                        color: selectedBrands.includes(item.name)
                                            ? theme.textFilter
                                            : theme.textPrimary,
                                    }}
                                >
                                    {item.name}
                                </Text>
                            </Pressable>
                        )}
                        contentContainerStyle={{ paddingVertical: 10 }}
                    />

                    {/* Fuel Types */}
                    <FlatList
                        data={carFuel}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={item => item.id.toString()}
                        renderItem={({ item }) => (
                            <Pressable
                                style={[
                                    styles.brandOption,
                                    {
                                        backgroundColor: selectedFuel.includes(item.name)
                                            ? theme.textFilterBackgroundActive
                                            : theme.textFilterBackground,
                                    },
                                ]}
                                onPress={() => toggleFuel(item.name)}
                            >
                                <Text
                                    style={{
                                        color: selectedFuel.includes(item.name)
                                            ? theme.textFilter
                                            : theme.textPrimary,
                                    }}
                                >
                                    {item.name}
                                </Text>
                            </Pressable>
                        )}
                        contentContainerStyle={{ paddingVertical: 10 }}
                    />

                    {/* Price Range */}
                    <Text style={[styles.modalSectionTitle, { color: theme.textPrimary }]}>
                        Price Range
                    </Text>
                    <PriceRangeSelector
                        min={0}
                        max={5000}
                        sliderLength={width - 80}
                        value={priceRange}
                        text="$"
                        onChange={setPriceRange}
                    />

                    {/* Seat Range */}
                    <Text style={[styles.modalSectionTitle, { color: theme.textPrimary }]}>
                        Seats Range
                    </Text>
                    <PriceRangeSelector
                        min={1}
                        max={10}
                        step={1}
                        sliderLength={width - 80}
                        value={seatRange}
                        onChange={setSeatRange}
                    />

                    {/* Minimum Rating */}
                    <Text style={[styles.modalSectionTitle, { color: theme.textPrimary }]}>
                        Minimum Rating
                    </Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
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

                    {/* Buttons */}
                    <View style={styles.modalButtonsRow}>
                        <Pressable
                            style={[styles.clearButton, { backgroundColor: theme.textFilterButtonBackground, marginRight: 10 }]}
                            onPress={resetFilters}
                        >
                            <Text style={{ color: theme.textFilterReset, fontWeight: '600' }}>
                                Reset
                            </Text>
                        </Pressable>
                        <Pressable
                            style={[styles.applyButton, { backgroundColor: theme.textFilterBackgroundActive }]}
                            onPress={() => setVisible(false)}
                        >
                            <Text style={{ color: theme.textFilterActive, fontWeight: '600' }}>
                                Apply
                            </Text>
                        </Pressable>
                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalContainer: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
    modalContent: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        maxHeight: '80%',
        paddingTop: 30,
        paddingHorizontal: 20,
        paddingBottom: 20,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        alignItems: 'center',
    },
    modalTitle: { fontSize: 22, fontWeight: '700', marginBottom: 10 },
    modalSectionTitle: { fontSize: 19, fontWeight: '600', marginTop: 15, marginBottom: 10 },
    brandOption: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12, marginRight: 8, marginBottom: 8 },
    modalButtonsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 },
    clearButton: { flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
    applyButton: { flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
});
