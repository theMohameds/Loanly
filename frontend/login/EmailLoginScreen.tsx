import React, { useState } from 'react';
import {Text, TextInput, Pressable, StyleSheet, ImageBackground, KeyboardAvoidingView, Platform, ScrollView
} from 'react-native';

export default function EmailLoginScreen({ navigation }: any) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <ImageBackground
            source={require('../assets/background.png')} // Background image
            style={styles.bg}
            resizeMode="cover"
        >
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <ScrollView
                    contentContainerStyle={styles.scroll}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Logo at the top */}
                    <Text style={styles.logo}>LOANLY</Text>

                    {/* Inputs */}
                    <TextInput
                        style={styles.input}
                        placeholder="E-mail"
                        placeholderTextColor="#ccc"
                        value={email}
                        onChangeText={setEmail}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        placeholderTextColor="#ccc"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />

                    {/* loging button */}
                    <Pressable
                        style={styles.button}
                        onPress={() => navigation.replace('MainTabs')}
                    >
                        <Text style={styles.buttonText}>Log in</Text>
                    </Pressable>
                </ScrollView>
            </KeyboardAvoidingView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    bg: { flex: 1, width: '100%', height: '100%' },
    scroll: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 24,
    },
    logo: {
        fontSize: 32,
        fontWeight: '800',
        color: 'white',
        marginBottom: 60,
        marginTop: 60,    // pushes logo futher to the top
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
