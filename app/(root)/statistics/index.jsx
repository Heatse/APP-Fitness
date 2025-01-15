import React, { useEffect, useState } from 'react'
import {
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'
import { COLORS, FONT } from '../../../constants/theme'
import { Stack } from 'expo-router'
import AdvertiseMentFour from '../../../components/advertisement/AdvertisementFour'
import icon from '../../../constants/icon'
import Icon from 'react-native-vector-icons/Ionicons'
import BMIScale from '../../../components/statistics/BMIDisplay'
import AdvertiseMentOne from '../../../components/advertisement/AdvertisementOne'
import AdvertiseMentThree from '../../../components/advertisement/AdvertisementThree'
import ChangeBMIPopup from '../../../components/statistics/ChangeBMIPopup'
import useUserQueries from '../../database/tables/user'
import usePlanQueries from '../../database/tables/plan'
import { calculateBMI, getStartAndEndOfWeek } from '../../../utils/helper'

const Statistics = () => {
    const todayIndex = new Date().getDay()
    const { startOfWeek, endOfWeek, startDate } = getStartAndEndOfWeek()

    const [bmi, setBmi] = useState({
        height: '100',
        weight: '50',
    })

    const [isModalVisible, setModalVisible] = useState(null)
    const [statistics, setStatistics] = useState()
    const [historyUser, setHistoryUser] = useState([])
    const [cupCount, setCupCount] = useState(0)
    const [longestStreak, setLongestStreak] = useState(0)

    const { getWorkoutStatis, getUserByParams, getCupCount, getLongestStreak } =
        useUserQueries()
    const { getHistoryUser } = usePlanQueries()

    useEffect(() => {
        getLongestStreak().then((result) => {
            if (result?.success) {
                setLongestStreak(result?.data)
            } else {
                console.error('Error getting longest streak:', result?.error)
            }
        })
    }, [])

    useEffect(() => {
        getWorkoutStatis().then((result) => {
            if (result?.success) {
                setStatistics(result?.data)
            } else {
                console.error(
                    'Error getting workout statistics:',
                    result?.error
                )
            }
        })
    }, [])

    useEffect(() => {
        getHistoryUser(startOfWeek, endOfWeek).then((result) => {
            setHistoryUser(result)
        })
    }, [])

    useEffect(() => {
        getUserByParams(['height', 'weight']).then((result) => {
            if (result.length > 0) {
                setBmi({
                    height: result[0].height,
                    weight: result[0].weight,
                })
            } else {
                console.error('Error getting user info:', result?.error)
            }
        })
    }, [])

    useEffect(() => {
        getCupCount().then((result) => {
            if (result?.success) {
                setCupCount(result?.data)
            } else {
                console.error('Error getting cup count:', result?.error)
            }
        })
    }, [])

    const checkWorkoutHistory = (index) => {
        const checkingDate = new Date(startDate)
        checkingDate.setDate(startDate.getDate() + index)

        const dateString = checkingDate.toISOString().split('T')[0]

        if (historyUser?.length === 0) {
            if (index < todayIndex) {
                return 'missed'
            }
            if (index === todayIndex) {
                return 'today'
            }
            return 'future'
        }
        if (index < todayIndex) {
            return historyUser.includes(dateString) ? 'completed' : 'missed'
        }
        if (index === todayIndex && historyUser.includes(dateString)) {
            return 'completed'
        }
        if (index === todayIndex && !historyUser.includes(dateString)) {
            return 'today'
        }
        return 'future'
    }

    return (
        <SafeAreaView>
            <ScrollView contentContainerStyle={{ paddingBottom: 140 }}>
                <Stack.Screen
                    options={{
                        headerShown: false,
                    }}
                />
                <View style={styles.container}>
                    <Text style={styles.head1}>Statistics</Text>
                    <Text style={styles.head2}>
                        We've tracked and recorded how many times you exercise
                        over time
                    </Text>
                    <AdvertiseMentThree style={styles.advertise} />
                    <View style={styles.table}>
                        <View style={styles.tableItem}>
                            <Image
                                source={icon.weight}
                                style={styles.tableImage}
                            />
                            <Text style={styles.number}>
                                {statistics?.total_exercises ?? 0}
                            </Text>
                            <Text style={styles.itemText}>Workout</Text>
                        </View>
                        <View style={styles.tableItem}>
                            <Image
                                source={icon.fire}
                                style={styles.tableImage}
                            />
                            <Text style={styles.number}>
                                {statistics?.total_calories ?? 0}
                            </Text>
                            <Text style={styles.itemText}>Kcal</Text>
                        </View>
                        <View style={styles.tableItem}>
                            <Image
                                source={icon.timer}
                                style={styles.tableImage}
                            />
                            <Text style={styles.number}>
                                {statistics?.total_minutes ?? 0}
                            </Text>
                            <Text style={styles.itemText}>Minute</Text>
                        </View>
                    </View>

                    <View style={styles.headSection}>
                        <Text style={{ fontSize: 20, fontFamily: FONT.bold }}>
                            History
                        </Text>

                        {/* <TouchableOpacity>
                            <Text
                                style={{
                                    fontSize: 14,
                                    fontFamily: FONT.regular,
                                    color: COLORS.primaryDark,
                                }}
                            >
                                See all
                            </Text>
                        </TouchableOpacity> */}
                    </View>

                    <View style={styles.tableTwo}>
                        <View style={styles.daysContainer}>
                            {['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'].map(
                                (day, index) => (
                                    <TouchableOpacity
                                        key={day}
                                        style={styles.day}
                                    >
                                        <Text style={styles.dayText}>
                                            {day}
                                        </Text>
                                        <View
                                            style={
                                                checkWorkoutHistory(index) ===
                                                'today'
                                                    ? styles.numberCircle
                                                    : checkWorkoutHistory(
                                                          index
                                                      ) === 'completed'
                                                    ? styles.checkIcon
                                                    : styles.disabledText
                                            }
                                        >
                                            {checkWorkoutHistory(index) ===
                                            'today' ? (
                                                <Text style={styles.dayActive}>
                                                    {index + 1}
                                                </Text>
                                            ) : checkWorkoutHistory(index) ===
                                              'missed' ? (
                                                <Icon
                                                    name="close-circle"
                                                    size={26}
                                                    color={COLORS.grayDark}
                                                    style={{
                                                        transform: [
                                                            {
                                                                translateY: -2,
                                                            },
                                                            {
                                                                translateX: -1,
                                                            },
                                                        ],
                                                    }}
                                                />
                                            ) : checkWorkoutHistory(index) ===
                                              'completed' ? (
                                                <Icon
                                                    name="checkmark-circle"
                                                    size={30}
                                                    color={COLORS.primary}
                                                    style={{
                                                        transform: [
                                                            {
                                                                translateY: -2,
                                                            },
                                                            {
                                                                translateX: -1,
                                                            },
                                                        ],
                                                    }}
                                                />
                                            ) : (
                                                <Text
                                                    style={styles.disabledDay}
                                                >
                                                    {index + 1}
                                                </Text>
                                            )}
                                        </View>
                                    </TouchableOpacity>
                                )
                            )}
                        </View>

                        <View style={styles.infoContainer}>
                            <View style={{ gap: 4 }}>
                                <Text style={styles.textLabel}>
                                    Consecutive days
                                </Text>
                                <View style={styles.consecutiveContainer}>
                                    <Icon name="flame" size={24} color="red" />
                                    <Text style={styles.consecutiveText}>
                                        {longestStreak?.streakLength ?? 0}
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.personalBestContainer}>
                                <Text style={styles.textLabel}>
                                    Personal best
                                </Text>
                                <Text style={styles.personalBestValue}>
                                    {longestStreak?.streakLength ?? 0} Days
                                </Text>
                            </View>
                        </View>
                    </View>

                    <Text
                        style={{
                            fontSize: 20,
                            fontFamily: FONT.bold,
                            marginTop: 16,
                            marginBottom: -30,
                        }}
                    >
                        Achievement
                    </Text>
                    <View style={styles.table}>
                        <View style={styles.itemCup}>
                            <Image source={icon.dong} style={styles.cupImg} />
                            <View style={styles.wrapCount}>
                                <Text style={styles.countCup}>
                                    {cupCount?.bronze}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.itemCup}>
                            <Image source={icon.bac} style={styles.cupImg} />
                            <View style={styles.wrapCount}>
                                <Text style={styles.countCup}>
                                    {cupCount?.silver}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.itemCup}>
                            <Image source={icon.vang} style={styles.cupImg} />
                            <View style={styles.wrapCount}>
                                <Text style={styles.countCup}>
                                    {cupCount?.gold}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.itemCup}>
                            <Image
                                source={icon.kimcuong}
                                style={styles.cupImg}
                            />
                            <View style={styles.wrapCount}>
                                <Text style={styles.countCup}>
                                    {cupCount?.diamond}
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.headSection}>
                        <Text style={{ fontSize: 20, fontFamily: FONT.bold }}>
                            BMI
                        </Text>
                        <TouchableOpacity
                            style={{
                                width: 71,
                                height: 26,
                                backgroundColor: COLORS.primaryDark,
                                borderRadius: 1000,
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: 4,
                            }}
                            onPress={() => setModalVisible(true)}
                        >
                            <Text
                                style={{
                                    fontSize: 12,
                                    fontFamily: FONT.regular,
                                    color: COLORS.white,
                                    height: 18,
                                }}
                            >
                                Change
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <BMIScale
                        bmi={calculateBMI(bmi?.weight, bmi?.height)}
                        height={bmi?.height}
                    />
                </View>
                <AdvertiseMentOne />

                <ChangeBMIPopup
                    visible={isModalVisible}
                    bmi={bmi}
                    onClose={() => setModalVisible(false)} // Đóng modal
                    onSave={(updatedBmi) => setBmi(updatedBmi)} // Cập nhật BMI
                />
            </ScrollView>
            <AdvertiseMentFour style={styles.advertise4} />
        </SafeAreaView>
    )
}

