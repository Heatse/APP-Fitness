import { useFonts } from 'expo-font'
import { Slot } from 'expo-router'
import Navigation from '../components/common/navigation'
import DatabaseProvider from './database'
import Toast from 'react-native-toast-message'
import { Image, View } from 'react-native'
import icon from '../constants/icon'
import { COLORS, FONT } from '../constants/theme'
import { Text } from 'react-native'

export default function RootLayout() {
    const [fontsLoaded] = useFonts({
        Poppins_Thin: require('../assets/font/Poppins/Poppins-Thin.ttf'),
        Poppins_ThinItalic: require('../assets/font/Poppins/Poppins-ThinItalic.ttf'),
        Poppins_ExtraLight: require('../assets/font/Poppins/Poppins-ExtraLight.ttf'),
        Poppins_ExtraLightItalic: require('../assets/font/Poppins/Poppins-ExtraLightItalic.ttf'),
        Poppins_Light: require('../assets/font/Poppins/Poppins-Light.ttf'),
        Poppins_LightItalic: require('../assets/font/Poppins/Poppins-LightItalic.ttf'),
        Poppins_Regular: require('../assets/font/Poppins/Poppins-Regular.ttf'),
        Poppins_Italic: require('../assets/font/Poppins/Poppins-Italic.ttf'),
        Poppins_Mediu: require('../assets/font/Poppins/Poppins-Medium.ttf'),
        Poppins_MediuItalic: require('../assets/font/Poppins/Poppins-MediumItalic.ttf'),
        Poppins_SemiBold: require('../assets/font/Poppins/Poppins-SemiBold.ttf'),
        Poppins_SemiBoldItalic: require('../assets/font/Poppins/Poppins-SemiBoldItalic.ttf'),
        Poppins_Bold: require('../assets/font/Poppins/Poppins-Bold.ttf'),
        Poppins_BoldItalic: require('../assets/font/Poppins/Poppins-BoldItalic.ttf'),
        Poppins_ExtraBold: require('../assets/font/Poppins/Poppins-ExtraBold.ttf'),
        Poppins_ExtraBoldItalic: require('../assets/font/Poppins/Poppins-ExtraBoldItalic.ttf'),
        Poppins_Black: require('../assets/font/Poppins/Poppins-Black.ttf'),
        Poppins_BlackItalic: require('../assets/font/Poppins/Poppins-BlackItalic.ttf'),
    })

    if (!fontsLoaded) {
        return null
    }

    return (
        <>
            <DatabaseProvider>
                <Slot />
                <Navigation />
                <Toast config={toastConfig} />
            </DatabaseProvider>
        </>
    )
}

const toastConfig = {
    cupToast: (props) => {
        const { cupImg, weekNumber, wish } = props?.props
        return (
            <View
                style={{
                    flexDirection: 'row',
                    paddingHorizontal: 8,
                    paddingVertical: 10,
                    width: '90%',
                    alignSelf: 'center',
                    borderRadius: 1000,
                    backgroundColor: 'white',
                    gap: 8,
                }}
            >
                <Image
                    style={{
                        width: 40,
                        height: 40,
                        borderRadius: 1000,
                        aspectRatio: 1,
                    }}
                    source={cupImg || icon.dong}
                />
                <View
                    style={{
                        flexShrink: 1,
                        gap: 4,
                    }}
                >
                    <Text
                        style={{
                            fontSize: 12,
                            fontFamily: FONT.bold,
                            color: COLORS.text,
                        }}
                    >
                        Week {weekNumber || 1}
                    </Text>
                    <Text
                        style={{
                            fontSize: 10,
                            fontFamily: FONT.medium,
                            color: '#383838',
                            flexShrink: 1,
                        }}
                        ellipsizeMode="tail"
                        numberOfLines={2}
                    >
                        {wish || 'Congratulations! You have completed the week'}
                    </Text>
                </View>
            </View>
        )
    },
}
