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
        <ScrollView style={[styles.container, darkMode && styles.containerDark]}>
            <View style={[styles.header, darkMode && styles.headerDark]}>
                <Text style={[styles.headerTitle, darkMode && styles.headerTitleDark]}>Settings</Text>
            </View>

            <View style={[styles.section, darkMode && styles.sectionDark]}>
                <Text style={[styles.sectionTitle, darkMode && styles.sectionTitleDark]}>Notifications</Text>
                <View style={[styles.settingItem, darkMode && styles.settingItemDark]}>
                    <Text style={[styles.settingText, darkMode && styles.settingTextDark]}>Push Notifications</Text>
                    <Switch
                        value={notifications}
                        onValueChange={setNotifications}
                        trackColor={{ false: '#ddd', true: '#FFD700' }}
                        thumbColor={notifications ? '#fff' : '#f4f3f4'}
                    />
                </View>
                <View style={[styles.settingItem, darkMode && styles.settingItemDark]}>
                    <Text style={[styles.settingText, darkMode && styles.settingTextDark]}>Email Notifications</Text>
                    <Switch
                        value={emailNotifications}
                        onValueChange={setEmailNotifications}
                        trackColor={{ false: '#ddd', true: '#FFD700' }}
                        thumbColor={emailNotifications ? '#fff' : '#f4f3f4'}
                    />
                </View>
            </View>

            <View style={[styles.section, darkMode && styles.sectionDark]}>
                <Text style={[styles.sectionTitle, darkMode && styles.sectionTitleDark]}>Preferences</Text>
                <TouchableOpacity style={[styles.settingItem, darkMode && styles.settingItemDark]}>
                    <Text style={[styles.settingText, darkMode && styles.settingTextDark]}>Language</Text>
                    <View style={styles.settingValue}>
                        <Text style={[styles.settingValueText, darkMode && styles.settingValueTextDark]}>English</Text>
                        <Text style={[styles.arrow, darkMode && styles.arrowDark]}>›</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.settingItem, darkMode && styles.settingItemDark]}>
                    <Text style={[styles.settingText, darkMode && styles.settingTextDark]}>Currency</Text>
                    <View style={styles.settingValue}>
                        <Text style={[styles.settingValueText, darkMode && styles.settingValueTextDark]}>DKK</Text>
                        <Text style={[styles.arrow, darkMode && styles.arrowDark]}>›</Text>
                    </View>
                </TouchableOpacity>
                <View style={[styles.settingItem, darkMode && styles.settingItemDark]}>
                    <Text style={[styles.settingText, darkMode && styles.settingTextDark]}>Dark Mode</Text>
                    <Switch
                        value={darkMode}
                        onValueChange={setDarkMode}
                        trackColor={{ false: '#ddd', true: '#FFD700' }}
                        thumbColor={darkMode ? '#fff' : '#f4f3f4'}
                    />
                </View>
                <View style={[styles.settingItem, darkMode && styles.settingItemDark]}>
                    <Text style={[styles.settingText, darkMode && styles.settingTextDark]}>Auto-save Searches</Text>
                    <Switch
                        value={autoSave}
                        onValueChange={setAutoSave}
                        trackColor={{ false: '#ddd', true: '#FFD700' }}
                        thumbColor={autoSave ? '#fff' : '#f4f3f4'}
                    />
                </View>
            </View>

            <View style={[styles.section, darkMode && styles.sectionDark]}>
                <Text style={[styles.sectionTitle, darkMode && styles.sectionTitleDark]}>Support</Text>
                <TouchableOpacity style={[styles.settingItem, darkMode && styles.settingItemDark]}>
                    <Text style={[styles.settingText, darkMode && styles.settingTextDark]}>Help Center</Text>
                    <Text style={[styles.arrow, darkMode && styles.arrowDark]}>›</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.settingItem, darkMode && styles.settingItemDark]}>
                    <Text style={[styles.settingText, darkMode && styles.settingTextDark]}>Contact Us</Text>
                    <Text style={[styles.arrow, darkMode && styles.arrowDark]}>›</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.settingItem, darkMode && styles.settingItemDark]}>
                    <Text style={[styles.settingText, darkMode && styles.settingTextDark]}>Terms & Conditions</Text>
                    <Text style={[styles.arrow, darkMode && styles.arrowDark]}>›</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.settingItem, darkMode && styles.settingItemDark]}>
                    <Text style={[styles.settingText, darkMode && styles.settingTextDark]}>Privacy Policy</Text>
                    <Text style={[styles.arrow, darkMode && styles.arrowDark]}>›</Text>
                </TouchableOpacity>
            </View>

            <View style={[styles.section, darkMode && styles.sectionDark]}>
                <Text style={[styles.sectionTitle, darkMode && styles.sectionTitleDark]}>About</Text>
                <TouchableOpacity style={[styles.settingItem, darkMode && styles.settingItemDark]}>
                    <Text style={[styles.settingText, darkMode && styles.settingTextDark]}>Version</Text>
                    <Text style={[styles.settingValueText, darkMode && styles.settingValueTextDark]}>1.0.0</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.actionSection}>
                <TouchableOpacity style={[styles.signOutButton, darkMode && styles.signOutButtonDark]} onPress={handleSignOut}>
                    <Text style={[styles.signOutText, darkMode && styles.signOutTextDark]}>Sign Out</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.deleteButton, darkMode && styles.deleteButtonDark]} onPress={handleDeleteAccount}>
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
    containerDark: {
        backgroundColor: '#000000',
    },
    header: {
        backgroundColor: '#fff',
        padding: 20,
        paddingTop: 50,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    headerDark: {
        backgroundColor: '#1c1c1e',
        borderBottomColor: '#38383a',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    headerTitleDark: {
        color: '#ffffff',
    },
    section: {
        backgroundColor: '#fff',
        marginHorizontal: 20,
        marginTop: 20,
        borderRadius: 10,
        paddingVertical: 10,
    },
    sectionDark: {
        backgroundColor: '#1c1c1e',
    },
    sectionTitle: {
        fontSize: 14,
        color: '#999',
        fontWeight: '600',
        paddingHorizontal: 20,
        paddingVertical: 10,
        textTransform: 'uppercase',
    },
    sectionTitleDark: {
        color: '#8e8e93',
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
    settingItemDark: {
        borderBottomColor: '#38383a',
    },
    settingText: {
        fontSize: 16,
        color: '#333',
    },
    settingTextDark: {
        color: '#ffffff',
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
    settingValueTextDark: {
        color: '#8e8e93',
    },
    arrow: {
        fontSize: 20,
        color: '#999',
    },
    arrowDark: {
        color: '#8e8e93',
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
    signOutButtonDark: {
        backgroundColor: '#ffffff',
    },
    signOutText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    signOutTextDark: {
        color: '#000000',
    },
    deleteButton: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ff3b30',
    },
    deleteButtonDark: {
        backgroundColor: '#1c1c1e',
    },
    deleteText: {
        color: '#ff3b30',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default SettingsScreen;