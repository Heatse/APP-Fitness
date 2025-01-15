import {
    Dimensions,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'
import Pagination from '../pagination'
import { COLORS, FONT, SIZES } from '../../constants/theme'
import image from '../../constants/image'
import { useEffect, useRef, useState } from 'react'
import ItemIntro from './item'
import { router } from 'expo-router'
import AdvertiseMentOne from '../advertisement/AdvertisementOne'
import useUserQueries from '../../app/database/tables/user'

const Intro = () => {
    const { width } = Dimensions.get('screen')

    const [activeIndex, setActiveIndex] = useState(0)
    const [status, setStatus] = useState(null)
    const { getUserByParams } = useUserQueries()

    useEffect(() => {
        ; (async () => {
            try {
                const result = await getUserByParams(['status'])
                setStatus(result[0].status)
            } catch (error) {
                console.error('Error fetching status:', error)
            }
        })()
    }, [])

    const flatListRef = useRef(null)

    const handleNext = () => {
        const nextIndex = activeIndex + 1
        if (nextIndex < slides.length) {
            flatListRef.current.scrollToIndex({ index: nextIndex })
        }
    }

    const handleStart = () => {
        if (status === 'active') {
            router.push('/question')
        } else {
            router.push('/home')
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.carouselContainer}>
                <FlatList
                    ref={flatListRef}
                    data={slides}
                    renderItem={({ item }) => <ItemIntro item={item} />}
                    keyExtractor={(item) => item.id.toString()}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onScroll={(event) => {
                        const index = Math.round(
                            event.nativeEvent.contentOffset.x / width
                        )
                        setActiveIndex(index)
                    }}
                />
                <Pagination
                    data={slides}
                    activeIndex={activeIndex}
                    onNext={handleNext}
                    onStart={handleStart}
                />
            </View>

            <AdvertiseMentOne />
        </View>
    )
}

export default Intro

const slides = [
    {
        id: 1,
        url: image.intro1,
        text: 'Being Stronger',
        text1: 'Custom and fast planning with your target.',
    },
    {
        id: 2,
        url: image.intro2,
        text: 'Workout Categories',
        text1: 'Explore ~100K exercises made for you!',
    },
    {
        id: 3,
        url: image.intro3,
        text: 'Fitness and Workout',
        text1: 'Your personal online fitness trainer.',
    },
    {
        id: 4,
        url: image.intro4,
        text: 'Home Workout',
        text1: 'Workout anywhere you want.',
    },
]

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
        paddingTop: 40,
        justifyContent: 'space-between',
    },
    carouselContainer: {
        paddingHorizontal: 16,
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
})
