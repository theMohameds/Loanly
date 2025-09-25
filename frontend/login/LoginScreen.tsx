import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function LoginScreen({ navigation }: any) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login Screen</Text>
            <Button
                title="Login"
                onPress={() => navigation.replace('MainTabs')}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 20, marginBottom: 20 },
});
