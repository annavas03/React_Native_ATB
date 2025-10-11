import { Tabs } from 'expo-router';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';


export default function TabLayout() {

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor:'white',
                headerShown: false,
                tabBarButton: HapticTab,
                tabBarStyle: {
                    backgroundColor: '#4f5b66',
                    borderTopWidth: 0,
                    height: 70,
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color="white" />,
                }}
            />
            <Tabs.Screen
                name="auth"
                options={{
                    title: 'Авторизація',
                    tabBarIcon: ({ color }) => <Ionicons name="log-in-outline" size={28} color="white" />,
                }}
            />
        </Tabs>
    );
}
