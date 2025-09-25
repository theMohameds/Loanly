import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import LoginScreen from './frontend/login/LoginScreen';
import MainMenuScreen from './frontend/main_menu/MainMenuScreen';
import RentalScreen from './frontend/car_booking/RentalScreen';
import BookingsScreen from './frontend/bookings/BookingsScreen';
import Profile from './frontend/settings_and_profile/Profile';
import SettingsScreen from './frontend/settings_and_profile/SettingsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
      <Tab.Navigator>
        <Tab.Screen name="MainMenu" component={MainMenuScreen} />
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

export default function App() {
  const isLoggedIn = true;

  return (
      <NavigationContainer>
        {isLoggedIn ? (
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name="MainTabs" component={MainTabs} />
              <Stack.Screen name="Rental" component={RentalScreen} />
            </Stack.Navigator>
        ) : (
            <Stack.Navigator>
              <Stack.Screen name="Login" component={LoginScreen} />
            </Stack.Navigator>
        )}
      </NavigationContainer>
  );
}
