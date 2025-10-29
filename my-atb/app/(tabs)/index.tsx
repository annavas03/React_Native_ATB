import {
    View,
    Text,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    Image,
    ScrollView,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';

const products = [
    { id: 1, title: 'Товар 1', price: 100, image: require('../../assets/product1.jpg') },
    { id: 2, title: 'Товар 2', price: 150, image: require('../../assets/product2.png') },
    { id: 3, title: 'Товар 3', price: 200, image: require('../../assets/product3.png') },
];

export default function HomeScreen() {
    const { isLoggedIn } = useAuth();
    const router = useRouter();

    const switchToLogin = () => {
        router.push('/(auth)/login');
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView className="flex-1">
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    className="flex-1"
                >
                    <ScrollView
                        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20 }}
                        keyboardShouldPersistTaps="handled"
                        className="bg-[#51555b]"
                    >
                        {!isLoggedIn ? (
                            <View className="flex-1 pt-24 pb-10 items-center w-[90%] max-w-[400px] self-center">
                                <Text className="text-4xl font-bold text-white text-center">
                                    Вас вітає АТБ-маркет!
                                </Text>

                                <Image
                                    source={require('../../assets/welcome_sticker.png')}
                                    style={{ width: 350, height: 350 }}
                                />

                                <TouchableOpacity
                                    className="bg-white px-7 py-4 rounded-xl mt-6"
                                    onPress={switchToLogin}
                                >
                                    <Text className="text-gray-600 text-2xl font-semibold">
                                        Увійди щоб купувати
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <View className="pt-10 pb-20">
                                {products.map((product) => (
                                    <View
                                        key={product.id}
                                        className="bg-white rounded-xl p-4 mb-4 h-96"
                                    >
                                        <View className="flex-1 bg-transparent rounded-xl overflow-hidden">
                                            <Image
                                                source={product.image}
                                                className="h-full w-full  object-cover"
                                            />
                                        </View>

                                        <View className="pt-3">
                                            <Text className="text-lg font-bold">{product.title}</Text>
                                            <Text className="text-gray-600">{product.price} ₴</Text>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        )}
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
