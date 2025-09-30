import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Image,
    Alert,
} from 'react-native';

interface UserProfile {
    name: string;
    email: string;
    phone: string;
    address: string;
}

const ProfileScreen: React.FC = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState<UserProfile>({
        name: 'John Doe',
        email: 'john.doe@email.com',
        phone: '+45 12345678',
        address: 'Copenhagen, Denmark',
    });

    const [editedProfile, setEditedProfile] = useState<UserProfile>(profile);

    const handleSave = () => {
        setProfile(editedProfile);
        setIsEditing(false);
        Alert.alert('Success', 'Profile updated successfully');
    };

    const handleCancel = () => {
        setEditedProfile(profile);
        setIsEditing(false);
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>My Profile</Text>
            </View>

            <View style={styles.profileImageContainer}>
                <View style={styles.profileImage}>
                    <Text style={styles.profileImageText}>JD</Text>
                </View>
                {!isEditing && (
                    <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
                        <Text style={styles.editButtonText}>Edit Profile</Text>
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.infoSection}>
                <View style={styles.infoRow}>
                    <Text style={styles.label}>Name</Text>
                    {isEditing ? (
                        <TextInput
                            style={styles.input}
                            value={editedProfile.name}
                            onChangeText={(text) => setEditedProfile({ ...editedProfile, name: text })}
                            placeholder="Enter your name"
                        />
                    ) : (
                        <Text style={styles.value}>{profile.name}</Text>
                    )}
                </View>

                <View style={styles.infoRow}>
                    <Text style={styles.label}>Email</Text>
                    {isEditing ? (
                        <TextInput
                            style={styles.input}
                            value={editedProfile.email}
                            onChangeText={(text) => setEditedProfile({ ...editedProfile, email: text })}
                            placeholder="Enter your email"
                            keyboardType="email-address"
                        />
                    ) : (
                        <Text style={styles.value}>{profile.email}</Text>
                    )}
                </View>

                <View style={styles.infoRow}>
                    <Text style={styles.label}>Phone</Text>
                    {isEditing ? (
                        <TextInput
                            style={styles.input}
                            value={editedProfile.phone}
                            onChangeText={(text) => setEditedProfile({ ...editedProfile, phone: text })}
                            placeholder="Enter your phone"
                            keyboardType="phone-pad"
                        />
                    ) : (
                        <Text style={styles.value}>{profile.phone}</Text>
                    )}
                </View>

                <View style={styles.infoRow}>
                    <Text style={styles.label}>Address</Text>
                    {isEditing ? (
                        <TextInput
                            style={styles.input}
                            value={editedProfile.address}
                            onChangeText={(text) => setEditedProfile({ ...editedProfile, address: text })}
                            placeholder="Enter your address"
                        />
                    ) : (
                        <Text style={styles.value}>{profile.address}</Text>
                    )}
                </View>
            </View>

            {isEditing && (
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                        <Text style={styles.saveButtonText}>Save Changes</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            )}

            <View style={styles.menuSection}>
                <TouchableOpacity style={styles.menuItem}>
                    <Text style={styles.menuItemText}>My Bookings</Text>
                    <Text style={styles.menuItemArrow}>›</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem}>
                    <Text style={styles.menuItemText}>Payment Methods</Text>
                    <Text style={styles.menuItemArrow}>›</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem}>
                    <Text style={styles.menuItemText}>Documents</Text>
                    <Text style={styles.menuItemArrow}>›</Text>
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
    profileImageContainer: {
        alignItems: 'center',
        marginVertical: 30,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#FFD700',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    profileImageText: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#fff',
    },
    editButton: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        backgroundColor: '#333',
        borderRadius: 20,
    },
    editButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    infoSection: {
        backgroundColor: '#fff',
        marginHorizontal: 20,
        borderRadius: 10,
        padding: 20,
        marginBottom: 20,
    },
    infoRow: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
    },
    value: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
        color: '#333',
    },
    buttonContainer: {
        marginHorizontal: 20,
        marginBottom: 20,
    },
    saveButton: {
        backgroundColor: '#FFD700',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 10,
    },
    saveButtonText: {
        color: '#333',
        fontSize: 16,
        fontWeight: 'bold',
    },
    cancelButton: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
    },
    cancelButtonText: {
        color: '#666',
        fontSize: 16,
    },
    menuSection: {
        backgroundColor: '#fff',
        marginHorizontal: 20,
        borderRadius: 10,
        marginBottom: 30,
    },
    menuItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    menuItemText: {
        fontSize: 16,
        color: '#333',
    },
    menuItemArrow: {
        fontSize: 24,
        color: '#999',
    },
});

export default ProfileScreen;