import * as Location from 'expo-location';
import { useState } from 'react';

export default function useLocation() {
    const [loadingLocation, setLoadingLocation] = useState(false);

    const getCurrentCity = async (
        setLocationText: (city: string) => void,
        setLocationModalVisible: (visible: boolean) => void
    ) => {
        setLoadingLocation(true);
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                alert('Permission to access location was denied');
                setLoadingLocation(false);
                return;
            }
            const loc = await Location.getCurrentPositionAsync({});
            const [place] = await Location.reverseGeocodeAsync({
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude,
            });
            const cityName = place.city || place.region || place.country || 'Anywhere';
            setLocationText(cityName);
            setLocationModalVisible(false);
        } catch (err) {
            console.error(err);
            alert('Failed to get location');
        }
        setLoadingLocation(false);
    };

    return { loadingLocation, getCurrentCity };
}
