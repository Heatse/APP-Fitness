import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    ActivityIndicator,
    FlatList,
} from 'react-native'
import { COLORS, FONT, SIZES } from '../../constants/theme'
import AdvertiseMentTwo from '../advertisement/AdvertisementTwo'
import ListBestPlan from './ListBestPlan'
import { useState } from 'react'

const SelectBestPlan = ({ recommendedPlan }) => {
    const { width } = Dimensions.get('screen')
    const [activeIndex, setActiveIndex] = useState(0)

    if (!recommendedPlan) {
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

    const renderPagination = () => {
        return (
            <View style={styles.paginationContainer}>
                {recommendedPlan.map((_, index) => (
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
                <Text style={styles.textIntro}>Select a fitness plan!</Text>
                <Text style={styles.textDes}>
                    All plans are personalized for you
                </Text>
            </View>
            <AdvertiseMentTwo />
            <View style={styles.workoutHeader}>
                <Text style={styles.title}>Best for you!</Text>
            </View>
            <View style={styles.carouselContainer}>
                <FlatList
                    contentContainerStyle={{}}
                    data={recommendedPlan}
                    renderItem={({ item }) => (
                        <ListBestPlan key={item.plan_id} list={item} />
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

export default SelectBestPlan

const styles = StyleSheet.create({
    headText: {
        marginTop: 16,
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
    },
    infoLabel: {
        fontSize: SIZES.small,
        fontFamily: FONT.regular,
        color: COLORS.text,
        opacity: 0.7,
    },

    workoutHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
    },
    managerText: {
        fontFamily: FONT.regular,
        fontSize: SIZES.medium,
        color: COLORS.primaryDark,
    },
    title: {
        fontFamily: FONT.bold,
        fontSize: SIZES.largeX,
        color: COLORS.text,
    },

    carouselContainer: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        aspectRatio: 1.34,
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
