import { router } from 'expo-router'
import {
    SafeAreaView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
    Alert,
} from 'react-native'
import * as Notifications from 'expo-notifications'
import PrevIcon from '../../../../components/icons/PrevIcon'
import { COLORS, FONT, SIZES } from '../../../../constants/theme'
import { useState, useEffect } from 'react'
import ModalPickerDays from '../../../../components/profile/reminder/ModalPickerDay'
import ModalPickerTime from '../../../../components/profile/reminder/ModalPickerTime'

const Reminder = () => {
    const [userSettings, setUserSettings] = useState({
        workoutNotifications: true,
        days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        time: {
            hour: 0,
            minute: 33,
            period: 'AM',
        },
    })

    const handleChangeUserSettings = (key, value) => {
        setUserSettings((prev) => ({
            ...prev,
            [key]: value,
        }))
    }

    const [visibleModal, setVisibleModal] = useState(null)

    const onCloseModal = () => {
        setVisibleModal(null)
    }

    const handleOpenModal = (key) => {
        setVisibleModal(key)
    }

    const requestNotificationPermission = async () => {
        const { status } = await Notifications.getPermissionsAsync()
        if (status !== 'granted') {
            const { status: newStatus } =
                await Notifications.requestPermissionsAsync()
            if (newStatus === 'granted') {
                Alert.alert('Permission granted', 'Notifications are enabled.')
                handleChangeUserSettings('workoutNotifications', true)
                scheduleWorkoutNotifications()
            } else {
                Alert.alert('Permission denied', 'Cannot enable notifications.')
                handleChangeUserSettings('workoutNotifications', false)
            }
        } else {
            Alert.alert(
                'Permission already granted',
                'Notifications are enabled.'
            )
            handleChangeUserSettings('workoutNotifications', true)
            scheduleWorkoutNotifications()
        }
    }

    const handleToggleSwitch = () => {
        if (!userSettings.workoutNotifications) {
            requestNotificationPermission()
        } else {
            handleChangeUserSettings('workoutNotifications', false)
            cancelScheduledNotifications()
        }
    }

    // Lên lịch thông báo cho workout
    const scheduleWorkoutNotifications = async () => {
        const { days, time } = userSettings

        // Nếu không có ngày hoặc thời gian, không lên lịch
        if (days.length === 0) return

        // Chuyển đổi giờ sang định dạng 24h
        const hour =
            time.period === 'AM' && time.hour === 12
                ? 0
                : time.period === 'PM' && time.hour !== 12
                    ? time.hour + 12
                    : time.hour

        // Tạo thông báo cho mỗi ngày đã chọn
        const notificationPromises = days.map(async (day) => {
            const notificationDate = getNextNotificationDate(
                day,
                hour,
                time.minute
            )
            if (notificationDate) {
                await Notifications.scheduleNotificationAsync({
                    content: {
                        title: 'Workout Reminder',
                        body: 'Time to work out!',
                    },
                    trigger: {
                        hour: notificationDate.getHours(),
                        minute: notificationDate.getMinutes(),
                        day: notificationDate.getDay(),
                        repeats: true,
                    },
                })
            }
        })

        // Chờ tất cả các thông báo được lên lịch
        await Promise.all(notificationPromises)
    }

    // Tính toán ngày tiếp theo của từng ngày trong tuần
    const getNextNotificationDate = (dayName, hour, minute) => {
        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        const currentDate = new Date()
        const dayIndex = daysOfWeek.indexOf(dayName)

        // Tính số ngày chênh lệch
        let diff = dayIndex - currentDate.getDay()
        if (diff <= 0) diff += 7 // Nếu ngày đã qua thì lên lịch cho tuần sau

        // Cập nhật ngày giờ
        currentDate.setDate(currentDate.getDate() + diff)
        currentDate.setHours(hour)
        currentDate.setMinutes(minute)
        currentDate.setSeconds(0)
        currentDate.setMilliseconds(0)

        return currentDate
    }

    // Hủy thông báo đã lên lịch
    const cancelScheduledNotifications = async () => {
        const scheduledNotifications =
            await Notifications.getAllScheduledNotificationsAsync()
        const notificationIds = scheduledNotifications.map(
            (notification) => notification.identifier
        )
        if (notificationIds.length > 0) {
            await Notifications.cancelScheduledNotificationAsync(
                notificationIds
            )
        }
    }

    useEffect(() => {
        if (userSettings.workoutNotifications) {
            scheduleWorkoutNotifications()
        } else {
            cancelScheduledNotifications()
        }
    }, [userSettings.workoutNotifications])

    return (
        <SafeAreaView style={styles.safeView}>
            <View style={styles.stack}>
                <TouchableOpacity
                    style={{
                        marginLeft: 16,
                        width: 40,
                        height: 40,
                    }}
                    onPress={() => router.back()}
                >
                    <PrevIcon
                        style={{
                            width: 40,
                            height: 40,
                        }}
                    />
                </TouchableOpacity>
                <View
                    style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        transform: [{ translateX: -20 }],
                    }}
                >
                    <Text style={styles.title}>Reminder</Text>
                </View>
            </View>

            {/* Body */}
            <View style={styles.cards}>
                <View style={styles.cardList}>
                    <View style={styles.cardItem}>
                        <View style={styles.itemLeft}>
                            <Text style={styles.itemName}>
                                Workout Notifications
                            </Text>
                        </View>
                        <Switch
                            trackColor={{
                                false: COLORS.gray,
                                true: COLORS.primaryDark,
                            }}
                            thumbColor={
                                userSettings.workoutNotifications
                                    ? COLORS.white
                                    : COLORS.lightGray
                            }
                            value={userSettings.workoutNotifications}
                            onValueChange={handleToggleSwitch}
                        />
                    </View>
                    <TouchableOpacity
                        onPress={() => handleOpenModal('days')}
                        style={styles.cardItem}
                    >
                        <View style={styles.itemLeft}>
                            <Text style={styles.itemName}>Days</Text>
                        </View>
                        <Text style={styles.textEx}>
                            {userSettings?.days?.join(', ')}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => handleOpenModal('time')}
                        style={styles.cardItem}
                    >
                        <View style={styles.itemLeft}>
                            <Text style={styles.itemName}>Time</Text>
                        </View>
                        <Text style={styles.textEx}>
                            {`${userSettings?.time?.hour}:${userSettings?.time?.minute} ${userSettings?.time?.period}`}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Modal */}
            <ModalPickerDays
                isVisible={visibleModal === 'days'}
                days={userSettings.days}
                onCloseModal={onCloseModal}
                handleChangeUserSettings={handleChangeUserSettings}
            />

            <ModalPickerTime
                isVisible={visibleModal === 'time'}
                time={userSettings.time}
                onCloseModal={onCloseModal}
                handleChangeUserSettings={handleChangeUserSettings}
            />
        </SafeAreaView>
    )
}

export default Reminder

const styles = StyleSheet.create({
    safeView: {
        flex: 1,
        backgroundColor: COLORS.bgColor,
        flexDirection: 'column',
    },
    stack: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginTop: 8,
    },
    title: {
        fontSize: 24,
        fontFamily: FONT.bold,
        color: COLORS.text,
        marginLeft: 16,
    },
    cardList: {
        backgroundColor: COLORS.white,
        borderRadius: 12,
        flexDirection: 'column',
    },
    cardItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
    },
    itemLeft: {
        flexDirection: 'row',
        gap: 16,
        alignItems: 'center',
    },
    itemName: {
        fontSize: SIZES.medium,
        fontFamily: FONT.bold,
        color: COLORS.text,
    },
    cards: {
        paddingHorizontal: 16,
    },
    textEx: {
        fontSize: 12,
        fontFamily: FONT.regular,
        color: '#8C9093',
    },
})
