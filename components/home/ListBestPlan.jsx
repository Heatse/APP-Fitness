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
import { router } from 'expo-router'

const windowWidth = Dimensions.get('window').width

const ListBestPlan = ({ list }) => {
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
                        uri: `https://drive.google.com/thumbnail?id=${list?.image_url}&sz=w1000`,
                    }}
                    style={styles.image}
                />

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
                                {list?.duration_minute || '60'} Min
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
                            router.push(`/plan/${list?.plan_id}`)
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

export default ListBestPlan

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
        bottom: 10,
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
        alignItems: 'center',
        marginTop: 10,
    },
    iconText: {
        alignItems: 'center',
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
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
})
