import React from 'react';
import { View, SafeAreaView, Image } from 'react-native';

interface HeaderProps {
    title?: string;
    logo?: any;
}

const Header: React.FC<HeaderProps> = ({ title = 'Магазин', logo }) => {
    return (
        <SafeAreaView>
            <View className="flex-row items-center justify-start p-4 bg-gray-500 shadow-md">
                {logo && (
                    <Image
                        source={logo}
                        className="w-10 h-10 mr-3 "
                        resizeMode="contain"
                    />
                )}
            </View>
        </SafeAreaView>
    );
};

export default Header;
