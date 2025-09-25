import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function MainMenuScreen({ navigation }: any) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Main Menu</Text>
            <Button
                title="Book a Car"
                onPress={() => navigation.navigate('Rental')}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 20, marginBottom: 20 },
});
