import React, { useCallback, useEffect, useState } from 'react';
import { router, Stack, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { Dimensions, ImageBackground, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, FlatList, Animated } from 'react-native';
import { COLORS, FONT, SIZES } from '../../../../constants/theme';
import Blur from '../../../../components/common/blur';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon1 from 'react-native-vector-icons/Entypo';
import WeekPlan from '../../../../components/plan/plandetail/weekPlan';
import * as Progress from 'react-native-progress';
import usePlanQueries from '../../../database/tables/plan';

const StartPlan = () => {
    const { id } = useLocalSearchParams();
    const { getPlanById, getDaySchedulePlan, getAllUserPlans } = usePlanQueries();

    const [planDetails, setPlanDetails] = useState(null);
    const [allDaySchedulePlan, setAllDaySchedulePlan] = useState(null);
    const [weeksData, setWeeksData] = useState({ totalWeeks: 0, daysInWeek: 0, totalDays: 0 });
    const [completedWeeks, setCompletedWeeks] = useState([]);

    const [scrollY, setScrollY] = useState(new Animated.Value(0));
    const [currentDay, setCurrentDay] = useState([]);
    const [currentWeek, setCurrentWeek] = useState([]);
    const [userPlan, setUserPlan] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [startDate, setStartDate] = useState([]);


    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [id])
    )

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const dataPlanDetails = await getPlanById(id);
            setPlanDetails(dataPlanDetails);

            const totalWeeks = dataPlanDetails.duration_weeks;
            const totalDays = totalWeeks * 7;

            setWeeksData({
                totalWeeks,
                daysInWeek: 7,
                totalDays,
            });

            const dataDaySchedulePlan = await getDaySchedulePlan(id);
            setAllDaySchedulePlan(dataDaySchedulePlan?.schedule || []);
            setStartDate(dataDaySchedulePlan?.date_started);
            const uniqueCompletedWeeks = [...new Set(dataDaySchedulePlan?.schedule?.map(item => item.week_number))];
            setCompletedWeeks(uniqueCompletedWeeks);

            const dataUserPlans = await getAllUserPlans();
            setUserPlan(dataUserPlans);
        } catch (err) {
            console.error('Error fetching plan details:', err);
        } finally {
            setIsLoading(false); // Kết thúc loading
        }
    };


    const handleNext = () => {
        setIsLoading(true);
        router.push({
            pathname: `plan/listPlan`,
            params: {
                day: currentDay,
                id,
                currentWeek: currentWeek,
            },
        });
        setIsLoading(false)
    }

    if (isLoading) {
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


    const calculateRemainingDays = () => {
        if (!allDaySchedulePlan || allDaySchedulePlan.length === 0) return weeksData.totalDays;

        const hasZeroProgress = allDaySchedulePlan.some(
            (item) => item.week_number === 0 && item.day_number === 0
        )

        if (hasZeroProgress) {
            return weeksData.totalDays
        }

        const lastRecord = allDaySchedulePlan.reduce((max, current) => {
            if (
                current.week_number > max.week_number ||
                (current.week_number === max.week_number &&
                    current.day_number > max.day_number)
            ) {
                return current
            }
            return max
        })

        const passedDays = (lastRecord.week_number - 1) * 7 + lastRecord.day_number;
        return Math.max(weeksData.totalDays - passedDays, 0);
    };

    const calculateProgress = () => {
        if (!allDaySchedulePlan || allDaySchedulePlan.length === 0) return 0;

        const hasZeroProgress = allDaySchedulePlan.some(
            (item) => item.week_number === 0 && item.day_number === 0
        )

        if (hasZeroProgress) {
            return 0
        }

        const lastRecord = allDaySchedulePlan.reduce((max, current) => {
            if (
                current.week_number > max.week_number ||
                (current.week_number === max.week_number &&
                    current.day_number > max.day_number)
            ) {
                return current
            }
            return max
        })

        const progress =
            ((lastRecord.week_number - 1) * 7 + lastRecord.day_number) /
            weeksData.totalDays

        return Math.min(progress, 1);
    };

    const renderFloatingButton = () => (
        <Animated.View
            style={[
                styles.floatingButton,
                {
                    transform: [
                        {
                            translateY: scrollY.interpolate({
                                inputRange: [0, 200],
                                outputRange: [0, 0],
                                extrapolate: 'clamp',
                            }),
                        },
                    ],
                },
            ]}
        >
            <TouchableOpacity
                style={styles.btnStart}
                onPress={handleNext}
            >
                <Text style={styles.btnText}>Next</Text>
            </TouchableOpacity>
        </Animated.View>
    );

    return (
        <View style={{ flex: 1, paddingBottom: 80 }}>
            <FlatList
                data={Array.from({ length: weeksData.totalWeeks || 0 })}
                keyExtractor={(item, index) => `week-${index}`}
                renderItem={({ index }) => (
                    <WeekPlan
                        weekIndex={index + 1}
                        totalDays={weeksData.daysInWeek}
                        allDaySchedulePlan={allDaySchedulePlan}
                        completedWeeks={completedWeeks}
                        startDate={startDate}
                        setCurrentDay={setCurrentDay}
                        setCurrentWeek={setCurrentWeek}
                        id={id}
                    />
                )}
                ListHeaderComponent={
                    <View style={styles.plan}>
                        <Stack.Screen options={{ headerShown: false }} />
                        <ImageBackground
                            source={{
                                uri: `https://drive.google.com/thumbnail?id=${planDetails?.image_url}&sz=w1000`,
                            }}
                            style={styles.image}
                            resizeMode="cover"
                        >
                            <Blur
                                style={styles.blurWrap}
                                colors={[
                                    'rgba(0, 0, 0, 0)',
                                    'rgba(0, 0, 0, 1)',
                                ]}
                            />
                            <TouchableOpacity
                                style={styles.btnPrev}
                                onPress={() => router.back()}
                            >
                                <Icon
                                    name="arrowleft"
                                    size={24}
                                    color="white"
                                />
                            </TouchableOpacity>
                            <View style={styles.overlay}>
                                <Text
                                    style={styles.title}
                                    numberOfLines={1}
                                    ellipsizeMode="clip"
                                >
                                    {planDetails?.plan_name}
                                </Text>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <View style={styles.daysLeft}>
                                        <Text style={styles.remainingDays}>{calculateRemainingDays()}</Text>
                                        <Text style={styles.daysLeftLabel}> day left</Text>
                                    </View>
                                    <Text
                                        style={styles.progressText}
                                    >{`${Math.round(
                                        calculateProgress() * 100
                                    )}%`}</Text>
                                </View>
                                <Progress.Bar
                                    progress={calculateProgress()}
                                    width={
                                        Dimensions.get('screen').width * 0.93
                                    }
                                    color={COLORS.primary}
                                    unfilledColor="rgba(128, 128, 128, 0.7)"
                                    borderWidth={0}
                                    height={10}
                                    style={styles.progressBar}
                                />
                            </View>
                        </ImageBackground>
                    </View>
                }
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false }
                )}
                showsVerticalScrollIndicator={false}
            />
            {renderFloatingButton()}
        </View>
    )
}

