import React from 'react';
import { View, SafeAreaView, Image } from 'react-native';

interface HeaderProps {
    title?: string;
    logo?: any;
}

const Header: React.FC<HeaderProps> = ({ title = 'Магазин', logo }) => {
    return (
        <SafeAreaView>
            <View className="flex-row items-center justify-start p-4 bg-[#3d3f42] shadow-md">
                {logo && (
                    <Image
                        source={logo}
                        className="w-12 h-12 mr-3 "
                        resizeMode="contain"
                    />
                )}
            </View>
        </SafeAreaView>
    );
};

export default Header;
