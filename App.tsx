import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar, TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import LoginScreen from './frontend/login/LoginScreen';
import LoginOptionsScreen from './frontend/login/LoginOptionsScreen';
import EmailLoginScreen from './frontend/login/EmailLoginScreen';

import MainMenuScreen from './frontend/main_menu/MainMenuScreen';
import BookingsScreen from './frontend/bookings/BookingsScreen';
import Profile from './frontend/settings_and_profile/Profile';
import SettingsScreen from './frontend/settings_and_profile/SettingsScreen';
import RentalSearchScreen from './frontend/car_booking/RentalSearchScreen';
import AvailableCarsScreen from './frontend/car_booking/AvailableCarsScreen';
import ConfirmationScreen from "./frontend/car_booking/ConfirmationScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
    return (
        <Tab.Navigator>
            <Tab.Screen name="MainMenu" component={MainMenuScreen} options={{ headerShown: false }} />
            <Tab.Screen name="Bookings" component={BookingsScreen} />
            <Tab.Screen name="ProfileStack" component={ProfileStack} options={{ title: "Profile" }} />
        </Tab.Navigator>
    );
}

function ProfileStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
        </Stack.Navigator>
    );
}

function RentalStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: "#000" },
                headerTintColor: "#fff",
            }}
        >
            <Stack.Screen
                name="RentalSearch"
                component={RentalSearchScreen}
                options={({ navigation }) => ({
                    title: "",
                    headerLeft: () => (
                        <TouchableOpacity
                            onPress={() => navigation.navigate("MainTabs")}
                            style={{ flexDirection: "row", alignItems: "center" }}
                        >
                            <Ionicons name="chevron-back" size={24} color="#fff" />
                            <Text style={{ color: "#fff", fontSize: 17, marginLeft: 0 }}>Back</Text>
                        </TouchableOpacity>
                    ),
                })}
            />
            <Stack.Screen name="AvailableCars" component={AvailableCarsScreen} options={{ title: "" }} />
            <Stack.Screen name="Confirmation" component={ConfirmationScreen} options={{ title: "" }} />
        </Stack.Navigator>
    );
}

export default function App() {
    const isLoggedIn = true; // can be changed to false if you want to test the login flow

    return (
        <NavigationContainer>
            <StatusBar barStyle="light-content" backgroundColor="#000" />
            {isLoggedIn ? (
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="MainTabs" component={MainTabs} />
                    <Stack.Screen name="Rental" component={RentalStack} />

                    <Stack.Screen name="LoginOptions" component={LoginOptionsScreen} />
                    <Stack.Screen name="EmailLogin" component={EmailLoginScreen} />
                </Stack.Navigator>
            ) : (
                <Stack.Navigator>
                    <Stack.Screen name="Login" component={LoginScreen} />
                </Stack.Navigator>
            )}
        </NavigationContainer>
    );
}
