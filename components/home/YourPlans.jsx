import {
    Image,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Dimensions,
    FlatList,
} from 'react-native'
import { COLORS, FONT, SIZES } from '../../constants/theme'
import icon from '../../constants/icon'
import AdvertiseMentTwo from '../advertisement/AdvertisementTwo'
import { router } from 'expo-router'
import ListActivePlans from './ListActivePlans'
import { useEffect, useState } from 'react'
import usePlanQueries from '../../app/database/tables/plan'

const YourPlans = ({ plansActiveDetail, statistics }) => {
    const { width } = Dimensions.get('screen')
    const [activePlan, setActivePlan] = useState([])
    const [activeIndex, setActiveIndex] = useState(0)
    const [reload, setReload] = useState(false)

    const { getAllUserPlanProgress } = usePlanQueries()

    useEffect(() => {
        getAllUserPlanProgress()
            .then((res) => {
                setActivePlan(res)
            })
            .catch((err) => console.error('Error fetching plan:', err))
    }, [reload])

    const handleManagerPage = () => {
        try {
            router.push(`profile/managerPlan`)
            setReload(!reload)
        } catch (error) {
            console.error(error)
        }
    }

    const renderPagination = () => {
        return (
            <View style={styles.paginationContainer}>
                {plansActiveDetail.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.paginationDot,
                            activeIndex === index && styles.activeDot,
                        ]}
                    />
                ))}
            </View>
        )
    }

    return (
        <View>
            <View style={styles.headText}>
                <Text style={styles.textIntro}>Your Plan!</Text>
                <Text style={styles.textDes}>
                    All plans are personalized for you
                </Text>
            </View>
            <View style={styles.infoContainer}>
                <View style={styles.infoBox}>
                    <Image source={icon.barbell} style={styles.infoIcon} />
                    <Text style={styles.infoValue}>
                        {statistics?.total_exercises}
                    </Text>
                    <Text style={styles.infoLabel}>Workout</Text>
                </View>
                <View style={styles.infoBox}>
                    <Image source={icon.kcal} style={styles.infoIcon} />
                    <Text style={styles.infoValue}>
                        {statistics?.total_calories}
                    </Text>
                    <Text style={styles.infoLabel}>Kcal</Text>
                </View>
                <View style={styles.infoBox}>
                    <Image source={icon.timeprimary} style={styles.infoIcon} />
                    <Text style={styles.infoValue}>
                        {statistics?.total_minutes}
                    </Text>
                    <Text style={styles.infoLabel}>Minutes</Text>
                </View>
            </View>
            <AdvertiseMentTwo />
            <View style={styles.workoutHeader}>
                <Text style={styles.title}>Workout Recently</Text>
                <TouchableOpacity onPress={handleManagerPage}>
                    <Text style={styles.managerText}>Manager</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.carouselContainer}>
                <FlatList
                    data={plansActiveDetail}
                    renderItem={({ item }) => (
                        <ListActivePlans key={item.plan_id} list={item} />
                    )}
                    horizontal
                    keyExtractor={(item) => item.plan_id.toString()}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    onScroll={(event) => {
                        const index = Math.round(
                            event.nativeEvent.contentOffset.x / width
                        )
                        setActiveIndex(index)
                    }}
                    pagingEnabled
                />
                {renderPagination()}
            </View>
        </View>
    )
}

export default YourPlans

const styles = StyleSheet.create({
    headText: {
        flexDirection: 'column',
        width: '100%',
        alignItems: 'flex-start',
    },
    textIntro: {
        fontSize: SIZES.largeX,
        fontFamily: FONT.bold,
        color: COLORS.text,
        lineHeight: 32,
    },
    textDes: {
        fontSize: SIZES.medium,
        fontFamily: FONT.regular,
        color: COLORS.text,
        opacity: 0.5,
        lineHeight: 22,
    },

    infoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
        paddingHorizontal: 20,
    },
    infoBox: {
        alignItems: 'center',
    },
    infoIcon: {
        width: 35,
        height: 35,
        marginBottom: 5,
    },
    infoValue: {
        fontSize: SIZES.largeX,
        fontFamily: FONT.bold,
        color: COLORS.text,
        lineHeight: 32,
    },
    infoLabel: {
        fontSize: SIZES.small,
        fontFamily: FONT.regular,
        color: COLORS.text,
        opacity: 0.7,
        lineHeight: 18,
    },

    workoutHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 10,
    },
    managerText: {
        fontFamily: FONT.regular,
        fontSize: SIZES.medium,
        color: COLORS.primaryDark,
    },

    carouselContainer: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontFamily: FONT.bold,
        fontSize: SIZES.largeX,
        color: COLORS.text,
    },
    item: {
        position: 'relative',
        zIndex: 1,
    },
    imageContainer: {
        position: 'relative',
        borderRadius: 20,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: 'auto',
        aspectRatio: 1.478448275862069,
        borderRadius: 20,
    },
    overlayContainer: {
        position: 'absolute',
        top: 130,
        left: 10,
        right: 10,
        padding: 10,
    },
    planLabel: {
        fontFamily: FONT.medium,
        fontSize: SIZES.small,
        color: COLORS.text,
        backgroundColor: COLORS.primary,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        alignSelf: 'flex-start',
    },
    planTitle: {
        fontFamily: FONT.bold,
        fontSize: SIZES.largeX,
        color: COLORS.white,
    },
    iconContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    iconText: {
        backgroundColor: COLORS.white,
        flexDirection: 'row',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 10,
        marginRight: 5,
    },
    icon: {
        width: 18,
        height: 18,
        marginRight: 5,
    },
    iconLabel: {
        fontFamily: FONT.regular,
        fontSize: SIZES.smallX,
        color: COLORS.text,
        top: 2,
    },
    playButton: {
        position: 'absolute',
        right: 10,
        backgroundColor: COLORS.primary,
        borderRadius: 25,
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    progressContainer: {
        position: 'absolute',
        left: 10,
        right: 10,
        padding: 10,
    },
    dayText: {
        fontFamily: FONT.bold,
        fontSize: 40,
        color: COLORS.white,
    },
    progressBar: {
        marginTop: 10,
        borderRadius: 5,
    },
    progressPercentage: {
        fontFamily: FONT.regular,
        fontSize: SIZES.smallX,
        color: COLORS.white,
    },

    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    paginationDot: {
        width: 6,
        height: 6,
        borderRadius: 5,
        backgroundColor: COLORS.grayDark,
        marginHorizontal: 3,
    },
    activeDot: {
        backgroundColor: COLORS.extradark,
        width: 16,
        height: 6,
    },
})
