import React from 'react';
import {
    View,
    Text,
    Image,
    TextInput,
    ScrollView,
    Pressable,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { Formik } from 'formik';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { pickImage } from '@/utils/pickImage';
import { getFileFromUriAsync } from '@/utils/getFileFromUriAsync';
import images from '@/constants/images';
import { serialize } from 'object-to-formdata';
import { validate } from '@/utils/validations';
import { useAuth } from '../context/AuthContext';

const getValidationErrors = (values: any) => {
    const errors: Record<string, string> = {};

    const firstNameError = validate(values.firstName, [
        { rule: 'required', message: "Ім'я обов'язкове" },
        { rule: 'min', value: 2, message: "Мінімум 2 символи" },
        { rule: 'max', value: 40, message: "Максимум 40 символів" },
    ]);
    if (firstNameError) errors.firstName = firstNameError;

    const emailError = validate(values.email, [
        { rule: 'required', message: "Email обов'язковий" },
        { rule: 'regexp', value: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$', message: "Некоректний email" },
    ]);
    if (emailError) errors.email = emailError;

    const passwordError = validate(values.password, [
        { rule: 'required', message: "Пароль обов'язковий" },
        { rule: 'min', value: 6, message: "Мінімум 6 символів" },
        { rule: 'max', value: 40, message: "Максимум 40 символів" },
        { rule: 'regexp', value: '[0-9]', message: "Має містити цифру" },
        { rule: 'regexp', value: '[!@#$%^&*(),.?":{}|<>]', message: "Має містити спецсимвол" },
    ]);
    if (passwordError) errors.password = passwordError;

    const confirmPasswordError = validate(values.confirmPassword, [
        { rule: 'equals', value: values.password, message: "Паролі не співпадають" },
    ]);
    if (confirmPasswordError) errors.confirmPassword = confirmPasswordError;

    return errors;
};

const Register: React.FC = () => {
    const router = useRouter();
    const { login } = useAuth();
    const [loading, setLoading] = React.useState(false);

    const submit = async (values: any) => {
        setLoading(true);
        try {
            const formData = serialize(
                {
                    firstName: values.firstName,
                    email: values.email,
                    password: values.password,
                    userName: values.email,
                },
                { indices: true }
            );

            if (values.imageUrl) {
                const fileImage = await getFileFromUriAsync(values.imageUrl);
                if (fileImage) formData.append('ImageFile', fileImage as any);
            }

            const url = 'http://10.0.2.2:5267/api/Account/Register';
            const response = await axios.post(url, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            const { token } = response.data;

            if (token ) {
                login(token);
                router.replace('/(tabs)');
            } else {
                Alert.alert('Помилка', 'Невірна відповідь від сервера');
            }
        } catch (err: any) {
            console.log('Submit error', err.response?.data || err.message);
            const message =
                err.response?.data?.errors?.map((e: any) => e.description).join('\n') ||
                'Спробуйте ще раз';
            Alert.alert('Помилка при реєстрації', message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <ScrollView>
                    <View className="flex-1 pt-24 pb-10 items-center w-[90%] max-w-[400px] self-center">
                        <Text className="text-3xl font-bold mb-6 text-black text-center">
                            Реєстрація
                        </Text>

                        <Formik
                            initialValues={{ firstName: '', email: '', password: '', confirmPassword: '', imageUrl: '' }}
                            validate={getValidationErrors}
                            onSubmit={submit}
                        >
                            {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, touched, errors }) => (
                                <View className="w-3/4">
                                    <TouchableOpacity
                                        className="mb-5 self-center mx-2 w-[200px] h-[200px] rounded-full overflow-hidden"
                                        onPress={async () => {
                                            const uri = await pickImage();
                                            if (uri) setFieldValue('imageUrl', uri);
                                        }}
                                    >
                                        <Image
                                            source={values.imageUrl ? { uri: values.imageUrl } : images.noimage}
                                            className="object-cover w-full h-full"
                                        />
                                    </TouchableOpacity>

                                    <TextInput
                                        placeholder="Ім'я"
                                        className="border border-gray-300 p-3 mb-2 rounded"
                                        onChangeText={handleChange('firstName')}
                                        onBlur={handleBlur('firstName')}
                                        value={values.firstName}
                                    />
                                    {touched.firstName && errors.firstName && (
                                        <Text className="text-red-500">{errors.firstName}</Text>
                                    )}

                                    <TextInput
                                        placeholder="Email"
                                        className="border border-gray-300 p-3 mb-2 rounded"
                                        keyboardType="email-address"
                                        onChangeText={handleChange('email')}
                                        onBlur={handleBlur('email')}
                                        value={values.email}
                                    />
                                    {touched.email && errors.email && (
                                        <Text className="text-red-500">{errors.email}</Text>
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
                                        <Text className="text-red-500">{errors.password}</Text>
                                    )}

                                    <TextInput
                                        placeholder="Повторити пароль"
                                        className="border border-gray-300 p-3 mb-2 rounded"
                                        secureTextEntry
                                        onChangeText={handleChange('confirmPassword')}
                                        onBlur={handleBlur('confirmPassword')}
                                        value={values.confirmPassword}
                                    />
                                    {touched.confirmPassword && errors.confirmPassword && (
                                        <Text className="text-red-500">{errors.confirmPassword}</Text>
                                    )}

                                    <Pressable
                                        onPress={handleSubmit as any}
                                        className="bg-blue-500 p-3 rounded mt-4 flex-row justify-center items-center"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <Text className="text-white font-bold">Завантаження...</Text>
                                        ) : (
                                            <Text className="text-white text-center font-bold">Зареєструватися</Text>
                                        )}
                                    </Pressable>

                                    <View className="flex-row justify-center mt-4">
                                        <Text className="text-gray-600">Маєш акаунт? </Text>
                                        <Pressable onPress={() => router.push("/(auth)/login")}>
                                            <Text className="text-blue-500 font-semibold">Залогінься!</Text>
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

export default Register;
