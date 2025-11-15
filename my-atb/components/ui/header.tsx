import React from 'react';
import { View, SafeAreaView, Image, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import images from '@/constants/images';

interface HeaderProps {
    title?: string;
    logo?: any;
}

const Header: React.FC<HeaderProps> = ({ title = 'Магазин', logo }) => {
    const { user } = useAuth();
    const router = useRouter();

    const handleProfilePress = () => {
        router.push('/user/profile');
    };
    const handleLogoPress = () => {
        router.push('/(tabs)/home');
    };

    return (
        <SafeAreaView className="bg-[#3d3f42]">
            <View className="flex-row items-center justify-between p-4 shadow-md">
                <View className="flex-row items-center">
                    {logo && (
                        <TouchableOpacity onPress={handleLogoPress}>
                            <Image
                                source={logo}
                                className="w-10 h-10 mr-2"
                                resizeMode="contain"
                            />
                        </TouchableOpacity>
                    )}
                    <Text className="text-white text-xl font-semibold">{title}</Text>
                </View>

                {user && (
                    <TouchableOpacity onPress={handleProfilePress}>
                        <Image
                            source={
                                user.image
                                    ? { uri: `http://10.0.2.2:5267/${user.image}` }
                                    : images.noimage
                            }
                            className="w-10 h-10 rounded-full border-2 border-white"
                        />
                    </TouchableOpacity>
                )}
            </View>
        </SafeAreaView>
    );
};

export default Header;