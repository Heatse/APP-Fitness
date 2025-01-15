import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native'
import SelectBestPlan from '../../../components/home/SelectBestPlan'
import { Stack, useFocusEffect } from 'expo-router'
import { COLORS, FONT, SIZES } from '../../../constants/theme'
import AdvertiseMentThree from '../../../components/advertisement/AdvertisementThree'
import { SafeAreaView } from 'react-native-safe-area-context'
import AdvertiseMentOne from '../../../components/advertisement/AdvertisementOne'
import AdvertiseMentFour from '../../../components/advertisement/AdvertisementFour'
import React, { useCallback, useState } from 'react'
import ListItem from '../../../components/home/ListItem'
import usePlanQueries from '../../database/tables/plan'
import YourPlans from '../../../components/home/YourPlans'
import useUserQueries from '../../database/tables/user'

const Home = () => {
    const [recommendedPlan, setRecommendedPlan] = useState([])
    const [activePlan, setActivePlan] = useState([])
    const [activePlanDetail, setActivePlanDetail] = useState([])
    const [statistics, setStatistics] = useState()
    const [loading, setLoading] = useState(true)

    const { getRecommendedPlan, getListPlansActive, getListPlansActiveDetail } =
        usePlanQueries()
    const { getWorkoutStatis } = useUserQueries()

    useFocusEffect(
        useCallback(() => {
            fetchData()
        }, [])
    )

    const fetchData = async () => {
        setLoading(true) // Bắt đầu loading
        try {
            const recommended = await getRecommendedPlan()
            setRecommendedPlan(recommended?.data)

            const activePlans = await getListPlansActive()
            setActivePlan(activePlans)

            const activePlansDetail = await getListPlansActiveDetail()
            setActivePlanDetail(activePlansDetail)

            const workoutStats = await getWorkoutStatis()
            if (workoutStats?.success) {
                setStatistics(workoutStats?.data)
            } else {
                console.error(
                    'Error getting workout statistics:',
                    workoutStats?.error
                )
            }
        } catch (err) {
            console.error('Error fetching data:', err)
        } finally {
            setLoading(false) // Kết thúc loading
        }
    }

    if (loading) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                contentContainerStyle={{ paddingBottom: 140 }}
                showsVerticalScrollIndicator={false}
            >
                <Stack.Screen
                    options={{
                        headerShown: false,
                    }}
                />
                <>
                    {activePlan.length > 0 ? (
                        <YourPlans
                            plansActiveDetail={activePlanDetail}
                            statistics={statistics}
                        />
                    ) : (
                        <SelectBestPlan recommendedPlan={recommendedPlan} />
                    )}
                </>

                {listItem.map((item) => (
                    <ListItem key={item.id} item={item} />
                ))}

                <AdvertiseMentThree />
                <AdvertiseMentOne />
            </ScrollView>

            <AdvertiseMentFour style={styles.advertise4} />
        </SafeAreaView>
    )
}

export default Home

const listItem = [
    {
        id: 1,
        title: 'Gain muscle',
        desTitle: 'These plans focus on building muscle mass and strength.',
    },
    {
        id: 2,
        title: 'Lose fat',
        desTitle:
            'There training plans are all about burning fat and calories.',
    },
    {
        id: 3,
        title: 'Get fitter',
        desTitle:
            'These plans are designed to improve or maintain your physical condition.',
    },
]

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.bgColor,
        flex: 1,
        paddingHorizontal: 16,
    },

    headText: {
        flexDirection: 'column',
        width: '100%',
        justifyContent: 'center',
        marginTop: 24,
        alignItems: 'flex-start',
    },
    textIntro: {
        fontSize: SIZES.largeX,
        fontFamily: FONT.bold,
        color: COLORS.text,
    },
    textDes: {
        fontSize: SIZES.medium,
        fontFamily: FONT.regular,
        color: COLORS.text,
        opacity: 0.5,
    },

    advertise4: {
        position: 'absolute',
        bottom: 64,
    },
})
