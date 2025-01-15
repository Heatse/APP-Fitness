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

const QuestionThree = ({ answer, onAnswer }) => {
    const currentGoal = answer?.goal
    return (
        <View style={styles.container}>
            <View style={styles.wrapContent}>
                <View>
                    <Text style={styles.questionText}>What’s your goal?</Text>
                </View>

                <View style={styles.genderContainer}>
                    <TouchableOpacity
                        style={[
                            styles.card,
                            currentGoal === 'loseWeight' && styles.selectedCard,
                        ]}
                        onPress={() =>
                            onAnswer({ ...answer, goal: 'loseWeight' })
                        }
                    >
                        <View style={styles.cardContent}>
                            <Text style={styles.cardText}>Lose Weight</Text>
                        </View>
                        <Image
                            source={image.loseWeights}
                            style={styles.cardImage}
                        />
                        <TickIcon isDisplay={currentGoal === 'loseWeight'} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.card,
                            currentGoal === 'gainMussle' && styles.selectedCard,
                        ]}
                        onPress={() =>
                            onAnswer({ ...answer, goal: 'gainMussle' })
                        }
                    >
                        <View style={styles.cardContent}>
                            <Text style={styles.cardText} numberOfLines={1}>
                                Gain Muscle Mass
                            </Text>
                        </View>
                        <Image
                            source={image.gainMuscle}
                            style={styles.cardImage}
                        />
                        <TickIcon isDisplay={currentGoal === 'gainMussle'} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.card,
                            currentGoal === 'shredded' && styles.selectedCard,
                        ]}
                        onPress={() =>
                            onAnswer({ ...answer, goal: 'shredded' })
                        }
                    >
                        <View style={styles.cardContent}>
                            <Text style={styles.cardText}>Get Shredded</Text>
                        </View>
                        <Image
                            source={image.shredded}
                            style={styles.cardImage}
                        />
                        <TickIcon isDisplay={currentGoal === 'shredded'} />
                    </TouchableOpacity>
                </View>
            </View>

            <AdvertiseMentOne />
        </View>
    )
}

export default QuestionThree

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
        fontSize: 24,
        fontFamily: FONT.bold,
        color: COLORS.text,
    },
    genderContainer: {
        flexDirection: 'column',
    },
    card: {
        position: 'relative',
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
    selectedCard: {
        borderColor: COLORS.primaryDark,
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        height: 24,
        resizeMode: 'contain',
    },
    cardImage: {
        height: '100%',
        width: '20%',
        margin: 10,
        resizeMode: 'contain',
    },
    cardText: {
        fontSize: SIZES.medium,
        fontFamily: FONT.bold,
        color: COLORS.text,
        marginLeft: 20,
    },
})
