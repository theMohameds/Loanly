import React from 'react';
import { View, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type RootStackParamList = {
    Booking: { carId: string };
};

type Props = NativeStackScreenProps<RootStackParamList, 'RentalScreen'>;

export default function BookingScreen({ route }: Props) {
    const { carId } = route.params;

    return (
        <View>
        </View>
    );
}