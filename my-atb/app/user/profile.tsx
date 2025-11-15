import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Image,
    ScrollView,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import images from '@/constants/images';
import { useRouter } from 'expo-router';
import { API_URL } from '@/constants/api';

const Profile = () => {
    const { token, user, login, logout } = useAuth();
    const router = useRouter();
    const [profile, setProfile] = useState(user);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!token) return;
            setLoading(true);
            try {
                const res = await axios.get(`${API_URL}/Account/GetCurrentUser/current`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setProfile(res.data);
            } catch (err) {
                console.error('Помилка при отриманні профілю', err);
                Alert.alert('Помилка', 'Не вдалося отримати профіль');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [token]);

    const handleLogout = async () => {
        await logout();
        router.replace('/(auth)/login');
    };

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <ScrollView
            contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20 }}
            className="bg-[#51555b] py-10"
        >
            <View className="items-center mb-6">
                <Text className="text-3xl font-bold text-white">Раді вітати у нас знову!</Text>
                <Image
                    source={profile?.image ? { uri: profile.image } : images.noimage}
                    className="w-48 h-48 mt-5 rounded-full border border-gray-300"
                    resizeMode="cover"
                />
            </View>

            <View className="w-full space-y-3 mt-8">
                <Text className="text-left text-[25px] font-bold text-white">
                    {profile?.firstName} {profile?.lastName}
                </Text>
                <Text className="text-left text-[18px] text-base text-white">
                    {profile?.email}
                </Text>
            </View>

            <View className="flex-1 justify-end items-center mt-6">
                <Image
                    source={require('../../assets/userSticker.png')}
                    style={{ width: 300, height: 300 }}
                />
                <TouchableOpacity
                    onPress={handleLogout}
                    className="bg-red-500 px-12 py-3 rounded-full shadow-md active:bg-red-600"
                >
                    <Text className="text-white font-semibold text-lg">Вийти</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

export default Profile;
