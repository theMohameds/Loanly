import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import app from "../../firebaseConfig";
import { Alert } from "react-native";

const auth = getAuth(app);

export const loginWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    // Successful login
    return { user: userCredential.user, error: null };
  } catch (error: any) {
    // Firebase returns a code and message
    return { user: null, error: error.message };
  }
};

const handleSignOut = () => {
    Alert.alert(
        'Sign Out',
        'Are you sure you want to sign out?',
        [
            { text: 'Cancel', style: 'cancel' },
            { 
                text: 'Sign Out', 
                onPress: async () => {
                    try {
                        await signOut(auth);
                        console.log('User signed out');
                        // TODO: navigate to login screen
                    } catch (error) {
                        console.error('Error signing out:', error);
                        Alert.alert('Error', 'Failed to sign out. Please try again.');
                    }
                } 
            },
        ],
        { cancelable: true }
    );
};
