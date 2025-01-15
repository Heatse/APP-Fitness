import React, { useState } from 'react'
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Switch,
} from 'react-native'
import { COLORS, FONT } from '../../../../constants/theme'
import PrevIcon from '../../../../components/icons/PrevIcon'
import { router } from 'expo-router'
import AdvertiseMentFour from '../../../../components/advertisement/AdvertisementFour'

const SoundSettings = () => {
    // State for toggles
    const [exerciseNames, setExerciseNames] = useState(false)
    const [welcomeCongrats, setWelcomeCongrats] = useState(true)
    const [endCountdown, setEndCountdown] = useState(true)

    return (
        <ScrollView contentContainerStyle={styles.safeView}>
            <View style={{ flex: 1, paddingHorizontal: 16 }}>
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
                        <Text style={styles.title}>Sound</Text>
                    </View>
                </View>

                {/* Settings List */}
                <View style={styles.card}>
                    <View style={styles.settingItem}>
                        <Text style={styles.settingText}>Exercise Names</Text>
                        <Switch
                            value={exerciseNames}
                            onValueChange={(value) => setExerciseNames(value)}
                            trackColor={{
                                false: COLORS.gray,
                                true: COLORS.primaryDark,
                            }}
                            thumbColor={
                                exerciseNames
                                    ? COLORS.primaryDark
                                    : COLORS.lightGray
                            }
                        />
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.settingItem}>
                        <Text style={styles.settingText}>
                            Welcome & Congrats
                        </Text>
                        <Switch
                            value={welcomeCongrats}
                            onValueChange={(value) => setWelcomeCongrats(value)}
                            trackColor={{
                                false: COLORS.gray,
                                true: COLORS.primaryDark,
                            }}
                            thumbColor={
                                welcomeCongrats
                                    ? COLORS.primaryDark
                                    : COLORS.lightGray
                            }
                        />
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.settingItem}>
                        <Text style={styles.settingText}>
                            Exercise End Countdown
                        </Text>
                        <Switch
                            value={endCountdown}
                            onValueChange={(value) => setEndCountdown(value)}
                            trackColor={{
                                false: COLORS.gray,
                                true: COLORS.primaryDark,
                            }}
                            thumbColor={
                                endCountdown
                                    ? COLORS.primaryDark
                                    : COLORS.lightGray
                            }
                        />
                    </View>
                </View>
            </View>
            <AdvertiseMentFour />
        </ScrollView>
    )
}

export default SoundSettings

const styles = StyleSheet.create({
    safeView: {
        flex: 1,
        backgroundColor: COLORS.bgColor,
        justifyContent: 'space-between',
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
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        width: 40,
        height: 40,
    },
    title: {
        fontSize: 24,
        fontFamily: FONT.bold,
        color: COLORS.text,
        marginLeft: 16,
        textAlign: 'center',
    },
    card: {
        backgroundColor: COLORS.white,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    settingItem: {
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    settingText: {
        fontSize: 14,
        fontFamily: FONT.bold,
        color: COLORS.text,
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.lightGray,
    },
})
