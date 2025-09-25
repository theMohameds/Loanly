import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import ProfileScreen from './ProfileScreen';
import SettingsScreen from './SettingsScreen';

export default function App() {
    const [currentScreen, setCurrentScreen] = React.useState<'profile' | 'settings'>('profile');

    return (
        <View style={styles.container}>
            {currentScreen === 'profile' ? <ProfileScreen /> : <SettingsScreen />}

            <View style={styles.tabBar}>
                <TouchableOpacity
                    style={[styles.tab, currentScreen === 'profile' && styles.activeTab]}
                    onPress={() => setCurrentScreen('profile')}
                >
                    <Text style={[styles.tabText, currentScreen === 'profile' && styles.activeTabText]}>
                        Profile
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, currentScreen === 'settings' && styles.activeTab]}
                    onPress={() => setCurrentScreen('settings')}
                >
                    <Text style={[styles.tabText, currentScreen === 'settings' && styles.activeTabText]}>
                        Settings
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    tabBar: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    tab: {
        flex: 1,
        paddingVertical: 15,
        alignItems: 'center',
    },
    activeTab: {
        borderTopWidth: 2,
        borderTopColor: '#FFD700',
    },
    tabText: {
        fontSize: 14,
        color: '#999',
    },
    activeTabText: {
        color: '#333',
        fontWeight: '600',
    },
});