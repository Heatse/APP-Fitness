import {
    Image,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Dimensions,
} from 'react-native'
import { COLORS, FONT, SIZES } from '../../constants/theme'
import icon from '../../constants/icon'
import Icon from 'react-native-vector-icons/Entypo'
import * as Progress from 'react-native-progress'
import { router } from 'expo-router'
const windowWidth = Dimensions.get('window').width
const windowHeight = Dimensions.get('window').height

const ListActivePlans = ({ list }) => {
    const { latest_day, latest_week, duration_weeks } = list

    let progress
    const totalDays = duration_weeks * 7

    if (latest_week > 1) {
        progress = ((latest_week - 1) * 7 + latest_day) / totalDays
    } else {
        progress = latest_day / totalDays
    }

    return (
        <TouchableOpacity
            style={styles.item}
            onPress={() => {
                router.push(`/plan/${list?.plan_id}`)
            }}
        >
            <View style={styles.imageContainer}>
                <Image
                    source={{
                        uri: `https://drive.google.com/thumbnail?id=${list.image_url}&sz=w1000`,
                    }}
                    style={styles.image}
                />
                <View style={styles.progressContainer}>
                    <Text style={styles.dayText}>
                        Day {list?.latest_day || 0}
                    </Text>
                    <Progress.Bar
                        progress={progress}
                        width={Dimensions.get('screen').width * 0.5}
                        color={COLORS.primary}
                        unfilledColor="rgba(128, 128, 128, 0.7)"
                        borderWidth={0}
                        height={10}
                        style={styles.progressBar}
                    />
                    <Text style={styles.progressPercentage}>
                        {`${Math.round(progress * 100)}%`} Complete
                    </Text>
                </View>

                <View style={styles.overlayContainer}>
                    <Text style={styles.planLabel}>Your Personal Plan</Text>
                    <Text
                        style={styles.planTitle}
                        numberOfLines={1}
                        ellipsizeMode="clip"
                    >
                        {list?.plan_name}
                    </Text>
                    <View style={styles.iconContainer}>
                        <View style={styles.iconText}>
                            <Image source={icon.time} style={styles.icon} />
                            <Text style={styles.iconLabel}>
                                {list?.duration_minute} Min
                            </Text>
                        </View>
                        <View style={styles.iconText}>
                            <Image source={icon.calo} style={styles.icon} />
                            <Text style={styles.iconLabel}>
                                {list?.calories} Kcal
                            </Text>
                        </View>
                        <View style={styles.iconText}>
                            <Image source={icon.plan} style={styles.icon} />
                            <Text style={styles.iconLabel}>
                                {list?.duration_weeks} Weeks
                            </Text>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={styles.playButton}
                        onPress={() => {
                            router.push(`/plan/${list.plan_id}`)
                        }}
                    >
                        <Icon
                            name="controller-play"
                            size={20}
                            color={COLORS.text}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default ListActivePlans

const styles = StyleSheet.create({
    item: {
        flex: 1,
        position: 'relative',
        width: windowWidth * 0.915,
        aspectRatio: 1.42,
        borderRadius: 20,
        overflow: 'hidden',
        paddingHorizontal: 5,
    },
    imageContainer: {
        width: '100%',
        height: '100%',
        borderRadius: 20,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    overlayContainer: {
        position: 'absolute',
        bottom: 5,
        left: 10,
        right: 10,
        padding: 10,
    },
    planLabel: {
        fontFamily: FONT.regular,
        fontSize: 10,
        color: COLORS.text,
        backgroundColor: COLORS.primary,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 10,
        alignSelf: 'flex-start',
    },
    planTitle: {
        fontFamily: FONT.bold,
        fontSize: SIZES.largeX,
        color: COLORS.white,
        marginTop: 5,
    },
    iconContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 5,
    },
    iconText: {
        alignItems: 'center',
        backgroundColor: COLORS.white,
        flexDirection: 'row',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
        marginRight: 5,
    },
    icon: {
        width: 18,
        height: 18,
        marginRight: 4,
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
        width: 40,
        height: 40,
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
        borderRadius: 5,
    },
    progressPercentage: {
        fontFamily: FONT.regular,
        fontSize: 12,
        color: COLORS.white,
    },
})
