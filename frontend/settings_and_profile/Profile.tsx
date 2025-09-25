import React from 'react';
import { View, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type RootStackParamList = {
    Profile: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

const Profile: React.FC<Props> = ({ navigation }) => {
    return (
        <View>
            <Text>Profile Screen</Text>
        </View>
    );
};