export default Statistics

const styles = StyleSheet.create({
    head1: {
        fontSize: 24,
        fontFamily: FONT.bold,
        color: COLORS.text,
    },
    head2: {
        fontSize: 16,
        fontFamily: FONT.regular,
        color: COLORS.text,
        opacity: 0.5,
        marginBottom: 16,
    },
    container: {
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    advertise: {
        marginBottom: 30,
    },
    table: {
        marginTop: 30,
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: COLORS.white,
        borderRadius: 12,
    },
    tableItem: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        minWidth: 108,
    },
    tableImage: {
        width: 48,
        height: 48,
        marginBottom: 8,
    },
    number: {
        fontSize: 16,
        fontFamily: FONT.bold,
        color: COLORS.text,
    },
    itemText: {
        fontSize: 10,
        fontFamily: FONT.regular,
        opacity: 0.5,
    },
    headSection: {
        marginTop: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    tableTwo: {
        padding: 10,
        backgroundColor: COLORS.white,
        borderRadius: 12,
    },
    daysContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginBottom: 20,
    },
    day: {
        alignItems: 'center',
    },
    dayText: {
        marginTop: 5,
        fontSize: 12,
        color: '#888',
        marginBottom: 8,
    },
    numberCircle: {
        fontSize: 12,
        color: 'green',
        fontWeight: 'bold',
        width: 24,
        height: 24,
        borderRadius: 1000,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: COLORS.primary,
    },
    dayActive: {
        color: COLORS.primaryDark,
        fontSize: 12,
        fontFamily: FONT.regular,
        lineHeight: 24,
    },
    checkIcon: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 30,
        height: 30,
    },
    disabledText: {
        width: 26,
        height: 26,
        borderRadius: 1000,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: COLORS.gray,
        backgroundColor: COLORS.gray,
    },
    disabledDay: {
        color: COLORS.text,
        fontSize: 12,
        fontFamily: FONT.regular,
        lineHeight: 24,
        opacity: 0.5,
    },
    infoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    consecutiveContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    consecutiveText: {
        marginLeft: 8,
        fontSize: 14,
        lineHeight: 20,
        fontFamily: FONT.bold,
        color: COLORS.text,
    },
    personalBestContainer: {
        alignItems: 'flex-end',
        gap: 4,
    },
    textLabel: {
        fontSize: 14,
        color: COLORS.text,
        opacity: 0.5,
    },
    personalBestValue: {
        fontSize: 14,
        fontFamily: FONT.bold,
        color: COLORS.text,
    },
    itemCup: {
        position: 'relative',
        width: 64,
        height: 64,
        borderRadius: 1000,
    },
    cupImg: {
        width: 64,
        height: 64,
        resizeMode: 'cover',
        borderRadius: 1000,
        aspectRatio: 1,
    },
    wrapCount: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: COLORS.white,
        borderRadius: 1000,
        width: 16,
        height: 16,
        borderWidth: 1,
        borderColor: COLORS.yellow,
        alignItems: 'center',
        justifyContent: 'center',
    },
    countCup: {
        fontSize: 10,
        fontFamily: FONT.bold,
        color: COLORS.native,
    },
    advertise4: {
        position: 'absolute',
        bottom: 64,
        left: 0,
        right: 0,
    },
})
