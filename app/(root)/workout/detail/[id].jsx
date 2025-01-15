import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'
import PrevIcon from '../../../../components/icons/PrevIcon'
import { COLORS, FONT } from '../../../../constants/theme'
import YoutubeVideoFrame from '../../../../components/workout/detail/YoutubeVideoFrame'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useEffect, useState } from 'react'
import useExerciseQueries from '../../../database/tables/exercise'

const WorkoutDetail = () => {
    const { id } = useLocalSearchParams()
    const router = useRouter()
    const { getExerciseDetail } = useExerciseQueries()

    const [data, setData] = useState()

    useEffect(() => {
        getExerciseDetail(id).then((res) => {
            if (!res || !res.length) {
                return
            }

            const newData = {
                ...res[0],
                action: JSON.parse(res[0].action),
                tip: JSON.parse(res[0].tip),
            }
            setData(newData)
        })
    }, [id])

    if (!data) {
        return (
            <View>
                <Text>Loading...</Text>
            </View>
        )
    }

    return (
        <SafeAreaView style={styles.safeView}>
            <ScrollView>
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
                        <Text style={styles.title}>Instructions</Text>
                    </View>
                </View>
                <View style={styles.container}>
                    <Text style={styles.actionName}>{data.ex_name}</Text>
                    <Text style={styles.category}>
                        Category: {data.category}
                    </Text>
                    <View style={styles.frameVid}>
                        <YoutubeVideoFrame videoId={data.video_url} />
                    </View>
                    {/* Action Section */}
                    <Text style={styles.header}>Action</Text>
                    <View style={styles.stepContainer}>
                        {Object.entries(data.action).map(([key, item]) => (
                            <Text
                                key={`${key}-${item.name}`}
                                style={styles.stepText}
                            >
                                <Text style={styles.stepNumber}>{key}. </Text>
                                <Text style={styles.boldText}>
                                    {item.name}:{' '}
                                </Text>
                                <Text>{item.content}</Text>
                            </Text>
                        ))}
                    </View>

                    {/* Tip Section */}
                    <Text style={styles.header}>Tip</Text>
                    <View style={styles.stepContainer}>
                        {Object.entries(data.tip).map(([key, item], index) => (
                            <Text
                                key={`${key}-${item.name}`}
                                style={styles.stepText}
                            >
                                <Text style={styles.stepNumber}>{key}. </Text>
                                <Text style={styles.boldText}>
                                    {item.name}:{' '}
                                </Text>
                                <Text>{item.content}</Text>
                            </Text>
                        ))}
                    </View>

                    {/* Muscle Focus Section */}
                    <Text style={styles.header}>
                        Muscle Focus: {data.muscle_focus}
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default WorkoutDetail

const styles = StyleSheet.create({
    safeView: {
        flex: 1,
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
    container: {},
    actionName: {
        fontSize: 24,
        fontFamily: FONT.bold,
        color: COLORS.primaryDark,
        textAlign: 'center',
    },
    category: {
        fontSize: 14,
        fontFamily: FONT.regular,
        color: COLORS.text,
        textAlign: 'center',
        opacity: 0.5,
        marginBottom: 8,
    },
    frameVid: {
        width: '100%',
        aspectRatio: 16 / 9,
        overflow: 'hidden',
        marginBottom: 16,
    },
    header: {
        fontSize: 20,
        fontFamily: FONT.bold,
        color: COLORS.text,
        paddingHorizontal: 16,
    },
    stepContainer: {
        marginBottom: 16,
        paddingHorizontal: 16,
    },
    stepText: {
        fontSize: 16,
        lineHeight: 24,
        fontFamily: FONT.regular,
        color: COLORS.text,
        marginBottom: 8,
        opacity: 0.5,
    },
    stepNumber: {
        fontFamily: FONT.bold,
        color: COLORS.text,
        opacity: 0.8,
    },
    boldText: {
        fontFamily: FONT.bold,
        color: COLORS.text,
        opacity: 0.8,
    },
    tipHeader: {
        fontSize: 20,
        fontFamily: FONT.bold,
        color: COLORS.text,
        marginTop: 16,
        marginBottom: 8,
    },
})
