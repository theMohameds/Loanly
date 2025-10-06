import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

export default function LoginOptionsSheet({ navigation, onClose }: any) {
    return (
        <View style={styles.container}>
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

                <Pressable
                    style={styles.option}
                    onPress={() => {
                        onClose();
                        navigation.navigate('EmailLogin');
                    }}
                >
                    <Text style={styles.optionText}>Continue with Email</Text>
                </Pressable>

                <Text style={styles.terms}>
                    By continuing, you agree to our <Text style={styles.termsUnderline}>Terms of Use and Privacy Policy</Text>.
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0)'
    },
    sheet: {
        backgroundColor: 'black',
        padding: 24,
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        color: 'white',
        marginBottom: 8
    },
    subtitle: {
        fontSize: 14,
        color: 'white',
        marginBottom: 24
    },
    option: {
        backgroundColor: '#111',
        borderRadius: 8,
        paddingVertical: 14,
        marginBottom: 12,
    },
    optionText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center'
    },
    terms: {
        color: 'white',
        fontSize: 12,
        marginTop: 16,
        textAlign: 'center'
    },
    termsUnderline: {
        color: 'white',
        fontSize: 12,
        marginTop: 16,
        textAlign: 'center',
        textDecorationLine:"underline"
    },
});
