import React from 'react';
import { View, Text, Pressable, StyleSheet, ImageBackground } from 'react-native';

export default function LoginOptionsScreen({ navigation }: any) {
    return (
        <ImageBackground source={require('../assets/background.png')} style={styles.bg} resizeMode="cover">
            <View style={styles.overlay}>
                {/* Logo */}
                <Text style={styles.logo}>LOANLY</Text>

                {/* Bottom sheet */}
                <View style={styles.sheet}>
                    <Text style={styles.title}>Log in or sign up</Text>
                    <Text style={styles.subtitle}>
                        View your bookings, find the best deals and book faster.
                    </Text>

                    <Pressable style={styles.option}>
                        <Text style={styles.optionText}>Continue with Google</Text>
                    </Pressable>

                    <Pressable style={styles.option}>
                        <Text style={styles.optionText}>Continue with Apple</Text>
                    </Pressable>

                    <Pressable style={styles.option} onPress={() => navigation.navigate('EmailLogin')}>
                        <Text style={styles.optionText}>Continue with Email</Text>
                    </Pressable>

                    <Text style={styles.terms}>
                        By continuing, you agree to our Terms of Use and Privacy Policy.
                    </Text>
                </View>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    bg: { flex: 1, width: '100%', height: '100%' },
    overlay: { flex: 1, justifyContent: 'flex-start', padding: 24 },
    logo: {
        fontSize: 32,
        fontWeight: '800',
        color: 'white',
        marginTop: 40,
    },
    sheet: {
        backgroundColor: 'black',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 24,
        marginTop: 'auto',
    },
    title: { fontSize: 22, fontWeight: '700', color: 'white', marginBottom: 8 },
    subtitle: { fontSize: 14, color: 'white', marginBottom: 24 },
    option: {
        backgroundColor: '#111',
        borderRadius: 8,
        paddingVertical: 14,
        marginBottom: 12,
    },
    optionText: { color: 'white', fontSize: 16, textAlign: 'center' },
    terms: { color: 'white', fontSize: 12, marginTop: 16, textAlign: 'center' },
});
