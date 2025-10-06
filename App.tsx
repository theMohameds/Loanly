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
import BookingDetailsScreen from './frontend/bookings/BookingDetailsScreen';
import Profile from './frontend/settings_and_profile/Profile';
import SettingsScreen from './frontend/settings_and_profile/SettingsScreen';
import RentalSearchScreen from './frontend/car_booking/RentalSearchScreen';
import AvailableCarsScreen from './frontend/car_booking/AvailableCarsScreen';
import ConfirmationScreen from "./frontend/car_booking/ConfirmationScreen";
import AddCarScreen from "./frontend/add_car_to_fleet/AddCarScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: "#000" },
                headerTintColor: "#fff",
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: "#101010",
                    borderTopColor: "transparent",
                },
                tabBarActiveTintColor: "#fff",
                tabBarInactiveTintColor: "#909090",
            }}
        >
            <Tab.Screen name="MainMenu" component={HomeScreen} options={{ title: "Home", tabBarIcon: ({ color, size }) => (<Ionicons name="home" color={color} size={size} />), }} />
            <Tab.Screen name="Bookings" component={BookingsStack} options={{ title: "Bookings", tabBarIcon: ({ color, size }) => (<Ionicons name="calendar" color={color} size={size} />), }} />
            <Tab.Screen name="ProfileStack" component={ProfileStack} options={{ title: "Profile", tabBarIcon: ({ color, size }) => (<Ionicons name="person" color={color} size={size} />), }} />
            <Tab.Screen name="SettingsStack" component={SettingsStack} options={{ title: "Settings", tabBarIcon: ({ color, size }) => (<Ionicons name="settings" color={color} size={size} />), }} />
        </Tab.Navigator>
    );
}


function AddCarStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: "#252525ff" },
                headerTintColor: "#fff",
            }}
        >
            <Stack.Screen
                name="AddCar"
                component={AddCarScreen}
                options={({ navigation }) => ({
                    title: "Add Car",
                    headerTitleAlign: "center",
                    headerLeft: () => (
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            style={{ flexDirection: "row", alignItems: "center" }}
                        >
                            <Ionicons name="chevron-back" size={24} color="#fff" />
                        </TouchableOpacity>
                    ),
                })}
            />
        </Stack.Navigator>
    );
}

function LoginStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="StartScreen" component={MainMenuScreen} />
            <Stack.Screen name="LoginOptions" component={LoginOptionsScreen} />
            <Stack.Screen name="EmailLogin" component={EmailLoginScreen} />
        </Stack.Navigator>
    );
}

function ProfileStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Profile" component={Profile} />
        </Stack.Navigator>
    );
}

function SettingsStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Settings" component={SettingsScreen} />
        </Stack.Navigator>
    );
}


function BookingsStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: "#252525ff" },
                headerTintColor: "#fff",
            }}
        >
            <Stack.Screen
                name="BookingsList"
                component={BookingsScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="BookingDetails"
                component={BookingDetailsScreen}
                options={{
                    title: "Booking",
                    headerTitleAlign: "center",
                    headerTitleStyle: {
                        fontSize: 22,
                        fontWeight: 'bold',
                        color: "#ffffff",

                    },
                }}
            />
        </Stack.Navigator>
    );
}


function RentalStack({ route }: any) {
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: "#212121ff", },
                headerTintColor: "#fff",
            }}
        >
            <Stack.Screen
                name="RentalSearch"
                component={RentalSearchScreen}
                options={({ navigation }) => ({
                    title: "Search",
                    headerTitleAlign: "center",
                    headerTitleStyle: {
                        fontSize: 22,
                        fontWeight: "bold",
                        color: "#ffffff",
                    },
                    headerLeft: () => (
                        <TouchableOpacity
                            onPress={() => navigation.navigate("MainTabs")}
                            style={{ flexDirection: "row", alignItems: "center", }}
                        >
                            <Ionicons name="chevron-back" size={24} color="#fff" />
                            <Text style={{ color: "#fff", fontSize: 17, marginLeft: 0 }}></Text>
                        </TouchableOpacity>
                    ),
                })}
            />
            <Stack.Screen
                name="AvailableCars"
                component={AvailableCarsScreen}
                options={({ navigation }) => ({
                    title: "Available Cars",
                    headerTitleAlign: "center",
                    headerTitleStyle: {
                        fontSize: 22,
                        fontWeight: "bold",
                        color: "#ffffff",
                    },
                    headerLeft: () => (
                        <TouchableOpacity
                            onPress={() => navigation.navigate("MainTabs")}
                            style={{ flexDirection: "row", alignItems: "center" }}
                        >
                            <Ionicons name="chevron-back" size={24} color="#fff" />
                            <Text style={{ color: "#fff", fontSize: 17, marginLeft: 0 }}></Text>
                        </TouchableOpacity>
                    ),
                })}
            />
            <Stack.Screen name="Confirmation" component={ConfirmationScreen}
                options={{
                    title: "Confirm Booking",
                    headerTitleAlign: "center",
                    headerTitleStyle: {
                        fontSize: 22,
                        fontWeight: "bold",
                        color: "#ffffff",
                    },
                }} />
        </Stack.Navigator>
    );
}

export default function App() {
    const isLoggedIn = true;

    return (
        <NavigationContainer>
            <StatusBar barStyle="dark-content" backgroundColor="#000" />
            {isLoggedIn ? (
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="MainTabs" component={MainTabs} />
                    <Stack.Screen name="Rental" component={RentalStack} />
                    <Stack.Screen name="AddCarStack" component={AddCarStack} />
                </Stack.Navigator>
            ) : (
                <LoginStack />
            )}
        </NavigationContainer>
    );
}
