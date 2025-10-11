import React, { useState } from 'react';
import { View } from 'react-native';
import Register from "@/app/(auth)/register";
import Login from "@/app/(auth)/login";
import { Ionicons } from '@expo/vector-icons';

const AuthTab: React.FC = () => {
    const [isLogin, setIsLogin] = useState(false);

    return (
        <View style={{ flex: 1 }}>
            {isLogin ? (
                <Login switchToRegister={() => setIsLogin(false)} />
            ) : (
                <Register switchToLogin={() => setIsLogin(true)} />
            )}
        </View>
    );
};

export default AuthTab;
