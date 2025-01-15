import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import {
    ImageBackground,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'
import image from '../../../../constants/image'
import PrevIcon from '../../../../components/icons/PrevIcon'
import Blur from '../../../../components/common/blur'
import { COLORS, FONT, SIZES } from '../../../../constants/theme'
import ListActions from '../../../../components/workout/list/ListActions'
import useExerciseQueries from '../../../database/tables/exercise'
import { useEffect, useState } from 'react'
import { getCategoryByCate } from '../../../../components/workout/ListCategory'
import { ActivityIndicator } from 'react-native'

const ListAction = () => {
    const { id } = useLocalSearchParams()
    const [data, setData] = useState()
    const router = useRouter()
    const { getExercisesByCategory } = useExerciseQueries()

    useEffect(() => {
        getExercisesByCategory(id).then((res) => {
            setData(groupExercisesByMuscleGroup(res))
        })
    }, [id])

    const handlePrevPress = () => {
        router.push('/workout')
    }

    if (!data) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.scrollContentContainer}>
            <Stack.Screen
                options={{
                    headerShown: false,
                }}
            />
            <ImageBackground
                source={getCategoryByCate(id).imageUrl}
                style={styles.imageBanner}
            >
                <TouchableOpacity
                    style={styles.btnPrev}
                    onPress={handlePrevPress}
                >
                    <PrevIcon />
                </TouchableOpacity>
                <Blur style={styles.blurWrap} />
            </ImageBackground>
            <View style={styles.header}>
                <Text style={styles.category}>
                    {getCategoryByCate(id).name}
                </Text>
                <Text style={styles.des}>{getCategoryByCate(id).des}</Text>
            </View>
            <View style={{ gap: 20, marginHorizontal: 16 }}>
                {data.map((item) => (
                    <ListActions key={item.name} list={item} />
                ))}
            </View>
        </ScrollView>
    )
}

export default ListAction

const styles = StyleSheet.create({
    scrollContentContainer: {
        paddingBottom: 60,
    },
    imageBanner: {
        aspectRatio: 1.63755458515,
        width: '100%',
        position: 'relative',
    },
    btnPrev: {
        position: 'absolute',
        top: 56,
        left: 16,
    },
    blurWrap: {
        position: 'absolute',
        bottom: 0,
    },
    header: {
        paddingHorizontal: 16,
    },
    category: {
        fontSize: SIZES.largeX,
        fontFamily: FONT.bold,
        color: COLORS.text,
    },
    des: {
        fontSize: SIZES.smallX,
        fontFamily: FONT.regular,
        color: COLORS.text,
        opacity: 0.5,
    },
})

function groupExercisesByMuscleGroup(exercises) {
    const grouped = exercises.reduce((result, exercise) => {
        const group = exercise.muscle_group // Get the muscle group
        if (!result[group]) {
            result[group] = [] // Initialize an array if group doesn't exist
        }
        result[group].push(exercise) // Add the exercise to the group
        return result
    }, {})

    // Transform into the desired structure
    return Object.keys(grouped).map((group) => ({
        name: group,
        listAction: grouped[group],
    }))
}
