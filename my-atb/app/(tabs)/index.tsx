import {
    View,
    Text,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    Animated,
    TouchableOpacity
} from 'react-native';
import {SafeAreaProvider} from "react-native-safe-area-context";
import ScrollView = Animated.ScrollView;
import {router} from "expo-router";

export default function HomeScreen() {

    const onPressNotFound = () => {
        router.replace("/+not-found");
        // console.log("Press button not found");
    }

    return (
        <>
            <SafeAreaProvider>
                <SafeAreaView className="flex-1">
                    <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? "padding" : "height"}
                        className="flex-1"
                    >
                        <ScrollView
                            contentContainerStyle={{flexGrow: 1, paddingHorizontal: 20}}
                            keyboardShouldPersistTaps="handled"
                        >

                            <View className="flex-1 pt-24 pb-10 items-center w-[90%] max-w-[400px] self-center">
                                <Text className="text-3xl font-bold text-red-600">
                                    Вас вітає АТБ-маркет!
                                </Text>
                            </View>
                        </ScrollView>
                    </KeyboardAvoidingView>
                </SafeAreaView>
            </SafeAreaProvider>

        </>
    );
}


