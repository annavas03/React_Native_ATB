import { DefaultTheme, ThemeProvider} from '@react-navigation/native';
import {router, Stack} from 'expo-router';
import {StatusBar} from 'expo-status-bar';
import 'react-native-reanimated';
import "../global.css";
import Header from "@/components/ui/header";
import {SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context";
import { AuthProvider } from './context/AuthContext';

export const unstable_settings = {
    anchor: '(tabs)',
};

const logo = require('../assets/images/splash-atb.jpg');

export default function RootLayout() {
    return (
        <AuthProvider>
            <SafeAreaProvider>
                <SafeAreaView style={{flex: 1}} edges={['top']}>
                    <ThemeProvider value={DefaultTheme}>
                        <Header logo={logo} title="ATB Магазин"/>
                        <Stack>
                            <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
                            <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
                            <Stack.Screen name="(auth)/register" options={{ headerShown: false }} />
                        </Stack>
                        <StatusBar style="auto"/>
                    </ThemeProvider>
                </SafeAreaView>
            </SafeAreaProvider>
        </AuthProvider>
    );
}