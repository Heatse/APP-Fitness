import React, { useEffect, useState } from 'react'
import {
    ActivityIndicator,
    Image,
    ImageBackground,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'
import { COLORS, FONT, SIZES } from '../../../../constants/theme'
import Blur from '../../../../components/common/blur'
import Icon from 'react-native-vector-icons/AntDesign'
import { router, Stack, useLocalSearchParams } from 'expo-router'
import RestDay from '../../../../components/plan/exerciseList/restDay'
import ExerciseDay from '../../../../components/plan/exerciseList/exerciseDay'
import usePlanQueries from '../../../database/tables/plan'
import icon from '../../../../constants/icon'

const ListPlan = () => {
    const { day, id, currentWeek } = useLocalSearchParams()
    const {
        getPlanById,
        getPlanScheduleByDay2,
        addUserPlanProgress,
        getWorkoutStatsByPlan,
    } = usePlanQueries()
    const [plans, setPlans] = useState(null)
    const [exerciseList, setExerciseList] = useState([])
    const [planSchedule, setPlanSchedule] = useState([])
    const [workoutStatic, setWorkoutStatic] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            try {
                const planData = await getPlanById(id)
                setPlans(planData)

                const scheduleData = await getPlanScheduleByDay2(
                    id,
                    currentWeek,
                    day
                )

                const WowkoutStatic = await getWorkoutStatsByPlan(
                    id,
                    currentWeek,
                    day
                )
                setWorkoutStatic(WowkoutStatic)

                if (Array.isArray(scheduleData)) {
                    setPlanSchedule(scheduleData)
                    if (scheduleData.length > 0) {
                        const exerciseDetails =
                            scheduleData[0].list_exercise_details
                                .split(',')
                                .map((item) => item.trim())
                        const exerciseTimes = scheduleData[0].second_list
                            .split(',')
                            .map((item) => parseInt(item.trim(), 10))
                        const exerciseImages =
                            scheduleData[0].list_exercise_images
                                .split(',')
                                .map((item) => item.trim())
                        const exercises = exerciseDetails.map(
                            (name, index) => ({
                                name,
                                seconds: exerciseTimes[index] || 0,
                                image: exerciseImages[index] || 0,
                            })
                        )
                        setExerciseList(exercises)
                    } else {
                        setExerciseList([])
                    }
                } else {
                    console.error('Expected an array but got:', scheduleData)
                    setPlanSchedule([])
                }
            } catch (err) {
                console.error('Error fetching plan details or schedule:', err)
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [id, currentWeek, day])

    const handleMuster = async () => {
        try {
            const result = await addUserPlanProgress(
                plans.plan_name,
                day,
                currentWeek
            )
            console.log('Plan Start successfully!')
            return true
        } catch (error) {
            console.error('Error adding user plan progress:', error)
            return false
        }
    }

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                style={styles.plan}
                showsVerticalScrollIndicator={false}
            >
                <Stack.Screen options={{ headerShown: false }} />
                <ImageBackground
                    source={{
                        uri: `https://drive.google.com/thumbnail?id=${plans?.image_url}&sz=w1000`,
                    }}
                    style={styles.image}
                    resizeMode="cover"
                >
                    <TouchableOpacity
                        style={styles.btnPrev}
                        onPress={() => {
                            router.back();
                        }}
                    >
                        <Icon name="arrowleft" size={24} color="black" />
                    </TouchableOpacity>
                    <Blur style={styles.blurWrap} />
                    <View style={styles.overlay}>
                        <Text style={styles.matchTag}>
                            {plans?.level || 'Best Match'}
                        </Text>
                        <Text
                            style={styles.title}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                        >
                            {plans?.plan_name || 'Full Body'}
                        </Text>
                    </View>
                </ImageBackground>
                <View style={styles.descriptionContainer}>
                    <Text style={styles.titledes}>
                        {plans?.plan_des || 'No plan description available.'}
                    </Text>
                </View>
                <View style={styles.detailsContainer}>
                    <View style={styles.detailBox}>
                        <Image source={icon.timeprimary} style={styles.infoIcon} />
                        <Text style={styles.detailLabel}>
                            {workoutStatic?.data?.total_seconds > 60
                                ? `${Math.floor(workoutStatic?.data?.total_seconds / 60)} Minutes`
                                : `${workoutStatic?.data?.total_seconds} Seconds`}
                        </Text>
                    </View>
                    <View style={styles.detailBox}>
                        <Image source={icon.kcal} style={styles.infoIcon} />
                        <Text style={styles.detailLabel}>
                            {workoutStatic?.data?.total_calories} Kcal
                        </Text>
                    </View>
                </View>

                <Text style={styles.Exertex}> Excersice list</Text>

                {planSchedule.length > 0 ? (
                    <>
                        <ExerciseDay exercises={exerciseList} />

                    </>
                ) : (
                    <>
                        <RestDay />

                    </>
                )}
            </ScrollView>
            {planSchedule.length > 0 ? (
                <>
                    <View style={styles.fixedFooter}>
                        <TouchableOpacity
                            style={styles.btnStart}
                            onPress={async () => {
                                const success = await handleMuster()
                                if (success) {
                                    router.push({
                                        pathname: `/plan/readyToStart`,
                                        params: {
                                            day,
                                            id,
                                            currentWeek,
                                        },
                                    })
                                }
                            }}
                        >
                            <Text style={styles.btnText}>Started</Text>
                        </TouchableOpacity>
                    </View>
                </>

            ) : (
                <>
                    <View style={styles.fixedFooter}>
                        <TouchableOpacity
                            style={styles.btnStart}
                            onPress={async () => {
                                await handleMuster(); // Gọi hàm handleMuster
                                router.back(); // Quay lại màn hình trước
                            }}

                        >
                            <Text style={styles.btnText}>Started</Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}

        </SafeAreaView>
    )
}

export default ListPlan

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    plan: {
        backgroundColor: COLORS.bgColor,
        flex: 1,
    },
    image: {
        width: '100%',
        aspectRatio: 1.63755458515,
        justifyContent: 'flex-end',
    },
    btnPrev: {
        position: 'absolute',
        top: 56,
        left: 16,
    },
    overlay: {
        alignItems: 'center',
        paddingVertical: 10,
    },
    matchTag: {
        backgroundColor: COLORS.primaryDark,
        color: COLORS.white,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        fontSize: 10,
        fontFamily: FONT.bold,
    },
    title: {
        color: COLORS.text,
        fontSize: SIZES.largeX,
        fontFamily: FONT.bold,
        marginTop: 5,
    },
    blurWrap: {
        position: 'absolute',
        bottom: 0,
    },
    titledes: {
        textAlign: 'center',
        fontSize: 12,
        fontFamily: FONT.regular,
        color: COLORS.text,
        opacity: 0.5,
        paddingHorizontal: 10,
    },
    detailsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 10,
        paddingHorizontal: 25,
        paddingVertical: 10,
    },
    detailBox: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 5,
    },
    infoIcon: {
        width: 24,
        height: 24,
    },
    detailLabel: {
        marginTop: 5,
        marginLeft: 5,
        fontFamily: FONT.bold,
        fontSize: SIZES.mediumX,
        color: COLORS.text,
    },
    btnStart: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 12,
        marginBottom: 10,
        width: '100%',
        backgroundColor: COLORS.primaryDark,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnText: {
        color: COLORS.white,
        fontSize: SIZES.mediumX,
        fontFamily: FONT.bold,
        lineHeight: 24,
    },

    fixedFooter: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 16,
        alignItems: 'center',
        paddingBottom: 10,
        paddingTop: 0,
        backgroundColor: COLORS.bgColor, // Use rgba for semi-transparency
        elevation: 4, // For Android shadow
        shadowColor: '#000', // iOS shadow color
        shadowOffset: { width: 0, height: 2 }, // iOS shadow offset
        shadowOpacity: 0.3, // iOS shadow opacity
        shadowRadius: 4, // iOS shadow radius
    },
    Exertex: {
        fontSize: 20,
        color: COLORS.text,
        fontFamily: FONT.bold,
        textAlign: 'left',
        left: 16,
        lineHeight: 28,
    }

})
