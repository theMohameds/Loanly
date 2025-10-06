import React from 'react';
import { View, Text, Pressable, StyleSheet, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";

export default function HomeScreen() {
    const navigation = useNavigation();
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
                </View>

                {/* Buttons */}
                <View style={styles.center}>
                    <Pressable style={styles.button} onPress={() => navigation.navigate("Rental")} >
                        <Text style={styles.buttonText}>Rent Car</Text>
                    </Pressable>
                    <Pressable style={styles.button} onPress={() => navigation.navigate("AddCarStack")}>
                        <Text style={styles.buttonText}>Rent out your car</Text>
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
    logo: {
        fontSize: 48,
        fontWeight: '800',
        color: 'white',
        paddingHorizontal: 15,
    },
    center: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginBottom: 60,
    },
    button: {
        width: '85%',
        backgroundColor: 'rgba(33, 33, 33, 0.90)',
        borderRadius: 12,
        paddingVertical: 18,
        alignItems: 'center',
        borderColor: 'white',
        marginVertical: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
    },
});
