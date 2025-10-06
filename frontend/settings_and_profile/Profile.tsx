import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Alert,
    Modal,
} from 'react-native';

interface UserProfile {
    name: string;
    email: string;
    phone: string;
    address: string;
}

interface PaymentMethod {
    id: string;
    type: 'card' | 'bank';
    last4: string;
    name: string;
    expiryDate?: string;
    isDefault: boolean;
}

interface Document {
    id: string;
    name: string;
    type: string;
    date: string;
    size: string;
}

const ProfileScreen: React.FC = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [showPaymentMethods, setShowPaymentMethods] = useState(false);
    const [showDocuments, setShowDocuments] = useState(false);
    const [showAddPayment, setShowAddPayment] = useState(false);

    const [profile, setProfile] = useState<UserProfile>({
        name: 'Jacob Donut',
        email: 'jacob9@email.com',
        phone: '+45 12345678',
        address: 'Odense, Denmark',
    });

    const [editedProfile, setEditedProfile] = useState<UserProfile>(profile);

    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
        { id: '1', type: 'card', last4: '4242', name: 'Visa', expiryDate: '12/25', isDefault: true },
        { id: '2', type: 'card', last4: '5555', name: 'Mastercard', expiryDate: '08/26', isDefault: false },
    ]);

    const [documents, setDocuments] = useState<Document[]>([
        { id: '1', name: 'Invoice_2024_01.pdf', type: 'PDF', date: '2024-01-15', size: '245 KB' },
        { id: '2', name: 'Receipt_2024_02.pdf', type: 'PDF', date: '2024-02-20', size: '189 KB' },
        { id: '3', name: 'Contract_Agreement.pdf', type: 'PDF', date: '2024-03-10', size: '512 KB' },
    ]);

    const [newCard, setNewCard] = useState({
        number: '',
        name: '',
        expiry: '',
        cvv: '',
    });

    const handleSave = () => {
        setProfile(editedProfile);
        setIsEditing(false);
        Alert.alert('Success', 'Profile updated successfully');
    };

    const handleCancel = () => {
        setEditedProfile(profile);
        setIsEditing(false);
    };

    const handleDeletePayment = (id: string) => {
        Alert.alert(
            'Delete Payment Method',
            'Are you sure you want to delete this payment method?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        setPaymentMethods(paymentMethods.filter(pm => pm.id !== id));
                        Alert.alert('Success', 'Payment method deleted');
                    },
                },
            ]
        );
    };

    const handleSetDefaultPayment = (id: string) => {
        setPaymentMethods(paymentMethods.map(pm => ({
            ...pm,
            isDefault: pm.id === id,
        })));
        Alert.alert('Success', 'Default payment method updated');
    };

    const handleAddPayment = () => {
        if (!newCard.number || !newCard.name || !newCard.expiry || !newCard.cvv) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        const newPayment: PaymentMethod = {
            id: Date.now().toString(),
            type: 'card',
            last4: newCard.number.slice(-4),
            name: newCard.number.startsWith('4') ? 'Visa' : 'Mastercard',
            expiryDate: newCard.expiry,
            isDefault: paymentMethods.length === 0,
        };

        setPaymentMethods([...paymentMethods, newPayment]);
        setNewCard({ number: '', name: '', expiry: '', cvv: '' });
        setShowAddPayment(false);
        Alert.alert('Success', 'Payment method added successfully');
    };

    const handleDeleteDocument = (id: string) => {
        Alert.alert(
            'Delete Document',
            'Are you sure you want to delete this document?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        setDocuments(documents.filter(doc => doc.id !== id));
                        Alert.alert('Success', 'Document deleted');
                    },
                },
            ]
        );
    };

    const handleDownloadDocument = (doc: Document) => {
        Alert.alert('Download', `Downloading ${doc.name}...`);
    };

    const renderPaymentMethodsModal = () => (
        <Modal
            visible={showPaymentMethods}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={() => setShowPaymentMethods(false)}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalHeader}>
                    <TouchableOpacity onPress={() => setShowPaymentMethods(false)}>
                        <Text style={styles.modalCloseButton}>✕</Text>
                    </TouchableOpacity>
                    <Text style={styles.modalTitle}>Payment Methods</Text>
                    <View style={{ width: 30 }} />
                </View>

                <ScrollView style={styles.modalContent}>
                    {paymentMethods.map((method) => (
                        <View key={method.id} style={styles.paymentCard}>
                            <View style={styles.paymentCardHeader}>
                                <View>
                                    <Text style={styles.paymentCardName}>{method.name}</Text>
                                    <Text style={styles.paymentCardNumber}>•••• {method.last4}</Text>
                                    {method.expiryDate && (
                                        <Text style={styles.paymentCardExpiry}>Expires {method.expiryDate}</Text>
                                    )}
                                </View>
                                <View style={styles.paymentCardIcon}>
                                    <Text style={styles.cardIconText}>💳</Text>
                                </View>
                            </View>

                            {method.isDefault && (
                                <View style={styles.defaultBadge}>
                                    <Text style={styles.defaultBadgeText}>Default</Text>
                                </View>
                            )}

                            <View style={styles.paymentCardActions}>
                                {!method.isDefault && (
                                    <TouchableOpacity
                                        style={styles.actionButton}
                                        onPress={() => handleSetDefaultPayment(method.id)}
                                    >
                                        <Text style={styles.actionButtonText}>Set as Default</Text>
                                    </TouchableOpacity>
                                )}
                                <TouchableOpacity
                                    style={[styles.actionButton, styles.deleteButton]}
                                    onPress={() => handleDeletePayment(method.id)}
                                >
                                    <Text style={[styles.actionButtonText, styles.deleteButtonText]}>Delete</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}

                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => setShowAddPayment(true)}
                    >
                        <Text style={styles.addButtonText}>+ Add Payment Method</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </Modal>
    );

    const renderAddPaymentModal = () => (
        <Modal
            visible={showAddPayment}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={() => setShowAddPayment(false)}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalHeader}>
                    <TouchableOpacity onPress={() => setShowAddPayment(false)}>
                        <Text style={styles.modalCloseButton}>✕</Text>
                    </TouchableOpacity>
                    <Text style={styles.modalTitle}>Add Card</Text>
                    <View style={{ width: 30 }} />
                </View>

                <ScrollView style={styles.modalContent}>
                    <View style={styles.formGroup}>
                        <Text style={styles.formLabel}>Card Number</Text>
                        <TextInput
                            style={styles.formInput}
                            value={newCard.number}
                            onChangeText={(text) => setNewCard({ ...newCard, number: text })}
                            placeholder="1234 5678 9012 3456"
                            placeholderTextColor="#666"
                            keyboardType="number-pad"
                            maxLength={16}
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.formLabel}>Cardholder Name</Text>
                        <TextInput
                            style={styles.formInput}
                            value={newCard.name}
                            onChangeText={(text) => setNewCard({ ...newCard, name: text })}
                            placeholder="John Doe"
                            placeholderTextColor="#666"
                        />
                    </View>

                    <View style={styles.formRow}>
                        <View style={[styles.formGroup, { flex: 1, marginRight: 10 }]}>
                            <Text style={styles.formLabel}>Expiry Date</Text>
                            <TextInput
                                style={styles.formInput}
                                value={newCard.expiry}
                                onChangeText={(text) => setNewCard({ ...newCard, expiry: text })}
                                placeholder="MM/YY"
                                placeholderTextColor="#666"
                                maxLength={5}
                            />
                        </View>

                        <View style={[styles.formGroup, { flex: 1 }]}>
                            <Text style={styles.formLabel}>CVV</Text>
                            <TextInput
                                style={styles.formInput}
                                value={newCard.cvv}
                                onChangeText={(text) => setNewCard({ ...newCard, cvv: text })}
                                placeholder="123"
                                placeholderTextColor="#666"
                                keyboardType="number-pad"
                                maxLength={3}
                                secureTextEntry
                            />
                        </View>
                    </View>

                    <TouchableOpacity style={styles.submitButton} onPress={handleAddPayment}>
                        <Text style={styles.submitButtonText}>Add Card</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </Modal>
    );

    const renderDocumentsModal = () => (
        <Modal
            visible={showDocuments}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={() => setShowDocuments(false)}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalHeader}>
                    <TouchableOpacity onPress={() => setShowDocuments(false)}>
                        <Text style={styles.modalCloseButton}>✕</Text>
                    </TouchableOpacity>
                    <Text style={styles.modalTitle}>Documents</Text>
                    <View style={{ width: 30 }} />
                </View>

                <ScrollView style={styles.modalContent}>
                    {documents.map((doc) => (
                        <View key={doc.id} style={styles.documentCard}>
                            <View style={styles.documentIcon}>
                                <Text style={styles.documentIconText}>📄</Text>
                            </View>
                            <View style={styles.documentInfo}>
                                <Text style={styles.documentName}>{doc.name}</Text>
                                <Text style={styles.documentMeta}>{doc.date} • {doc.size}</Text>
                            </View>
                            <View style={styles.documentActions}>
                                <TouchableOpacity
                                    style={styles.documentActionButton}
                                    onPress={() => handleDownloadDocument(doc)}
                                >
                                    <Text style={styles.documentActionIcon}>⬇</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.documentActionButton}
                                    onPress={() => handleDeleteDocument(doc.id)}
                                >
                                    <Text style={styles.documentActionIcon}>🗑</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}

                    {documents.length === 0 && (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyStateText}>No documents yet</Text>
                        </View>
                    )}
                </ScrollView>
            </View>
        </Modal>
    );

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
                            placeholderTextColor="#666"
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
                            placeholderTextColor="#666"
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
                            placeholderTextColor="#666"
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
                            placeholderTextColor="#666"
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
                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => setShowPaymentMethods(true)}
                >
                    <Text style={styles.menuItemText}>Payment Methods</Text>
                    <Text style={styles.menuItemArrow}>›</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.lastMenuItem}
                    onPress={() => setShowDocuments(true)}
                >
                    <Text style={styles.menuItemText}>Documents</Text>
                    <Text style={styles.menuItemArrow}>›</Text>
                </TouchableOpacity>
            </View>

            {renderPaymentMethodsModal()}
            {renderAddPaymentModal()}
            {renderDocumentsModal()}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#212121ff',
    },
    header: {
        backgroundColor: '#252525ff',
        padding: 20,
        paddingTop: 45,
        alignItems: 'center',
        // iOS shadow
        shadowColor: "#000000ff",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        // Android shadow
        elevation: 6,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    profileImageContainer: {
        alignItems: 'center',
        marginVertical: 30,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#94f4c4',
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
        backgroundColor: '#303030ff',
        marginHorizontal: 24,
        borderRadius: 10,
        padding: 20,
        marginBottom: 20,
    },
    infoRow: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        color: '#ffffff',
        marginBottom: 5,
    },
    value: {
        fontSize: 16,
        color: '#ffffff',
        fontWeight: '500',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
        color: '#ffffff',
    },
    buttonContainer: {
        marginHorizontal: 20,
        marginBottom: 20,
    },
    saveButton: {
        backgroundColor: '#0088FF',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 10,
    },
    saveButtonText: {
        color: '#ffffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    cancelButton: {
        backgroundColor: '#303030ff',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        
    },
    cancelButtonText: {
        color: '#ffffffff',
        fontSize: 16,
    },
    menuSection: {
        backgroundColor: '#303030ff',
        marginHorizontal: 24,
        borderRadius: 10,
        marginBottom: 30,
    },
    menuItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#858585ff',
    },
    lastMenuItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
    },
    menuItemText: {
        fontSize: 16,
        color: '#ffffff',
    },
    menuItemArrow: {
        fontSize: 24,
        color: '#999',
    },

    // Modal Styles
    modalContainer: {
        flex: 1,
        backgroundColor: '#100f0f',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 24,
        paddingTop: 50,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    modalCloseButton: {
        fontSize: 24,
        color: '#fff',
        width: 30,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    modalContent: {
        flex: 1,
        padding: 20,
    },
    // Payment Card Styles
    paymentCard: {
        backgroundColor: '#1a1a1a',
        borderRadius: 12,
        padding: 20,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#333',
    },
    paymentCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 15,
    },
    paymentCardName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 5,
    },
    paymentCardNumber: {
        fontSize: 16,
        color: '#aaa',
        marginBottom: 3,
    },
    paymentCardExpiry: {
        fontSize: 14,
        color: '#666',
    },
    paymentCardIcon: {
        width: 50,
        height: 35,
        backgroundColor: '#333',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardIconText: {
        fontSize: 24,
    },
    defaultBadge: {
        backgroundColor: '#FFD700',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        alignSelf: 'flex-start',
        marginBottom: 10,
    },
    defaultBadgeText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#333',
    },
    paymentCardActions: {
        flexDirection: 'row',
        gap: 10,
    },
    actionButton: {
        flex: 1,
        padding: 10,
        borderRadius: 8,
        backgroundColor: '#333',
        alignItems: 'center',
    },
    actionButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    deleteButton: {
        backgroundColor: '#ff4444',
    },
    deleteButtonText: {
        color: '#fff',
    },
    addButton: {
        backgroundColor: '#333',
        padding: 18,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10,
        borderWidth: 2,
        borderColor: '#444',
        borderStyle: 'dashed',
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    // Form Styles
    formGroup: {
        marginBottom: 20,
    },
    formLabel: {
        fontSize: 14,
        color: '#fff',
        marginBottom: 8,
        fontWeight: '600',
    },
    formInput: {
        backgroundColor: '#1a1a1a',
        borderWidth: 1,
        borderColor: '#333',
        borderRadius: 8,
        padding: 15,
        fontSize: 16,
        color: '#fff',
    },
    formRow: {
        flexDirection: 'row',
    },
    submitButton: {
        backgroundColor: '#FFD700',
        padding: 18,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 20,
    },
    submitButtonText: {
        color: '#333',
        fontSize: 16,
        fontWeight: 'bold',
    },
    // Document Styles
    documentCard: {
        backgroundColor: '#1c1c1e',
        borderRadius: 12,
        padding: 15,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        
    },
    documentIcon: {
        width: 50,
        height: 50,
        backgroundColor: '#333',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    documentIconText: {
        fontSize: 24,
    },
    documentInfo: {
        flex: 1,
    },
    documentName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 4,
    },
    documentMeta: {
        fontSize: 13,
        color: '#666',
    },
    documentActions: {
        flexDirection: 'row',
        gap: 8,
    },
    documentActionButton: {
        width: 40,
        height: 40,
        backgroundColor: '#333',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    documentActionIcon: {
        fontSize: 18,
    },
    emptyState: {
        padding: 40,
        alignItems: 'center',
    },
    emptyStateText: {
        fontSize: 16,
        color: '#666',
    },
});

export default ProfileScreen;