import React from 'react';
import { View, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type RootStackParamList = {
    MainMenu: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'MainMenu'>;

const MainMenuScreen: React.FC<Props> = ({ navigation }) => {
    return (
        <View>
            <Text>Main Menu Screen</Text>
        </View>
    );
};