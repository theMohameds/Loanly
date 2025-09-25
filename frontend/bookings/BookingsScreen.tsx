import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function BookingsScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>My Bookings</Text>
            <Text>List of current and past bookings will appear here.</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 20, marginBottom: 10 },
});
