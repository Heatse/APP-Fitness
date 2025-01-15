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

const Item = ({ list }) => {
    return (
        <TouchableOpacity
            style={styles.item}
            onPress={() => {
                router.push(`/plan/${list?.plan_id}`)
            }}
        >
            <Image
                source={{
                    uri: `https://drive.google.com/thumbnail?id=${list.image_url}&sz=w1000`,
                }}
                style={styles.image}
                resizeMode="cover"
            />

            <View style={styles.overlayContainer}>
                <Text
                    style={styles.planTitle}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                >
                    {list.plan_name}
                </Text>

                <View style={styles.iconContainer}>
                    <View style={styles.iconText}>
                        <Image source={icon.time} style={styles.icon} />
                        <Text style={styles.iconLabel}>
                            {list.duration_minute} Min
                        </Text>
                    </View>
                    <View style={styles.iconText}>
                        <Image source={icon.calo} style={styles.icon} />
                        <Text style={styles.iconLabel}>
                            {list.calories} Kcal
                        </Text>
                    </View>
                    <View style={styles.iconText}>
                        <Image source={icon.plan} style={styles.icon} />
                        <Text style={styles.iconLabel}>
                            {list.duration_weeks} Weeks
                        </Text>
                    </View>
                </View>

                <View style={styles.playButton}>
                    <Icon
                        name="controller-play"
                        size={15}
                        color={COLORS.text}
                    />
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default Item

const styles = StyleSheet.create({
    item: {
        position: 'relative',
        width: windowWidth * 0.65,
        borderRadius: 20,
        overflow: 'hidden',
        marginRight: 15,
        aspectRatio: 1.177,
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 20,
        resizeMode: 'cover',
    },
    overlayContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingVertical: 10,
        paddingHorizontal: 5,
    },
    planTitle: {
        fontFamily: FONT.bold,
        fontSize: 16,
        color: COLORS.white,
        lineHeight: 24,
    },
    iconContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5,
    },
    iconText: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        paddingHorizontal: 4,
        paddingVertical: 4,
        borderRadius: 10,
        marginRight: 5,
    },
    icon: {
        width: 16,
        height: 16,
        tintColor: COLORS.text,
        marginRight: 4,
    },
    iconLabel: {
        fontFamily: FONT.regular,
        fontSize: 11,
        color: COLORS.text,
        top: 2,
    },

    playButton: {
        position: 'absolute',
        right: 10,
        top: -20,
        backgroundColor: COLORS.primary,
        bottom: '110%',
        borderRadius: 15,
        width: 28,
        height: 28,
        alignItems: 'center',
        justifyContent: 'center',
    },
    playIcon: {
        fontSize: SIZES.large,
        color: COLORS.text,
    },
})
