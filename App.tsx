import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar, TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import LoginOptionsScreen from './frontend/login/LoginOptionsScreen';
import EmailLoginScreen from './frontend/login/EmailLoginScreen';
import MainMenuScreen from './frontend/main_menu/MainMenuScreen';
import HomeScreen from './frontend/main_menu/HomeScreen';

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
        <Tab.Navigator initialRouteName="Home">
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Bookings"
                component={BookingsScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="bookmark-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="ProfileStack"
                component={ProfileStack}
                options={{
                    title: "Profile",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person-outline" size={size} color={color} />
                    ),
                }}
            />
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
                            <Text style={{ color: "#fff", fontSize: 17 }}>Back</Text>
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
    return (
        <NavigationContainer>
            <StatusBar barStyle="light-content" backgroundColor="#000" />
            <Stack.Navigator>
                {/* Før login */}
                <Stack.Screen
                    name="MainMenuStart"
                    component={MainMenuScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="LoginOptions"
                    component={LoginOptionsScreen}
                    options={{ title: "Log in or sign up" }}
                />
                <Stack.Screen
                    name="EmailLogin"
                    component={EmailLoginScreen}
                    options={{ title: "Enter your details" }}
                />

                {/* Efter login */}
                <Stack.Screen
                    name="MainTabs"
                    component={MainTabs}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Rental"
                    component={RentalStack}
                    options={{ headerShown: false }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
