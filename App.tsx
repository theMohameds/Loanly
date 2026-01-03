import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import LoginOptionsScreen from './frontend/login/LoginOptionsScreen';
import EmailLoginScreen from './frontend/login/EmailLoginScreen';
import MainMenuScreen from './frontend/main_menu/MainMenuScreen';
import HomeScreen from './frontend/main_menu/HomeScreen';
import BookingsScreen from './frontend/bookings/BookingsScreen';
import BookingDetailsScreen from './frontend/bookings/BookingDetailsScreen';
import Profile from './frontend/settings_and_profile/Profile';
import SettingsScreen from './frontend/settings_and_profile/SettingsScreen';
import ConfirmationScreen from "./frontend/car_booking/ConfirmationScreen";
import AddCarScreen from "./frontend/add_car_to_fleet/AddCarScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();


function MainTabs({ onSignedOut }: { onSignedOut: () => void }) {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#000" },
        headerTintColor: "#fff",
        headerShown: false,
        tabBarStyle: { backgroundColor: "#101010", borderTopColor: "transparent" },
        tabBarActiveTintColor: "#fff",
        tabBarInactiveTintColor: "#909090",
      }}
    >
      <Tab.Screen
        name="MainMenu"
        component={HomeScreen}
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => <Ionicons name="home" color={color} size={size} />
        }}
      />
      <Tab.Screen
        name="Bookings"
        component={BookingsStack}
        options={{
          title: "Bookings",
          tabBarIcon: ({ color, size }) => <Ionicons name="bookmark" color={color} size={size} />
        }}
      />
      <Tab.Screen
        name="AddCarTab"
        component={AddCarStack}
        options={{
          title: "Add Car",
          tabBarIcon: ({ color, size }) => <Ionicons name="add-circle" color={color} size={size} />
        }}
      />
      <Tab.Screen
        name="ProfileStack"
        children={() => <ProfileStack onSignedOut={onSignedOut} />}
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => <Ionicons name="person-circle" color={color} size={size} />
        }}
      />
    </Tab.Navigator>
  );
}

function ProfileStack({ onSignedOut }: { onSignedOut: () => void }) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#1d1d1d" },
        headerTintColor: "#fff",
        headerTitleAlign: "center",
        
      }}
    >
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{ title: "My Profile" }}
      />
      <Stack.Screen
        name="SettingsScreen"
        options={{ title: "Settings" }}
      >
        {props => <SettingsScreen {...props} onSignedOut={onSignedOut} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}


function BookingsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#1d1d1d" },
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
          headerTitleStyle: { fontSize: 22, fontWeight: 'bold', color: "#fff" },
        }}
      />
    </Stack.Navigator>
  );
}


function AddCarStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#1d1d1d" },
        headerTintColor: "#fff",
        headerShown: false
      }}
    >
      <Stack.Screen
        name="AddCar"
        component={AddCarScreen}
        options={{
          title: "Add Car",
          headerTitleAlign: "center",
          headerTitleStyle: { fontSize: 22, fontWeight: 'bold', color: "#fff" },
        }}
      />
    </Stack.Navigator>
  );
}

function LoginStack({ onSignedIn }: { onSignedIn: () => void }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainMenu" component={MainMenuScreen} />
      <Stack.Screen name="LoginOptions">
        {props => <LoginOptionsScreen {...props} onSignedIn={onSignedIn} />}
      </Stack.Screen>
      <Stack.Screen name="EmailLogin">
        {props => <EmailLoginScreen {...props} onSignedIn={onSignedIn} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}


export default function App() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" backgroundColor="#000" />
      {isLoggedIn ? (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen
            name="MainTabs"
            children={props => <MainTabs {...props} onSignedOut={() => setIsLoggedIn(false)} />}
          />
          <Stack.Screen
            name="Confirmation"
            component={ConfirmationScreen}
            options={{
              title: "Book Car",
              headerShown: true,
              headerTitleAlign: "center",
              headerStyle: { backgroundColor: "#1d1d1d" },
              headerTintColor: "#fff",
              headerTitleStyle: { fontSize: 22, fontWeight: 'bold', color: "#fff" },
            }}
          />
        </Stack.Navigator>
      ) : (
        <LoginStack onSignedIn={() => setIsLoggedIn(true)} />
      )}
    </NavigationContainer>
  );
}
