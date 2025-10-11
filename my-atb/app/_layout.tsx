import {DarkTheme, DefaultTheme, ThemeProvider} from '@react-navigation/native';
import {Stack} from 'expo-router';
import {StatusBar} from 'expo-status-bar';
import 'react-native-reanimated';
import "../global.css";
import Header from "@/components/ui/header";
import {useColorScheme} from '@/hooks/use-color-scheme';
import { SafeAreaView } from 'react-native-safe-area-context';

export const unstable_settings = {
    anchor: '(tabs)',
};
export default function RootLayout() {
    const colorScheme = useColorScheme();

    // Використовуємо require для логотипу
    const logo = require('../assets/images/splash-atb.jpg');

    return (
        <SafeAreaView style={{flex: 1}}>
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                <Header logo={logo} title="ATB Магазин"/>
                <Stack>
                    <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
                </Stack>
                <StatusBar style="auto"/>
            </ThemeProvider>
        </SafeAreaView>
    );
}