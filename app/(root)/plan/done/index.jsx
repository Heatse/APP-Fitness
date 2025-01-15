import { TouchableOpacity } from 'react-native'
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import Icon from 'react-native-vector-icons/AntDesign'
import Blur from '../../../../components/common/blur'
import { router, useLocalSearchParams } from 'expo-router'
import image from '../../../../constants/image'
import { COLORS, FONT } from '../../../../constants/theme'
import { ImageBackground } from 'react-native'
import ExerciseDay from '../../../../components/plan/exerciseList/exerciseDay'
import { useEffect, useState } from 'react'
import usePlanQueries from '../../../database/tables/plan'
import Toast from 'react-native-toast-message'
import icon from '../../../../constants/icon'
import useUserQueries from '../../../database/tables/user'

const Done = () => {
    const { day, id, currentWeek } = useLocalSearchParams()

    const [exerciseList, setExerciseList] = useState([])
    const [plans, setPlans] = useState(null)

    const { getPlanScheduleByDay2, getPlanById } = usePlanQueries()
    const { updateCupCountForPlan } = useUserQueries()

    useEffect(() => {
        getPlanById(id)
            .then((data) => {
                setPlans(data)
            })
            .catch((err) => console.error('Error fetching plan details:', err))
        getPlanScheduleByDay2(id, currentWeek, day)
            .then((data) => {
                if (Array.isArray(data)) {
                    if (data.length > 0) {
                        const exerciseDetails = data[0].list_exercise_details
                            .split(',')
                            .map((item) => item.trim())
                        const exerciseTimes = data[0].second_list
                            .split(',')
                            .map((item) => parseInt(item.trim(), 10))
                        const exerciseImages = data[0].list_exercise_images
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
                        setExerciseList([]) // No exercises available
                    }
                } else {
                    console.error('Expected an array but got:', data)
                    setPlanSchedule([]) // Reset plan schedule if data is not an array
                }
            })
            .catch((err) => console.error('Error fetching plan schedule:', err))

        updateCupCountForPlan(id, currentWeek).then((data) => {
            if (data?.success) {
                let cupImg
                switch (data?.cupType) {
                    case 'bronze':
                        cupImg = icon.bronze
                        break
                    case 'silver':
                        cupImg = icon.silver
                        break
                    case 'gold':
                        cupImg = icon.gold
                        break
                    case 'diamond':
                        cupImg = icon.diamond
                        break
                    default:
                        cupImg = icon.dong // Use a default icon if no match
                        break
                }

                Toast.show({
                    type: 'cupToast',
                    props: {
                        weekNumber: currentWeek,
                        cupImg: cupImg,
                        wish:
                            data?.message ||
                            'Perfect! See you at the next workout',
                    },
                })
            }
        })
    }, [id, currentWeek, day])

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.plan}>
                <ImageBackground
                    source={image.complete}
                    style={styles.image}
                    resizeMode="cover"
                >
                    <TouchableOpacity
                        style={styles.btnPrev}
                        onPress={() => router.back()}
                    >
                        <Icon name="arrowleft" size={24} color={COLORS.white} />
                    </TouchableOpacity>
                    <Blur style={styles.blurWrap} />
                </ImageBackground>

                <View style={styles.wrapText}>
                    <Text
                        style={{
                            fontSize: 16,
                            fontFamily: FONT.bold,
                            color: COLORS.primaryDark,
                        }}
                    >
                        {plans?.plan_name || 'Full Body Gainer'}
                    </Text>
                    <Text
                        style={{
                            fontSize: 24,
                            fontFamily: FONT.bold,
                            color: COLORS.text,
                        }}
                    >
                        Workout completed!
                    </Text>
                    <Text
                        style={{
                            fontSize: 12,
                            fontFamily: FONT.regular,
                            color: '#2563EB',
                        }}
                    >
                        Perfect! See you at the next workout
                    </Text>
                    <Text
                        style={{
                            fontSize: 24,
                            fontFamily: FONT.bold,
                            color: COLORS.primaryDark,
                        }}
                    >
                        Congratulations!
                    </Text>
                </View>

                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                        marginTop: 20,
                        marginBottom: 20,
                        width: '80%',
                        marginHorizontal: 'auto',
                    }}
                >
                    <View style={styles.box}>
                        <Text style={styles.boxNumber}>
                            {plans?.duration_minute || 0}
                        </Text>
                        <Text style={styles.boxText}>Minutes</Text>
                    </View>
                    <View style={styles.box}>
                        <Text style={styles.boxNumber}>
                            {plans?.calories || 0}
                        </Text>
                        <Text style={styles.boxText}>Kcal</Text>
                    </View>
                    <View style={styles.box}>
                        <Text style={styles.boxNumber}>
                            {plans?.duration_weeks || 4}
                        </Text>
                        <Text style={styles.boxText}>Weeks</Text>
                    </View>
                </View>

                <Text
                    style={{
                        fontSize: 20,
                        fontFamily: FONT.bold,
                        color: COLORS.text,
                        textAlign: 'left',
                        marginLeft: 16,
                    }}
                >
                    Review Exercises
                </Text>
                <ExerciseDay exercises={exerciseList} />
                <TouchableOpacity
                    style={styles.btnBack}
                    onPress={() => router.push(`/home`)}
                >
                    <Text style={{ color: 'white', fontSize: 18 }}>Back to Home</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    )
}

export default Done

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
        aspectRatio: 1.3,
        justifyContent: 'flex-end',
    },
    btnPrev: {
        position: 'absolute',
        top: 56,
        left: 16,
    },

    wrapText: {
        alignItems: 'center',
    },
    box: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.white,
        borderRadius: 12,
        padding: 10,
        minWidth: 80,
    },
    boxNumber: {
        fontSize: 16,
        fontFamily: FONT.bold,
        color: COLORS.primaryDark,
    },
    boxText: {
        fontSize: 10,
        fontFamily: FONT.medium,
        color: COLORS.primaryDark,
    },
    btnBack: {
        backgroundColor: COLORS.primaryDark,
        padding: 16,
        marginBottom: 100,

        borderRadius: 10,
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
        width: '80%',
        marginHorizontal: 'auto',
    }
})
