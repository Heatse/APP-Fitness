import React, { useState } from 'react'
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
} from 'react-native'
import { COLORS, FONT, SIZES } from '../../constants/theme'
import AdvertiseMentOne from '../advertisement/AdvertisementOne'

const QuestionTwo = ({ answer, onAnswer }) => {
    const [name, setName] = useState(answer?.name || '')
    const [age, setAge] = useState(answer?.age || '')
    const [nameError, setNameError] = useState('')
    const [ageError, setAgeError] = useState('')

    // Kiểm tra tính hợp lệ của dữ liệu
    const validateName = (name) => {
        if (name.length > 30) {
            setNameError('Name must be less than 30 characters.')
        } else {
            setNameError('')
        }
    }

    const validateAge = (age) => {
        const parsedAge = parseInt(age, 10)
        if (isNaN(parsedAge) || parsedAge < 1 || parsedAge > 130) {
            setAgeError('Age must be between 1 and 130.')
        } else {
            setAgeError('')
        }
    }

    // Enable button only if both name and age are valid
    const isContinueEnabled =
        !nameError && !ageError && name.trim() && age.trim()

    // Handle name and age change
    const handleNameChange = (text) => {
        if (text.length <= 32) {
            setName(text)
            validateName(text)
        }
        validateName(text)
    }

    const handleAgeChange = (text) => {
        if (text.length <= 3) {
            setAge(text)
            validateAge(text)
        }
        validateAge(text)
    }

    const onContinue = () => {
        onAnswer({
            ...answer,
            name,
            age,
        })
    }

    return (
        <ScrollView contentContainerStyle={{ flex: 1 }}>
            <View style={styles.container}>
                <View style={styles.wrapContent}>
                    <View style={{ flex: 1 }}>
                        <View style={styles.label1}>
                            <Text style={styles.label}>
                                What should we call you?
                            </Text>
                            <TextInput
                                underlineColorAndroid="transparent"
                                style={styles.input}
                                placeholder="Enter your name"
                                placeholderTextColor="lightgray"
                                value={name}
                                onChangeText={handleNameChange}
                            />
                            {nameError ? (
                                <Text style={styles.errorText}>
                                    {nameError}
                                </Text>
                            ) : null}
                        </View>

                        <View style={styles.label1}>
                            <Text style={styles.label}>What is your age?</Text>
                            <TextInput
                                underlineColorAndroid="transparent"
                                style={styles.input}
                                placeholder="0"
                                placeholderTextColor="lightgray"
                                keyboardType="numeric"
                                value={age}
                                onChangeText={handleAgeChange}
                            />
                            <Text
                                style={{
                                    color: COLORS.text,
                                    fontSize: SIZES.medium,
                                    fontFamily: FONT.bold,
                                    textAlign: 'center',
                                    width: '100%',
                                    marginTop: -24,
                                }}
                            >
                                Years
                            </Text>
                            {ageError ? (
                                <Text style={styles.errorText}>{ageError}</Text>
                            ) : null}
                        </View>
                    </View>

                    <TouchableOpacity
                        style={[
                            styles.continueButton,
                            isContinueEnabled
                                ? styles.continueButtonEnabled
                                : styles.continueButtonDisabled,
                        ]}
                        onPress={isContinueEnabled ? onContinue : null}
                        disabled={!isContinueEnabled}
                    >
                        <Text style={styles.continueText}>Continue</Text>
                    </TouchableOpacity>
                </View>
                <AdvertiseMentOne />
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    wrapContent: {
        paddingHorizontal: 16,
        flex: 1,
        height: '100%',
        justifyContent: 'space-between',
    },
    label1: {
        minHeight: '20%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    label: {
        color: COLORS.text,
        fontSize: SIZES.largeX,
        fontFamily: FONT.bold,
        textAlign: 'left',
        width: '100%',
    },
    input: {
        fontSize: SIZES.largeX,
        fontFamily: FONT.regular,
        textAlign: 'center',
        marginVertical: 16,
        minWidth: 300,
    },
    errorText: {
        color: 'red',
        fontSize: SIZES.small,
        marginTop: 8,
        textAlign: 'center',
    },
    continueButton: {
        paddingVertical: 12,
        borderRadius: 12,
        width: '100%',
        alignItems: 'center',
        marginBottom: 16,
    },
    continueButtonEnabled: {
        backgroundColor: COLORS.primaryDark,
    },
    continueButtonDisabled: {
        backgroundColor: COLORS.grayDark,
    },
    continueText: {
        color: COLORS.white,
        fontSize: SIZES.mediumX,
        fontFamily: FONT.bold,
    },
})

export default QuestionTwo
