import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import image from '../../constants/image'
import { COLORS, FONT, SIZES } from '../../constants/theme'
import { useRouter } from 'expo-router'

const ListCategory = () => {
    const router = useRouter()

    const handleOnPress = (cate) => {
        router.push(`workout/list/${cate}`)
    }

    return (
        <View style={styles.container}>
            {categories.map((category, index) => (
                <TouchableOpacity
                    onPress={() => handleOnPress(category.cate)}
                    style={[styles.item, styles.active]}
                    key={index}
                >
                    <Text style={styles.text}>{category.name}</Text>
                    <Image style={styles.image} source={category.imageUrl} />
                </TouchableOpacity>
            ))}
        </View>
    )
}

export default ListCategory

const categories = [
    {
        name: 'Warm Up',
        imageUrl: image.bannerWarmUp,
        cate: 'warmup',
        des: 'A well-rounded workout should be paired with a proper warm up to reduce risk of muscle injury and improve fitness performance',
    },
    {
        name: 'Cardio',
        imageUrl: image.bannerCardio,
        cate: 'cardio',
        des: 'High intensity sessions that will give your heart, lungs and circulatory system a good workout',
    },
    {
        name: 'Strength',
        imageUrl: image.bannerStrength,
        cate: 'strength',
        des: 'Improve strength and endurance. Choose a muscle group you want to targer and see results shortly!',
    },
    {
        name: 'Balance Training ',
        imageUrl: image.bannerBalance,
        cate: 'balance',
        des: 'Exercise by helping to improve body stability and control',
    },
    {
        name: 'Cool Down',
        imageUrl: image.bannerCooldown,
        cate: 'cool down',
        des: 'A well-rounded workout should be paired with a proper cool down to reduce risk of muscle injury and improve fitness performance',
    },
]

export function getCategoryByCate(cate) {
    return categories.find((category) => category.cate === cate) || null
}

const styles = StyleSheet.create({
    container: {
        gap: 8,
        paddingHorizontal: 16,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
        borderRadius: 12,
        backgroundColor: COLORS.white,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    text: {
        marginLeft: 10,
        fontSize: SIZES.medium,
        fontFamily: FONT.bold,
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 4,
    },
    active: {

    },
})
