import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Switch,
    Alert,
} from 'react-native';

interface SettingsOption {
    id: string;
    title: string;
    type: 'navigate' | 'switch';
    value?: boolean;
}

const SettingsScreen: React.FC = () => {
    const [notifications, setNotifications] = useState(true);
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(false);
    const [autoSave, setAutoSave] = useState(true);

    const handleSignOut = () => {
        Alert.alert(
            'Sign Out',
            'Are you sure you want to sign out?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Sign Out', onPress: () => console.log('User signed out') },
            ],
            { cancelable: true }
        );
    };

    const handleDeleteAccount = () => {
        Alert.alert(
            'Delete Account',
            'Are you sure you want to delete your account? This action cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => console.log('Account deleted')
                },
            ],
            { cancelable: true }
        );
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Settings</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Notifications</Text>
                <View style={styles.settingItem}>
                    <Text style={styles.settingText}>Push Notifications</Text>
                    <Switch
                        value={notifications}
                        onValueChange={setNotifications}
                        trackColor={{ false: '#ddd', true: '#FFD700' }}
                        thumbColor={notifications ? '#fff' : '#f4f3f4'}
                    />
                </View>
                <View style={styles.settingItem}>
                    <Text style={styles.settingText}>Email Notifications</Text>
                    <Switch
                        value={emailNotifications}
                        onValueChange={setEmailNotifications}
                        trackColor={{ false: '#ddd', true: '#FFD700' }}
                        thumbColor={emailNotifications ? '#fff' : '#f4f3f4'}
                    />
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Preferences</Text>
                <TouchableOpacity style={styles.settingItem}>
                    <Text style={styles.settingText}>Language</Text>
                    <View style={styles.settingValue}>
                        <Text style={styles.settingValueText}>English</Text>
                        <Text style={styles.arrow}>›</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.settingItem}>
                    <Text style={styles.settingText}>Currency</Text>
                    <View style={styles.settingValue}>
                        <Text style={styles.settingValueText}>DKK</Text>
                        <Text style={styles.arrow}>›</Text>
                    </View>
                </TouchableOpacity>
                <View style={styles.settingItem}>
                    <Text style={styles.settingText}>Dark Mode</Text>
                    <Switch
                        value={darkMode}
                        onValueChange={setDarkMode}
                        trackColor={{ false: '#ddd', true: '#FFD700' }}
                        thumbColor={darkMode ? '#fff' : '#f4f3f4'}
                    />
                </View>
                <View style={styles.settingItem}>
                    <Text style={styles.settingText}>Auto-save Searches</Text>
                    <Switch
                        value={autoSave}
                        onValueChange={setAutoSave}
                        trackColor={{ false: '#ddd', true: '#FFD700' }}
                        thumbColor={autoSave ? '#fff' : '#f4f3f4'}
                    />
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Support</Text>
                <TouchableOpacity style={styles.settingItem}>
                    <Text style={styles.settingText}>Help Center</Text>
                    <Text style={styles.arrow}>›</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.settingItem}>
                    <Text style={styles.settingText}>Contact Us</Text>
                    <Text style={styles.arrow}>›</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.settingItem}>
                    <Text style={styles.settingText}>Terms & Conditions</Text>
                    <Text style={styles.arrow}>›</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.settingItem}>
                    <Text style={styles.settingText}>Privacy Policy</Text>
                    <Text style={styles.arrow}>›</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>About</Text>
                <TouchableOpacity style={styles.settingItem}>
                    <Text style={styles.settingText}>Version</Text>
                    <Text style={styles.settingValueText}>1.0.0</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.actionSection}>
                <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
                    <Text style={styles.signOutText}>Sign Out</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
                    <Text style={styles.deleteText}>Delete Account</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        backgroundColor: '#fff',
        padding: 20,
        paddingTop: 50,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    section: {
        backgroundColor: '#fff',
        marginHorizontal: 20,
        marginTop: 20,
        borderRadius: 10,
        paddingVertical: 10,
    },
    sectionTitle: {
        fontSize: 14,
        color: '#999',
        fontWeight: '600',
        paddingHorizontal: 20,
        paddingVertical: 10,
        textTransform: 'uppercase',
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    settingText: {
        fontSize: 16,
        color: '#333',
    },
    settingValue: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    settingValueText: {
        fontSize: 16,
        color: '#666',
        marginRight: 5,
    },
    arrow: {
        fontSize: 20,
        color: '#999',
    },
    actionSection: {
        marginTop: 30,
        marginBottom: 50,
        marginHorizontal: 20,
    },
    signOutButton: {
        backgroundColor: '#333',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 15,
    },
    signOutText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    deleteButton: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ff3b30',
    },
    deleteText: {
        color: '#ff3b30',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default SettingsScreen;