import React from 'react';
import { View, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type RootStackParamList = {
    Bookings: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'BookingsScreen'>;

const BookingsScreen: React.FC<Props> = ({ navigation }) => {
    return (
        <View>
            <Text>Bookings Screen</Text>
        </View>
    );
};
