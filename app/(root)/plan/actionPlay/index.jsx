import { router, Stack, useLocalSearchParams } from 'expo-router'
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
} from 'react-native'
import Icon from 'react-native-vector-icons/AntDesign'
import Icon2 from 'react-native-vector-icons/FontAwesome5'
import Icon3 from 'react-native-vector-icons/Ionicons'
import YoutubeVideoFrame from '../../../../components/workout/detail/YoutubeVideoFrame'
import { COLORS, FONT } from '../../../../constants/theme'
import PopupPause from '../../../../components/plan/actionPlay/PopupPause'
import { useEffect, useState } from 'react'
import usePlanQueries from '../../../database/tables/plan'

const ActionPlay = () => {
    const [isPauseModalVisible, setPauseModalVisible] = useState(false)
    const { day, id, currentWeek } = useLocalSearchParams()
    const { getPlanScheduleByDay2 } = usePlanQueries()
    const [planSchedule, setPlanSchedule] = useState([])
    const [modifiedPlanSchedule, setModifiedPlanSchedule] = useState([])
    const [exerciseName, setExerciseName] = useState('')
    const [exerciseDuration, setExerciseDuration] = useState('')
    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
    const [remainingTime, setRemainingTime] = useState(0)
    const [isRunning, setIsRunning] = useState(false)
    const [videoId, setVideoId] = useState('')

    useEffect(() => {
        getPlanScheduleByDay2(id, currentWeek, day)
            .then((data) => {
                setPlanSchedule(data);
                if (data.length > 0) {

                    const modifiedSchedule = createModifiedSchedule(data[0]);
                    setModifiedPlanSchedule(modifiedSchedule);
                    updateExercise(modifiedSchedule, 0);
                }
            })
            .catch((err) => console.error('Error fetching plan schedule:', err));
    }, [id, currentWeek, day]);


    useEffect(() => {
        let timer;
        if (isRunning && remainingTime > 0) {
            timer = setInterval(() => {
                setRemainingTime((prevTime) => {
                    if (prevTime <= 1) {
                        clearInterval(timer);
                        setIsRunning(false);
                        handleSkipExercise();
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [isRunning, remainingTime]);


    const createModifiedSchedule = (data) => {
        const exercises = data.list_exercise_details.split(',');
        let modified = [];
        for (let i = 0; i < exercises.length; i++) {
            modified.push({
                exercise: exercises[i].trim(),
                duration: data.second_list.split(',')[i].trim(),
                video: data.list_exercise_video.split(',')[i].trim(),
            });

            if ((i + 1) % 3 === 0 && i + 1 < exercises.length) {
                modified.push({
                    exercise: 'Rest',
                    duration: '30',
                    video: '',
                });
            }
        }
        return modified;
    };


    const updateExercise = (modifiedSchedule, index) => {
        if (index < modifiedSchedule.length) {
            const exerciseData = modifiedSchedule[index];
            const durationInSeconds = exerciseData.exercise === 'Rest' ? 30 : parseInt(exerciseData.duration, 10);
            const formattedDuration = exerciseData.exercise === 'Rest'
                ? '0:30'
                : `${Math.floor(durationInSeconds / 60)}:${String(durationInSeconds % 60).padStart(2, '0')}`;

            setExerciseName(exerciseData.exercise);
            setExerciseDuration(formattedDuration);
            setRemainingTime(durationInSeconds);
            setVideoId(exerciseData.video.trim());
            setIsRunning(true);
        }
    };

    const handleSkipExercise = () => {
        const nextIndex = currentExerciseIndex + 1;
        if (nextIndex < modifiedPlanSchedule.length) {
            setCurrentExerciseIndex(nextIndex);
            updateExercise(modifiedPlanSchedule, nextIndex);
        } else {
            console.log('No more exercises to skip to.');
        }
    };

    const handleBeforeExercise = () => {
        const prevIndex = currentExerciseIndex - 1;
        if (prevIndex >= 0) {
            setCurrentExerciseIndex(prevIndex);
            updateExercise(modifiedPlanSchedule, prevIndex);
        }
    };


    const handlePauseButtonPress = () => {
        setIsRunning(false)
        setPauseModalVisible(true)
    }

    const handleContinue = () => {
        setPauseModalVisible(false)
        setIsRunning(true)
    }

    const handleRestartExercise = () => {
        if (currentExerciseIndex < modifiedPlanSchedule.length) {
            const currentExercise = modifiedPlanSchedule[currentExerciseIndex];
            const durationInSeconds = currentExercise.exercise === 'Rest'
                ? 30
                : parseInt(currentExercise.duration, 10);

            setRemainingTime(durationInSeconds);
            setIsRunning(true);
            setPauseModalVisible(false);

            console.log(`Restarting exercise: ${currentExercise.exercise}`);
        }
    };

    const handleLeave = () => {
        setIsRunning(false)
        router.push({
            pathname: `plan/listPlan`,
            params: {
                day,
                id,
                currentWeek,
            },
        })
    }

    const handleStartOver = () => {
        if (modifiedPlanSchedule.length > 0) {
            setCurrentExerciseIndex(0);
            updateExercise(modifiedPlanSchedule, 0);
            setPauseModalVisible(false);
        }
    };


    const totalExercises = modifiedPlanSchedule.length;

    const formattedRemainingTime = `${Math.floor(remainingTime / 60)}:${String(
        remainingTime % 60
    ).padStart(2, '0')}`

    const handleFinish = () => {
        router.push({
            pathname: `plan/done`,
            params: {
                day,
                id,
                currentWeek,
            },
        })
    }

    return (
        <SafeAreaView style={styles.safeView}>
            <View style={styles.container}>
                <Stack.Screen options={{ headerShown: false }} />
                <View style={styles.frameVid}>
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity
                            style={styles.btnPrev}
                            onPress={() => router.back()}
                        >
                            <Icon name="arrowleft" size={24} color="black" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btnVolu}>
                            <Icon2 name="volume-up" size={24} color="white" />
                        </TouchableOpacity>
                    </View>
                    <YoutubeVideoFrame videoId={videoId} />
                </View>
            </View>

            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.exerciseName}>
                        {exerciseName || 'Loading...'}
                    </Text>
                    <TouchableOpacity style={styles.infoButton}>
                        <Icon name="questioncircleo" size={24} color="gray" />
                    </TouchableOpacity>
                </View>
                <Text style={styles.timer}>
                    {formattedRemainingTime || '00:00'}
                </Text>
            </View>

            <View style={styles.btContainer}>
                <TouchableOpacity
                    style={styles.pauseButton}
                    onPress={handlePauseButtonPress}
                >
                    <Icon2 name="pause" size={24} color="white" />
                    <Text style={styles.pauseText}>Pause</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.controls}>
                {currentExerciseIndex > 0 && (
                    <TouchableOpacity
                        style={styles.controlsButton}
                        onPress={handleBeforeExercise}
                    >
                        <Icon3 name="play-skip-back-outline" size={30} color="black" />
                        <Text style={styles.controlText}>Before</Text>
                    </TouchableOpacity>
                )}
                {currentExerciseIndex < totalExercises - 1 && (
                    <TouchableOpacity
                        style={styles.controlsButton}
                        onPress={handleSkipExercise}
                    >
                        <Text style={styles.controlText}>Skip</Text>
                        <Icon3 name="play-skip-forward-outline" size={30} color="black" />
                    </TouchableOpacity>
                )}
                {currentExerciseIndex === totalExercises - 1 && (
                    <TouchableOpacity
                        style={styles.controlsButton}
                        onPress={handleFinish}
                    >
                        <Text style={styles.controlText}>Finish</Text>
                        <Icon3 name="checkmark" size={30} color="black" />
                    </TouchableOpacity>
                )}
            </View>

            <PopupPause
                visible={isPauseModalVisible}
                onContinue={handleContinue}
                onRestart={handleRestartExercise}
                onLeave={handleLeave}
                onStartOver={handleStartOver}
            />
        </SafeAreaView>
    )
}

export default ActionPlay

const styles = StyleSheet.create({
    safeView: {
        flex: 1,
    },
    container: {
        marginBottom: 30,
    },
    btnPrev: {
        zIndex: 3,
        position: 'absolute',
        top: 20,
        left: 16,
    },
    btnVolu: {
        zIndex: 3,
        position: 'absolute',
        top: 20,
        right: 16,
    },
    frameVid: {
        width: '100%',
        aspectRatio: 16 / 9,
        overflow: 'hidden',
        backgroundColor: COLORS.primaryDark,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
    },
    content: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 50,
    },
    exerciseName: {
        fontSize: 16,
        fontFamily: FONT.bold,
        color: COLORS.text,
        lineHeight: 24
    },
    timer: {
        fontSize: 40,
        fontFamily: FONT.bold,
        color: COLORS.text,
        lineHeight: 48,
    },
    btContainer: {
        alignItems: 'center',
        bottom: '1%',
    },
    pauseButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: COLORS.primaryDark,
        paddingVertical: 8,
        paddingHorizontal: 55,
        borderRadius: 8,
    },
    pauseText: {
        color: COLORS.white,
        fontFamily: FONT.bold,
        fontSize: 16,
        marginLeft: 8,
        lineHeight: 24,
    },
    infoButton: {
        position: 'relative',
        left: 10,
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    controlsButton: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    controlText: {
        fontSize: 20,
        textAlign: 'center',
        fontFamily: FONT.regular,
        paddingHorizontal: 10,
    },
})
