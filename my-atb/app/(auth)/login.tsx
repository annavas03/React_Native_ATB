import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Alert,
    ScrollView,
    Pressable,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { router } from 'expo-router';
import * as FileSystem from 'expo-file-system';
import { useAuth } from '../context/AuthContext'

const USERS_FILE_PATH = `${FileSystem.documentDirectory}users.json`;

interface User {
    name: string;
    email: string;
    password: string;
}

interface LoginValues {
    email: string;
    password: string;
}

interface LoginProps {
    switchToRegister: () => void;
}

const Login: React.FC<LoginProps> = ({ switchToRegister }) => {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const fileContent = await FileSystem.readAsStringAsync(USERS_FILE_PATH);
                setUsers(JSON.parse(fileContent));
                console.log('📄 Користувачі завантажені для логіну:', USERS_FILE_PATH);
            } catch (error) {
                console.log('❌ Помилка при завантаженні користувачів для логіну:', error);
            }
        };
        loadUsers();
    }, []);

    const validationSchema = Yup.object().shape({
        email: Yup.string().email('Некоректний email').required('Email обов’язковий'),
        password: Yup.string().required('Пароль обов’язковий'),
    });
    const { login } = useAuth();

    const handleLogin = async (values: LoginValues) => {
        const user = users.find(u => u.email === values.email && u.password === values.password);
        if (user) {
            login();
            router.replace('/(tabs)');
        } else {
            Alert.alert('Помилка', 'Невірний email або пароль');
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <ScrollView>
                    <View className="flex-1 pt-24 pb-10 items-center w-[350px] max-w-[400px] h-[500px] self-center">
                        <Text className="text-3xl font-bold mb-6 text-black text-center">
                            Логін
                        </Text>

                        <Formik
                            initialValues={{ email: '', password: '' }}
                            validationSchema={validationSchema}
                            onSubmit={handleLogin}
                        >
                            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                                <View className="w-3/4">
                                    <TextInput
                                        placeholder="Email"
                                        className="border border-gray-300 p-3 mb-2 rounded"
                                        keyboardType="email-address"
                                        onChangeText={handleChange('email')}
                                        onBlur={handleBlur('email')}
                                        value={values.email}
                                    />
                                    {touched.email && errors.email && (
                                        <Text className="text-red-500 mb-2">{errors.email}</Text>
                                    )}

                                    <TextInput
                                        placeholder="Пароль"
                                        className="border border-gray-300 p-3 mb-2 rounded"
                                        secureTextEntry
                                        onChangeText={handleChange('password')}
                                        onBlur={handleBlur('password')}
                                        value={values.password}
                                    />
                                    {touched.password && errors.password && (
                                        <Text className="text-red-500 mb-4">{errors.password}</Text>
                                    )}

                                    <Pressable
                                        onPress={handleSubmit as any}
                                        className="bg-green-500 p-3 rounded"
                                    >
                                        <Text className="text-white text-center font-bold">
                                            Увійти
                                        </Text>
                                    </Pressable>

                                    <View className="flex-row justify-center mt-4">
                                        <Text className="text-gray-600">Не маєш акаунту? </Text>
                                        <Pressable onPress={() => router.push("/(auth)/register")}>
                                            <Text className="text-blue-500 font-semibold">Зареєструйся!</Text>
                                        </Pressable>
                                    </View>
                                </View>
                            )}
                        </Formik>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default Login;
