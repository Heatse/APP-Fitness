import { Image, StyleSheet, Text, View } from 'react-native'
import { COLORS, FONT, SIZES } from '../../constants/theme'
import image from '../../constants/image'

const SpashScreenView = () => {
    return (
        <View style={styles.container}>
            <Image source={image.splash} style={styles.image1} />
            <Text style={styles.text}>Fitness and Workout</Text>
            <Text style={styles.text1}>
                Your personal online fitness trainer.
            </Text>
            <View style={styles.adContainer}>
                <Text style={styles.adText}>This action can contain ads</Text>
            </View>
        </View>
    )
}

export default SpashScreenView

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.text,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image1: {
        width: '60%',
        height: '30%',
        resizeMode: 'contain',
    },
    text: {
        fontSize: SIZES.largeX,
        fontFamily: FONT.bold,
        color: COLORS.white,
        marginBottom: 24,
    },
    text1: {
        fontSize: SIZES.mediumX,
        fontFamily: FONT.regular,
        color: COLORS.white,
        marginBottom: 16,
    },
    adContainer: {
        width: '100%',
        height: '8%',
        position: 'absolute',
        bottom: 20,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    adText: {
        fontSize: SIZES.medium,
        fontFamily: FONT.regular,
        color: COLORS.white,
    },
})
