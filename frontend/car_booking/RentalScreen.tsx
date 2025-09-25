import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function RentalScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Rental Screen</Text>
            <Text>Here you can select cars and confirm bookings</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 20, marginBottom: 10 },
});
