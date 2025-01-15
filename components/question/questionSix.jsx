import React, { useEffect, useState } from 'react'
import {
    Text,
    View,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    ScrollView,
    SafeAreaView,
} from 'react-native'
import { COLORS, FONT, SIZES } from '../../constants/theme'
import * as Progress from 'react-native-progress'
import { router } from 'expo-router'
import AdvertiseMentOne from '../advertisement/AdvertisementOne'
import useUserQueries from '../../app/database/tables/user'

const QuestionSix = ({ answer }) => {
    const screenWidth = Dimensions.get('window').width
    const circleSize = screenWidth * 0.6

    const [progress, setProgress] = useState(0)

    const { updateUserInfo } = useUserQueries()

    const handleStart = () => {
        router.push('/home')
    }

    const handleSaveAnswer = async () => {
        try {
            const result = await updateUserInfo({
                ...answer,
                status: 'completed',
            })
            return result
        } catch (error) {
            //Toaster
            console.error('Error fetching updateUser: ', error)
            throw error
        }
    }

    useEffect(() => {
        handleSaveAnswer()
        const interval = setInterval(() => {
            setProgress((prevProgress) => {
                if (prevProgress >= 1) {
                    clearInterval(interval)
                    return 1
                }
                return prevProgress + 0.01
            })
        }, 30)
        return () => clearInterval(interval)
    }, [])

    return (
        <SafeAreaView style={{ flex: 1, }}>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.wrapContent}>
                    <Text style={styles.title}>
                        We create your{'\n'}training plan
                    </Text>

                    <Progress.Circle
                        size={circleSize}
                        progress={progress}
                        showsText={true}
                        formatText={() => `${Math.round(progress * 100)}%`}
                        color={COLORS.primaryDark}
                        borderWidth={0}
                        unfilledColor="#e6e6e6"
                        thickness={22}
                        textStyle={styles.progressText}
                        style={styles.progressCircle}
                    />

                    <Text style={styles.description}>
                        We create a workout according to{'\n'}demographic profile,
                        activity{'\n'}level and interests
                    </Text>

                    <AdvertiseMentOne />
                </View>


            </ScrollView>
            <View style={styles.fixedFooter}>
                <TouchableOpacity
                    style={[
                        styles.startTrainingButton,
                        {
                            backgroundColor:
                                progress >= 1 ? COLORS.primaryDark : COLORS.gray,
                        },
                    ]}
                    disabled={progress < 1}
                    onPress={handleStart}
                >
                    <Text style={styles.buttonText}>Start Training</Text>
                </TouchableOpacity>
            </View>

        </SafeAreaView>
    )
}

export default QuestionSix

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        paddingBottom: 80,
    },
    wrapContent: {
        width: '100%',
        alignItems: 'center',
    },
    title: {
        fontFamily: FONT.bold,
        fontSize: 24,
        textAlign: 'center',
        color: COLORS.text,
    },
    progressCircle: {
        marginVertical: 16,
    },
    progressText: {
        fontFamily: FONT.bold,
        fontSize: 40,
        color: COLORS.text,
    },
    description: {
        textAlign: 'center',
        fontSize: 16,
        fontFamily: FONT.regular,
        color: COLORS.text,
    },
    bottomContainer: {
        bottom: 0,
        backgroundColor: COLORS.white,
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingVertical: 30,
        paddingBottom: 20,
        minHeight: '31.157635468%',
        width: '100%',
    },
    adContainer: {
        width: '100%',
        borderRadius: 8,
        paddingVertical: 10,
        alignItems: 'center',
        marginBottom: 10,
    },
    adText: {
        fontSize: SIZES.medium,
        fontFamily: FONT.bold,
        color: COLORS.text,
        textAlign: 'center',
    },
    installButton: {
        backgroundColor: COLORS.primaryDark,
        paddingVertical: 15,
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
    },
    installButtonText: {
        color: COLORS.white,
        fontSize: SIZES.mediumX,
        fontFamily: FONT.bold,
    },
    fixedFooter: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 16,
        alignItems: 'center',
        paddingBottom: 10,
    },
    startTrainingButton: {
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginHorizontal: 16,
        width: '100%',
    },
    buttonText: {
        color: COLORS.white,
        fontSize: SIZES.mediumX,
        fontFamily: FONT.bold,
    },
})
