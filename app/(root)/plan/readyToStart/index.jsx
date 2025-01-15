import { router, Stack, useLocalSearchParams } from 'expo-router'
import {
    Dimensions,
    ImageBackground,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Icon from 'react-native-vector-icons/AntDesign'
import { COLORS, FONT, SIZES } from '../../../../constants/theme'
import AdvertiseMentFour from '../../../../components/advertisement/AdvertisementFour'
import { useEffect, useState } from 'react'
import usePlanQueries from '../../../database/tables/plan'
import Blur from '../../../../components/common/blur'

const windowWidth = Dimensions.get('window').width
const windowHeight = Dimensions.get('window').height

const ReadyToStart = () => {
    const { day, id, currentWeek } = useLocalSearchParams()
    const { getPlanScheduleByDay2, getPlanById } = usePlanQueries()
    const [planSchedule, setPlanSchedule] = useState([])
    const [planDetails, setPlanDetails] = useState(null)
    const [timer, setTimer] = useState(15)
    const [exerciseName, setExerciseName] = useState('')
    const [repNumber, setRepNumber] = useState('')
    const [totalExercises, setTotalExercises] = useState(0)
    const [isTimeUp, setIsTimeUp] = useState(false)

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer((prevTimer) => {
                if (prevTimer <= 1) {
                    clearInterval(interval)
                    setIsTimeUp(true)
                    return 0
                }
                return prevTimer - 1
            })
        }, 1000)

        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        getPlanById(id)
            .then((data) => {
                setPlanDetails(data)
            })
            .catch((err) => console.error('Error fetching plan details:', err))

        getPlanScheduleByDay2(id, currentWeek, day)
            .then((data) => {
                setPlanSchedule(data)
                if (data.length > 0) {
                    const firstExercise = data[0].list_exercise_details
                        .split(',')[0]
                        .trim()
                    const totalCount =
                        data[0].list_exercise_details.split(',').length
                    const repList = data[0].rep_list.split(',')[0].trim()

                    setExerciseName(firstExercise)
                    setTotalExercises(totalCount)
                    setRepNumber(repList)
                }
            })
            .catch((err) => console.error('Error fetching plan schedule:', err))
    }, [id, currentWeek, day])

    const addExtraTime = () => {
        const extraTime = 20
        setTimer((prevTimer) => prevTimer + extraTime)
    }

    const handleStart = () => {
        router.push({
            pathname: `/plan/actionPlay`,
            params: {
                day: day,
                id: id,
                currentWeek: currentWeek,
            },
        })
    }

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60)
        const seconds = time % 60
        return `${minutes > 0
            ? `${minutes}:${seconds.toString().padStart(2, '0')}`
            : `00:${seconds.toString().padStart(2, '0')}`
            }`
    }

    return (
        <SafeAreaView style={styles.safeView}>
            <View style={styles.stack}>
                <Stack.Screen
                    options={{
                        headerShown: false,
                    }}
                />
                <ImageBackground
                    source={{
                        uri: `https://drive.google.com/thumbnail?id=${planDetails?.image_url}&sz=w1000`,
                    }}
                    style={styles.image}
                    resizeMode="cover"
                >
                    <View style={styles.btnPrev}>
                        <TouchableOpacity
                            onPress={() => router.back()}
                        >
                            <Icon name="arrowleft" size={24} color="white" />
                        </TouchableOpacity>
                    </View>

                    <Blur style={styles.blurWrap} />
                    <View style={styles.overlay}>
                        <Text style={styles.matchTag}>
                            {planDetails?.level || 'Best Match'}
                        </Text>
                        <Text
                            style={styles.title}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                        >
                            {planDetails?.plan_name || 'Full Body'}
                        </Text>
                    </View>
                </ImageBackground>
            </View>

            <View style={styles.exerciseInfo}>
                <View style={styles.backgroundOverlay} />
                <View style={styles.infoContent}>
                    <View style={{ top: '5%' }}>
                        <Text style={styles.nextText}>{`Next ${1}/${totalExercises > 0 ? totalExercises : 0
                            }`}</Text>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                        }}>
                            <View style={styles.exerciseRow}>
                                <Text style={styles.exerciseName}>
                                    {exerciseName}

                                </Text>
                                <Icon name="questioncircle" size={20} color="lightgray" />
                            </View>
                            <Text style={styles.repsText}>{`x ${repNumber || ''
                                }`}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.conatainerTime}>
                        <Text style={styles.readyText}>Ready to start</Text>
                        <Text style={styles.timerText}>{formatTime(timer)}</Text>
                    </View>

                    <View style={styles.buttonRow}>
                        <TouchableOpacity
                            style={styles.addTimeButton}
                            onPress={addExtraTime}
                        >
                            <Text style={styles.addTimeText}>+20s</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.skipButton}
                            onPress={handleStart}
                        >
                            <Text style={styles.skipText}>
                                {isTimeUp ? 'Next' : 'Skip'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <AdvertiseMentFour />
        </SafeAreaView>
    )
}

export default ReadyToStart

const styles = StyleSheet.create({
    safeView: {
        flex: 1,
    },

    stack: {
        width: windowWidth,
        height: windowHeight * 0.34,
    },

    image: {
        width: '100%',
        height: '100%',
        justifyContent: 'flex-end',
    },
    btnPrev: {
        position: 'absolute',
        flexDirection: 'row',
        top: windowHeight * 0.04,
        left: windowWidth * 0.04
    },

    textIntro: {
        fontSize: 16,
        fontFamily: FONT.medium,
        marginLeft: 10,
        lineHeight: 24,
        color: COLORS.white,
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
        lineHeight: 32,
    },
    blurWrap: {
        position: 'absolute',
        bottom: 0,
    },

    exerciseInfo: {
        flex: 1,
        paddingHorizontal: '5%',
    },
    backgroundOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: COLORS.primaryDark,
        opacity: 0.8,
    },
    infoContent: {
        flex: 1,
        zIndex: 1,
    },
    nextText: {
        fontSize: 20,
        fontFamily: FONT.bold,
        color: COLORS.white,
    },

    exerciseRow: {
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
    },

    exerciseName: {
        fontSize: 16,
        fontFamily: FONT.bold,
        color: COLORS.white,
        marginRight: windowWidth * 0.02,
    },

    repsText: {
        fontSize: 16,
        fontFamily: FONT.bold,
        color: COLORS.white,
        textAlign: 'right',
    },

    conatainerTime: {
        alignItems: 'center',
        paddingTop: windowHeight * 0.05,
    },

    readyText: {
        fontSize: 20,
        fontFamily: FONT.bold,
        color: COLORS.white,
        lineHeight: 28
    },

    timerText: {
        fontSize: 40,
        fontFamily: FONT.bold,
        color: COLORS.white,
        lineHeight: 48
    },

    buttonRow: {
        alignItems: 'center',
        top: windowHeight * 0.05,
        width: '100%',
    },

    addTimeButton: {
        backgroundColor: '#4AC947',
        borderRadius: 8,
        padding: windowHeight * 0.015,
        width: '70%',
        alignItems: 'center',
        marginBottom: windowHeight * 0.015,
    },

    addTimeText: {
        fontSize: SIZES.medium,
        fontFamily: FONT.bold,
        color: COLORS.white,
        lineHeight: 24,
    },

    skipButton: {
        backgroundColor: COLORS.white,
        borderRadius: 8,
        padding: windowHeight * 0.015,
        width: '70%',
        alignItems: 'center',
    },

    skipText: {
        fontSize: SIZES.medium,
        fontFamily: FONT.bold,
        color: COLORS.text,
        lineHeight: 24,
    },
})
