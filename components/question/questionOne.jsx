import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { COLORS, FONT, SIZES } from '../../constants/theme'
import image from '../../constants/image'
import icon from '../../constants/icon'
import AdvertiseMentOne from '../advertisement/AdvertisementOne'
import Icon from 'react-native-vector-icons/MaterialIcons'
import TickIcon from './TickIcon'

const QuestionOne = ({ answer, onAnswer }) => {
    const currentGender = answer?.gender

    return (
        <View style={styles.container}>
            <View style={styles.wrapContent}>
                <View style={styles.wrapText}>
                    <Text style={styles.headerText}>
                        Welcome to Fitness and Workout.
                    </Text>
                    <Text style={styles.questionText}>What's your gender?</Text>
                </View>

                <View style={styles.genderContainer}>
                    <TouchableOpacity
                        style={[
                            styles.card,
                            currentGender === 'Female' && styles.selectedCard,
                        ]}
                        onPress={() =>
                            onAnswer({
                                ...answer,
                                gender: 'Female',
                            })
                        }
                    >
                        <View style={styles.cardContent}>
                            <Image source={icon.female} style={styles.icon} />
                            <Text style={styles.cardText}>Woman</Text>
                        </View>
                        <Image source={image.female} style={styles.cardImage} />
                        <TickIcon isDisplay={currentGender === 'Female'} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.card,
                            currentGender === 'Male' && styles.selectedCard,
                        ]}
                        onPress={() =>
                            onAnswer({
                                ...answer,
                                gender: 'Male',
                            })
                        }
                    >
                        <View style={styles.cardContent}>
                            <Image source={icon.male} style={styles.icon} />
                            <Text style={styles.cardText}>Man</Text>
                        </View>
                        <Image source={image.male} style={styles.cardImage} />
                        <TickIcon isDisplay={currentGender === 'Male'} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.card1,
                            currentGender === 'Other' && styles.selectedCard,
                        ]}
                        onPress={() =>
                            onAnswer({
                                ...answer,
                                gender: 'Other',
                            })
                        }
                    >
                        <View style={styles.flexContainer}>
                            <Text style={styles.cardText2}>
                                Prefer to skip, thanks!
                            </Text>
                            <Icon name="close" size={20} color={COLORS.text} />
                        </View>
                        <TickIcon isDisplay={currentGender === 'Other'} />
                    </TouchableOpacity>
                </View>
            </View>

            <AdvertiseMentOne />
        </View>
    )
}

export default QuestionOne

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    wrapContent: {
        flex: 1,
        gap: 6,
        paddingHorizontal: 16,
    },
    wrapText: {
        flexDirection: 'column',
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
        width: '100%',
        height: '25%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 10,
        borderRadius: 12,
        alignItems: 'center',
        borderColor: COLORS.gray,
        borderWidth: 1,
        position: 'relative',
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
    cardContent: {
        width: '40%',
        flexDirection: 'row',
        alignItems: 'center',
        left: 16,
    },
    icon: {
        width: '20%',
        height: 24,
        resizeMode: 'contain',
    },
    cardImage: {
        height: '100%',
        width: '80%',
        resizeMode: 'contain',
    },
    cardText: {
        fontSize: SIZES.medium,
        fontFamily: FONT.bold,
        color: COLORS.text,
        marginLeft: 5,
    },

    cardText2: {
        fontSize: SIZES.medium,
        fontFamily: FONT.bold,
        color: COLORS.text,
        marginLeft: 30,
    },
    selectedCard: {
        borderColor: COLORS.primaryDark,
    },
    flexContainer: {
        flexDirection: 'row',
        gap: 32,
        alignItems: 'center',
        width: '100%',
    },
})
