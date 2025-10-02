import React from 'react';
import { View, Text, Pressable, StyleSheet, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
    return (
        <ImageBackground
            source={require('../assets/background.png')}
            style={styles.bg}
            resizeMode="cover"
        >
            <View style={styles.overlay}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.logo}>LOANLY</Text>
                    <Ionicons name="menu" size={28} color="white" />
                </View>

                {/* Buttons */}
                <View style={styles.center}>
                    <Pressable style={styles.button}>
                        <Text style={styles.buttonText}>🚗 Rent Car</Text>
                    </Pressable>
                    <Pressable style={styles.button}>
                        <Text style={styles.buttonText}>🔖 Bookings</Text>
                    </Pressable>
                </View>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    bg: { flex: 1, width: '100%', height: '100%' },
    overlay: { flex: 1, padding: 24 },
    header: {
        marginTop: 40,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    logo: { fontSize: 32, fontWeight: '800', color: 'white' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    button: {
        backgroundColor: 'black',
        borderRadius: 8,
        paddingVertical: 14,
        paddingHorizontal: 60,
        borderWidth: 1,
        borderColor: 'white',
        marginVertical: 10,
    },
    buttonText: { color: 'white', fontSize: 16, fontWeight: '600' },
});
