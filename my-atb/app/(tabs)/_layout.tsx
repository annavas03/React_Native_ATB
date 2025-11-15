import { Tabs } from 'expo-router';
import React from 'react';
import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { View } from 'react-native';

export default function TabLayout() {
    return (
            <Tabs
                screenOptions={{
                    tabBarActiveTintColor: 'white',
                    headerShown: false,
                    tabBarButton: HapticTab,
                    tabBarStyle: {display: "none"},
                }}
            >
                <Tabs.Screen
                    name="home"
                    options={{
                        title: 'Home',
                        tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color="white" />,
                    }}
                />
            </Tabs>

    );
}