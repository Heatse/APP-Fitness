import {
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'
import { COLORS, FONT, SIZES } from '../../constants/theme'
import image from '../../constants/image'
import AdvertiseMentOne from '../advertisement/AdvertisementOne'
import TickIcon from './TickIcon'
const windowWidth = Dimensions.get('window').width
const windowHeight = Dimensions.get('window').height

const QuestionFour = ({ answer, onAnswer }) => {
    const currentBodyType = answer?.type_body

    return (
        <View style={styles.container}>
            <View style={styles.wrapContent}>
                <View>
                    <Text style={styles.questionText}>
                        What’s your body type?
                    </Text>
                </View>

                <View style={styles.genderContainer}>
                    <TouchableOpacity
                        style={[
                            styles.card,
                            currentBodyType === 'slim' && styles.selectedCard,
                        ]}
                        onPress={() =>
                            onAnswer({ ...answer, type_body: 'slim' })
                        }
                    >
                        <View style={styles.cardContent}>
                            <Text style={styles.cardText}>Slim</Text>
                        </View>
                        <Image source={image.slim} style={styles.cardImage} />
                        <TickIcon isDisplay={currentBodyType === 'slim'} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.card,
                            currentBodyType === 'average' &&
                                styles.selectedCard,
                        ]}
                        onPress={() =>
                            onAnswer({ ...answer, type_body: 'average' })
                        }
                    >
                        <View style={styles.cardContent}>
                            <Text style={styles.cardText}>Average</Text>
                        </View>
                        <Image
                            source={image.average}
                            style={styles.cardImage}
                        />
                        <TickIcon isDisplay={currentBodyType === 'average'} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.card,
                            currentBodyType === 'heavy' && styles.selectedCard,
                        ]}
                        onPress={() =>
                            onAnswer({ ...answer, type_body: 'heavy' })
                        }
                    >
                        <View style={styles.cardContent}>
                            <Text style={styles.cardText}>Heavy</Text>
                        </View>
                        <Image source={image.heavy} style={styles.cardImage} />
                        <TickIcon isDisplay={currentBodyType === 'heavy'} />
                    </TouchableOpacity>
                </View>
            </View>

            <AdvertiseMentOne />
        </View>
    )
}

export default QuestionFour

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        gap: SIZES.medium,
    },
    wrapContent: {
        paddingHorizontal: 16,
    },
    headerText: {
        fontSize: SIZES.medium,
        fontFamily: FONT.bold,
        color: COLORS.text,
        opacity: 0.4,
    },
    questionText: {
        fontSize: SIZES.largeX,
        fontFamily: FONT.bold,
        color: COLORS.text,
    },
    genderContainer: {
        flexDirection: 'column',
    },
    card: {
        backgroundColor: COLORS.white,
        width: windowWidth * 0.915,
        height: windowHeight * 0.15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 10,
        borderRadius: 12,
        alignItems: 'center',
        borderColor: COLORS.gray,
        borderWidth: 1,
    },
    card1: {
        backgroundColor: COLORS.white,
        width: '100%',
        height: '15%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        borderRadius: 12,
        alignItems: 'center',
        borderColor: COLORS.gray,
        borderWidth: 1,
    },
    selectedCard: {
        borderColor: COLORS.primaryDark,
    },
    cardContent: {
        width: '40%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        width: '20%',
        height: 24,
        resizeMode: 'contain',
    },
    cardImage: {
        height: '100%',
        width: '80%',
        margin: 10,
        resizeMode: 'contain',
    },
    cardText: {
        fontSize: SIZES.medium,
        fontFamily: FONT.bold,
        color: COLORS.text,
        marginLeft: 20,
    },
    bottomContainer: {
        position: 'absolute',
        bottom: 0,
        backgroundColor: COLORS.white,
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingBottom: 20,
        minHeight: '31.157635468%',
        width: '100%',
    },
    adContainer: {
        width: '100%',
        borderRadius: 8,
        paddingVertical: 10,
        alignItems: 'center',
        marginBottom: 10,
    },
    adText: {
        fontSize: SIZES.medium,
        fontFamily: FONT.bold,
        color: COLORS.text,
        textAlign: 'center',
    },
    installButton: {
        backgroundColor: COLORS.primaryDark,
        paddingVertical: 15,
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
    },
    installButtonText: {
        color: COLORS.white,
        fontSize: SIZES.mediumX,
        fontFamily: FONT.bold,
    },
})
