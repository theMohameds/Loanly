import React from 'react';
import {
    Modal,
    Pressable,
    KeyboardAvoidingView,
    Platform,
    Text,
    TextInput,
    ActivityIndicator,
    StyleSheet,
    View,
    Dimensions,
} from 'react-native';
import useLocation from './useLocation';

interface LocationModalProps {
    visible: boolean;
    setVisible: (visible: boolean) => void;
    locationText: string;
    setLocationText: (text: string) => void;
    theme: any;
}

export default function LocationModal({
    visible,
    setVisible,
    locationText,
    setLocationText,
    theme,
}: LocationModalProps) {
    const { loadingLocation, getCurrentCity } = useLocation();
    const windowHeight = Dimensions.get('window').height;

    const Separator = ({ height = 2, color = '#E0E0E0', marginVertical = 8 }) => (
        <View style={{ height, backgroundColor: color, marginVertical, width: '100%' }} />
    );

    return (
        <Modal visible={visible} transparent animationType="none">
            <Pressable
                style={styles.overlay}
                onPress={() => setVisible(false)}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1, justifyContent: 'flex-end' }}
                >
                    <Pressable
                        onPress={() => {}}
                        style={[
                            styles.modalContent,
                            {
                                backgroundColor: theme.card,
                                paddingTop: 30,
                                paddingBottom: 40, // increased padding at bottom
                                maxHeight: windowHeight * 0.8, // make sure modal can grow
                            },
                        ]}
                    >
                        <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>
                            Search Location
                        </Text>

                        <Separator marginVertical={15} color="#CCC" />

                        <TextInput
                            value={locationText === 'Anywhere' ? '' : locationText}
                            onChangeText={setLocationText}
                            placeholder="Type city..."
                            placeholderTextColor={theme.textSecondary}
                            style={[
                                styles.locationInput,
                                { backgroundColor: theme.inputBackground, marginBottom: 20 },
                            ]}
                        />

                        <Pressable
                            style={[styles.gpsButton, { backgroundColor: theme.textFilterBackgroundActive, marginBottom: 15 }]}
                            onPress={() => getCurrentCity(setLocationText, setVisible)}
                        >
                            {loadingLocation ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.gpsButtonText}>Use Current Location</Text>
                            )}
                        </Pressable>

                        <Pressable
                            style={[styles.applyButton, { backgroundColor: theme.textFilterBackgroundActive }]}
                            onPress={() => setVisible(false)}
                        >
                            <Text style={styles.applyButtonText}>Apply</Text>
                        </Pressable>
                    </Pressable>
                </KeyboardAvoidingView>
            </Pressable>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        position: 'relative', // changed from absolute
        left: 0,
        right: 0,
        borderTopRightRadius: 24,
        borderTopLeftRadius: 24,
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 10,
    },
    locationInput: {
        width: '100%',
        borderRadius: 12,
        padding: 12,
        fontSize: 16,
        color: '#fff',
    },
    gpsButton: {
        width: '100%',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        elevation: 2,
    },
    gpsButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
    applyButton: {
        width: '100%',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        elevation: 2,
    },
    applyButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
});
