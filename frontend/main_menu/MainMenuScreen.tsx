import React from 'react';
import { View, Text, Pressable, StyleSheet, ImageBackground } from 'react-native';

export default function MainMenuScreen({ navigation }: any): React.JSX.Element {
    return (
        <ImageBackground
            source={require('../assets/background.png')}
            style={styles.bg}
            resizeMode="cover"
        >
            <View style={styles.overlay}>
                {/* Logo at the top */}
                <View style={styles.header}>
                    <Text style={styles.logo}>LOANLY</Text>
                </View>

                {/* Content in the middle*/}
                <View style={styles.content}>
                    <View style={styles.textBox}>
                        <Text style={styles.text}>
                            search and compare car rentals and{' '}
                            <Text style={styles.highlight}>save up to 70%!</Text>
                        </Text>
                    </View>

                    <Pressable style={styles.button} onPress={() => navigation.navigate('LoginOptions')}>
                        <Text style={styles.buttonText}>Log in or sign in</Text>
                    </Pressable>
                </View>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    bg: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    overlay: {
        flex: 1,
        padding: 24,
        backgroundColor: 'rgba(0,0,0,0.25)', // Dark overlay to make text easier to read
    },
    header: {
        marginTop: 40,
        alignItems: 'flex-start',
    },
    logo: {
        fontSize: 36,
        fontWeight: '800',
        color: 'white',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textBox: {
        maxWidth: 320,
        marginBottom: 32,
    },
    text: {
        fontSize: 18,
        color: 'white',
        lineHeight: 24,
        textAlign: 'center',
    },
    highlight: {
        color: '#FFD500',
        fontWeight: '800',
    },
    button: {
        backgroundColor: 'black',
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 36,
        borderWidth: 1,
        borderColor: 'white',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});
