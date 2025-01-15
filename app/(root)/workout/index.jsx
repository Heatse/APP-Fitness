import { Stack } from 'expo-router'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import AdvertiseMentThree from '../../../components/advertisement/AdvertisementThree'
import ListCategory from '../../../components/workout/ListCategory'
import { COLORS, FONT, SIZES } from '../../../constants/theme'
import AdvertiseMentFour from '../../../components/advertisement/AdvertisementFour'

const Workout = () => {
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContentContainer}>
                <Stack.Screen
                    options={{
                        headerShown: false,
                    }}
                />
                <View style={styles.header}>
                    <View style={styles.wrapTextHead}>
                        <Text style={styles.head1}>Workouts</Text>
                    </View>
                    <Text style={styles.head2}>
                        Select the type of exercise you need information about.
                        Below is a list of the types of exercise we recommend.
                    </Text>
                    <AdvertiseMentThree />
                </View>
                <ListCategory />
            </ScrollView>
            <AdvertiseMentFour style={styles.advertise} />
        </SafeAreaView>
    )
}

export default Workout

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContentContainer: {
        paddingBottom: 140,
    },
    wrapTextHead: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    header: {
        marginBottom: 16,
        paddingHorizontal: 16,
    },
    head1: {
        fontSize: SIZES.largeX,
        fontFamily: FONT.bold,
        color: COLORS.text,
    },
    tickImg: {
        width: 24,
        height: 24,
    },
    head2: {
        fontSize: SIZES.mediumX,
        fontFamily: FONT.regular,
        color: COLORS.text,
        opacity: 0.5,
        marginBottom: 16,
    },
    advertise: {
        position: 'absolute',
        bottom: 64,
        left: 0,
        right: 0,
    },
})
