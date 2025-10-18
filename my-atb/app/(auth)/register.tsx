import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Image,
    TextInput,
    Alert,
    ScrollView,
    Pressable,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
} from 'react-native';
import { Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { router } from 'expo-router';
import usersData from '../../users.json';
import * as FileSystem from 'expo-file-system';
import {pickImage} from "@/utils/pickImage";
import images from "@/constants/images";

const USERS_FILE_PATH = `${FileSystem.documentDirectory}users.json`;

interface User {
    name: string;
    email: string;
    password: string;
    imageUrl: string;
}

interface FormValues {
    name: string;
    email: string;
    password: string;
    imageUrl: string;
}


const Register: React.FC = () => {

    const [existingUsers, setExistingUsers] = useState<User[]>([]);

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const fileInfo = await FileSystem.getInfoAsync(USERS_FILE_PATH);

                if (fileInfo.exists) {
                    const fileContent = await FileSystem.readAsStringAsync(USERS_FILE_PATH);
                    setExistingUsers(JSON.parse(fileContent));
                    console.log('📄 Користувачі завантажені з файлу:', USERS_FILE_PATH);
                } else {
                    await FileSystem.writeAsStringAsync(
                        USERS_FILE_PATH,
                        JSON.stringify(usersData, null, 2)
                    );
                    setExistingUsers(usersData);
                    console.log('🆕 Створено новий файл користувачів');
                }
            } catch (error) {
                console.log('❌ Помилка при завантаженні користувачів:', error);
            }
        };
        loadUsers();
    }, []);

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Ім’я обов’язкове'),
        email: Yup.string().email('Некоректний email').required('Email обов’язковий'),
        password: Yup.string().min(6, 'Пароль має бути не менше 6 символів').required('Пароль обов’язковий'),
    });

    const handleRegister = async (
        values: FormValues,
        { resetForm }: FormikHelpers<FormValues>
    ) => {
        const userExists = existingUsers.find(u => u.email === values.email);

        if (userExists) {
            Alert.alert('Помилка', 'Користувач з таким email вже існує');
            return;
        }

        const newUser: User = {
            name: values.name,
            email: values.email,
            password: values.password,
            imageUrl: values.imageUrl,
        };

        const updatedUsers = [...existingUsers, newUser];

        try {
            await FileSystem.writeAsStringAsync(
                USERS_FILE_PATH,
                JSON.stringify(updatedUsers, null, 2)
            );

            setExistingUsers(updatedUsers);
            console.log('✅ Користувача збережено у файл:', newUser);

            Alert.alert('Успіх', 'Реєстрація пройшла успішно');
            resetForm();
            router.push('/(tabs)');
        } catch (error) {
            console.log('❌ Помилка збереження користувача:', error);
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
                            initialValues={{ name: '', email: '', password: '', imageUrl: '' }}
                            validationSchema={validationSchema}
                            onSubmit={handleRegister}
                        >
                            {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, errors, touched }) => (
                                <View className="w-3/4">

                                    <TouchableOpacity
                                        className="mb-5 self-center mx-2 w-[200px] h-[200px] rounded-full overflow-hidden"
                                        onPress={async () => {
                                            const uri = await pickImage();
                                            if (uri) setFieldValue('imageUrl', uri);
                                        }}
                                    >
                                        <Image
                                            source={
                                                values.imageUrl
                                                    ? { uri: values.imageUrl }
                                                    : images.noimage
                                            }
                                            className="object-cover w-full h-full"
                                        />
                                    </TouchableOpacity>

                                    <TextInput
                                        placeholder="Ім'я"
                                        className="border border-gray-300 p-3 mb-2 rounded"
                                        onChangeText={handleChange('name')}
                                        onBlur={handleBlur('name')}
                                        value={values.name}
                                    />
                                    {touched.name && errors.name && (
                                        <Text className="text-red-500 mb-2">{errors.name}</Text>
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
                                        className="bg-blue-500 p-3 rounded"
                                    >
                                        <Text className="text-white text-center font-bold">
                                            Зареєструватися
                                        </Text>
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
