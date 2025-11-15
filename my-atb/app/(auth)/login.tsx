import React from 'react';
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
import { useRouter } from 'expo-router';
import axios from 'axios';
import {useAuth} from "@/context/AuthContext";
import { API_URL } from '@/constants/api';


interface LoginValues {
    email: string;
    password: string;
}

const Login: React.FC = () => {
    const router = useRouter();
    const { login } = useAuth();

    const validationSchema = Yup.object().shape({
        email: Yup.string().email('Некоректний email').required('Email обов’язковий'),
        password: Yup.string().required('Пароль обов’язковий'),
    });

    const handleLogin = async (values: LoginValues) => {
        try {
            const url = `${API_URL}/Account/Login`;
            const response = await axios.post(url, {
                email: values.email,
                password: values.password
            });

            console.log('Login response:', response.data);

            const { token, user } = response.data;
            if (token) {
                login(token, user);
                router.replace('/(tabs)/home');
            } else {
                Alert.alert('Помилка', 'Невірні дані для входу');
            }
        } catch (error: any) {
            console.log('Login error', error.response?.data || error.message);
            Alert.alert(
                'Помилка входу',
                error.response?.data?.title || 'Невірний email або пароль'
            );
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
