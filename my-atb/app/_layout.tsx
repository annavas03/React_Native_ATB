import { DefaultTheme, ThemeProvider} from '@react-navigation/native';
import {Stack} from 'expo-router';
import {StatusBar} from 'expo-status-bar';
import 'react-native-reanimated';
import "../global.css";
import Header from "@/components/ui/header";
import {SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context";
import { AuthProvider } from '@/context/AuthContext';
import images from '@/constants/images';

export const unstable_settings = {
    anchor: '(tabs)',
};

const logo = require('../assets/logo.jpg');

export default function RootLayout() {
    return (
        <AuthProvider>
            <SafeAreaProvider>
                <SafeAreaView style={{flex: 1}} edges={['top']}>
                    <ThemeProvider value={DefaultTheme}>
                        <Header logo={images.logo} title="ATB Магазин" />
                        <Stack screenOptions={{ headerShown: false }}>
                            <Stack.Screen name="(auth)/login" />
                            <Stack.Screen name="(auth)/register"/>
                            <Stack.Screen name="user/profile" />
                        </Stack>
                        <StatusBar style="auto"/>
                    </ThemeProvider>
                </SafeAreaView>
            </SafeAreaProvider>
        </AuthProvider>
    );
}