import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, FONT, SIZES } from '../../../constants/theme';
import icon from '../../../constants/icon';
import { router } from 'expo-router';

const WeekPlan = ({ weekIndex, totalDays, allDaySchedulePlan, completedWeeks, startDate, setCurrentDay, setCurrentWeek, id }) => {
    const days = Array.from({ length: totalDays }, (_, index) => index + 1);

    const firstRowDays = days.slice(0, 4);
    const secondRowDays = days.slice(4);

    useEffect(() => {
        setCurrentDay(day_number);
        setCurrentWeek(week_number);
    }, [day_number, week_number, setCurrentDay, setCurrentWeek]);


    const currentDate = new Date().getDate() - new Date(startDate).getDate();
    const day_number = (currentDate % totalDays) + 1
    const week_number = Math.floor((currentDate / 7) + 1)

    const isAnyDayCompleted = () => {
        return days.some(isCompletedDay);
    };

    const isCompletedDay = (day) => {
        return allDaySchedulePlan?.some(scheduleDay =>
            scheduleDay.week_number === weekIndex &&
            scheduleDay.day_number === day
        );
    };

    const isToday = (day) => {
        return day === day_number && weekIndex === week_number;
    };

    const isSkippedDay = (day) => {
        if (weekIndex === week_number) {
            return day < day_number && !isCompletedDay(day);
        }
        if (weekIndex < week_number) {
            const isDayCompleted = allDaySchedulePlan?.some(
                scheduleDay =>
                    scheduleDay.week_number === weekIndex &&
                    scheduleDay.day_number === day
            );
            return !isDayCompleted;
        }

        return false;
    };


    const handleDayPress = (day) => {
        router.push({
            pathname: 'plan/listPlan',
            params: {
                day,
                id,
                currentWeek: weekIndex,
            },
        });
    };

    const getCompletedDaysCount = () => {
        return days.filter(day => isCompletedDay(day) || isSkippedDay(day)).length;
    };


    const areAllDaysCompleted = () => {
        return days.every(day => isCompletedDay(day));
    };



    return (
        <View style={styles.container}>
            <View style={styles.statusContainer}>
                {isAnyDayCompleted() ? (
                    <Icon name="checkcircle" size={20} color="#038700" />
                ) : (
                    <Icon2 name="lightning-bolt-circle" size={22} color="#BDBDBD" />
                )}
                <View style={[styles.statusLine, isAnyDayCompleted() && styles.statusLineGreen]}></View>
            </View>

            <View style={styles.weekContainer}>
                <View style={styles.weekHeader}>
                    <Text style={[
                        styles.weekTitle,
                        completedWeeks.includes(weekIndex)
                            ? styles.currentWeekTitle
                            : styles.pastWeekTitle
                    ]}>
                        Week {weekIndex}

                    </Text>
                    <View style={styles.completedDaysContainer}>
                        {isAnyDayCompleted() && (
                            <Text style={styles.completedDaysCount}>{getCompletedDaysCount()}</Text>
                        )}

                        {isAnyDayCompleted() && (
                            <Text style={styles.totalDays}> / {totalDays}</Text>
                        )}
                    </View>
                </View>
                <View style={styles.dayBoxContainer}>
                    <View style={styles.daysContainer}>
                        {firstRowDays.map((day, index) => {
                            return (
                                <React.Fragment key={day}>
                                    {isCompletedDay(day) ? (
                                        <TouchableOpacity
                                            onPress={() => handleDayPress(day)}
                                        >
                                            <Icon name="checkcircle" size={35} color={COLORS.primary} />
                                        </TouchableOpacity>
                                    ) : isSkippedDay(day) ? (
                                        <TouchableOpacity
                                            onPress={() => handleDayPress(day)}
                                        >
                                            <Icon name="closecircle" size={35} color='red' />
                                        </TouchableOpacity>

                                    ) : isToday(day) ? (
                                        <TouchableOpacity
                                            style={styles.currentDayBox}
                                            onPress={() => handleDayPress(day)}
                                        >
                                            <Text style={styles.currentDayText}>
                                                {day}
                                            </Text>
                                        </TouchableOpacity>
                                    ) : (
                                        <TouchableOpacity style={styles.dayBox}>
                                            <Text style={styles.dayText}>
                                                {day}
                                            </Text>
                                        </TouchableOpacity>
                                    )}
                                    {index < firstRowDays.length - 1 && (
                                        <Icon name="right" size={18} color={COLORS.gray} style={styles.arrowIcon} />
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </View>

                    <View style={styles.daysContainer}>
                        {secondRowDays.map((day, index) => {
                            return (
                                <React.Fragment key={day}>
                                    {isCompletedDay(day) ? (
                                        <TouchableOpacity
                                            onPress={() => handleDayPress(day)}
                                        >
                                            <Icon name="checkcircle" size={35} color={COLORS.primary} />
                                        </TouchableOpacity>
                                    ) : isSkippedDay(day) ? (
                                        <TouchableOpacity
                                            onPress={() => handleDayPress(day)}
                                        >
                                            <Icon name="closecircle" size={35} color='red' />
                                        </TouchableOpacity>
                                    ) : isToday(day) ? (
                                        <TouchableOpacity
                                            style={styles.currentDayBox}
                                            onPress={() => handleDayPress(day)}
                                        >
                                            <Text style={styles.currentDayText}>
                                                {day}
                                            </Text>
                                        </TouchableOpacity>
                                    ) : (
                                        <TouchableOpacity style={styles.dayBox}>
                                            <Text style={styles.dayText}>
                                                {day}
                                            </Text>
                                        </TouchableOpacity>
                                    )}
                                    {index < secondRowDays.length && (
                                        <Icon name="right" size={18} color={COLORS.gray} style={styles.arrowIcon} />
                                    )}
                                </React.Fragment>
                            );
                        })}

                        <Image
                            source={areAllDaysCompleted() ? icon.trophygold : icon.trophygray}
                            style={styles.trophyIcon}
                        />
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: COLORS.bgColor,
        borderRadius: 10,
        width: '100%',
        alignSelf: 'center',
        paddingHorizontal: 20
    },
    statusContainer: {
        marginTop: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statusLine: {
        width: 4,
        height: '100%',
        flex: 1,
        backgroundColor: COLORS.gray,
    },
    statusLineGreen: {
        backgroundColor: 'green',
    },
    weekContainer: {
        alignSelf: 'center',
        width: '100%',
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 16
    },
    weekHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    dayBoxContainer: {
        backgroundColor: COLORS.white,
        borderRadius: 20,
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    completedDaysContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    completedDaysCount: {
        fontSize: 16,
        fontFamily: FONT.bold,
        color: COLORS.primaryDark,
    },
    totalDays: {
        fontSize: 12,
        fontFamily: FONT.regular,
        color: COLORS.text,
    },
    daysContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 10,
    },
    dayBox: {
        width: 35,
        height: 35,
        borderRadius: 50,
        backgroundColor: COLORS.gray,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dayText: {
        color: COLORS.text,
        fontSize: 16,
        fontFamily: FONT.regular,
        opacity: 0.5,
        lineHeight: 24,
    },
    arrowIcon: {
        alignSelf: 'center',
    },
    trophyIcon: {
        width: 30,
        height: 30,
        alignSelf: 'center',
        marginRight: 5,
        marginLeft: 5,
    },
    weekTitle: {
        fontSize: SIZES.mediumX,
        fontFamily: FONT.bold,
    },
    currentWeekTitle: {
        color: COLORS.text,
    },
    pastWeekTitle: {
        color: COLORS.text,
        opacity: 0.5,
    },

    currentDayBox: {
        width: 35,
        height: 35,
        borderRadius: 50,
        borderColor: COLORS.primary, // Thay đổi màu viền thành xanh
        borderWidth: 2,     // Thêm độ dày cho viền
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white', // Giữ màu nền
    },
    currentDayText: {
        color: COLORS.primaryDark,       // Chuyển chữ thành màu xanh
        fontSize: 16,
        fontFamily: FONT.bold,
    },

});

export default WeekPlan;