export default StartPlan

const styles = StyleSheet.create({
    plan: {
        backgroundColor: COLORS.bgColor,
        flex: 1,
    },
    image: {
        width: '100%',
        height: Dimensions.get('screen').height * 0.3,
        justifyContent: 'flex-end',
        opacity: 0.8,
    },
    btnPrev: {
        position: 'absolute',
        top: '10%',
        left: 16,
    },
    blurWrap: {
        position: 'absolute',
        top: 0,
        left: 0,
        height: '100%',
        bottom: 0,
    },
    overlay: {
        position: 'absolute',
        bottom: 20,
        left: 16,
    },
    title: {
        color: COLORS.white,
        fontSize: SIZES.largeX,
        fontFamily: FONT.bold,
        bottom: 40,
        lineHeight: 28,
    },
    daysLeft: {
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },

    remainingDays: {
        color: COLORS.white,
        fontSize: 14,
        fontFamily: FONT.bold,
    },
    daysLeftLabel: {
        color: COLORS.white,
        fontSize: 12,
        fontFamily: FONT.regular,
        marginLeft: 4,
    },
    progressBar: {
        marginTop: 10,
        borderRadius: 5,
    },
    progressText: {
        color: COLORS.white,
        fontSize: 14,
        fontFamily: FONT.bold,
        marginTop: 4,
    },
    floatingButton: {
        position: 'absolute',
        bottom: 16,
        left: 16,
        right: 16,
    },
    btnStart: {
        paddingVertical: 10,
        borderRadius: 12,
        backgroundColor: COLORS.primaryDark,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnText: {
        color: COLORS.white,
        fontSize: SIZES.mediumX,
        fontFamily: FONT.bold,
    },
})
