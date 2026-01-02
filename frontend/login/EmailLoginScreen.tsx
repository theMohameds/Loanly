import React, { useState } from 'react';
import {Text, TextInput, Pressable, StyleSheet, ImageBackground, KeyboardAvoidingView, Platform, ScrollView, Alert,}
    from 'react-native';


export default function EmailLoginScreen({ navigation, setIsLoggedIn }: any) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Login validation function
    const handleLogin = () => {
        // Check if both fields are filled
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in both email and password');
            return;
        }

        // Email validation
        if (!email.includes('@') || !email.includes('.')) {
            Alert.alert('Error', 'Please enter a valid email address');
            return;
        }

        // Checking password length
        if (password.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters');
            return;
        }

        Alert.alert('Success', 'Login successful!', [
            {
                text: 'OK',
                onPress: () => {
                    setIsLoggedIn(true);
                },
            },
        ]);
    };

    return (
        <ImageBackground
            source={require('../assets/background.png')}
            style={styles.bg}
            resizeMode="cover"
        >
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView
                    contentContainerStyle={styles.scroll}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Logo */}
                    <Text style={styles.logo}>LOANLY</Text>

                    {/* Email input */}
                    <TextInput
                        style={styles.input}
                        placeholder="E-mail"
                        placeholderTextColor="#ccc"
                        value={email}
                        onChangeText={setEmail}
                    />

                    {/* Password input */}
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        placeholderTextColor="#ccc"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />

                    {/* Login button */}
                    <Pressable style={styles.button} onPress={handleLogin}>
                        <Text style={styles.buttonText}>Login</Text>
                    </Pressable>
                </ScrollView>
            </KeyboardAvoidingView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    bg: { flex: 1, width: '100%', height: '100%' },
    scroll: { flexGrow: 1, justifyContent: 'center', padding: 24 },
    logo: {
        fontSize: 32,
        fontWeight: '800',
        color: 'white',
        marginBottom: 60,
        marginTop: 60,
        alignSelf: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        color: 'white',
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    button: {
        backgroundColor: 'black',
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'white',
        marginTop: 8,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});
