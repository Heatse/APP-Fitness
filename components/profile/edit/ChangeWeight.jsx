import React, { useState } from 'react'
import {
    Modal,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
} from 'react-native'
import { COLORS, FONT } from '../../../constants/theme'
import { convertWeight } from './ChangeUnits'
import useUserQueries from '../../../app/database/tables/user'

const ChangeWeight = ({
    visible,
    handleEditUser,
    onCloseModal,
    weight: initWeight,
    units,
}) => {
    const { updateUserInfo } = useUserQueries()
    const [weight, setWeight] = useState(initWeight)
    const [error, setError] = useState('')

    const handleSaveWeight = async () => {
        // Validate the weight before saving
        if (!validatWeight(weight)) {
            return
        }

        // Convert weight if necessary
        if (units === 'lbs') {
            weight = convertWeight(weight, 'lbs')
        }

        try {
            const res = await updateUserInfo({ weight })
            handleEditUser('weight', weight)
        } catch (error) {
            console.error('Error fetching updateUser: ', error)
            throw error
        }
        onCloseModal()
    }

    const validatWeight = (value) => {
        if (value.trim().length === 0) {
            setError('Weight cannot be empty')
            return false
        }

        // Convert value to number for validation
        const weightValue = parseFloat(value)

        // Check if the value is a valid number
        if (isNaN(weightValue)) {
            setError('Please enter a valid number for weight')
            return false
        }

        // Validation based on units (kg or lbs)
        if (units === 'kg') {
            if (weightValue < 30 || weightValue > 200) {
                setError('Weight must be between 30kg and 200kg')
                return false
            }
        } else if (units === 'lbs') {
            if (weightValue < 66 || weightValue > 440) {
                setError('Weight must be between 66lbs and 440lbs')
                return false
            }
        } else {
            setError('Invalid unit. Please use "kg" or "lbs".')
            return false
        }

        setError('') // Reset error if validation passes
        return true
    }

    const handleChangeWeight = (text) => {
        setError('')
        const regex = /^\d{0,6}([.,]\d{0,2})?$/
        if (regex.test(text)) {
            setWeight(text)
        }
    }

    return (
        <Modal transparent={true} visible={visible} animationType="slide">
            <View style={styles.overlay}>
                <View style={styles.popupContainer}>
                    <Text style={styles.title}>What is your weight?</Text>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            position: 'relative',
                        }}
                    >
                        <TextInput
                            style={[styles.input, { flex: 1 }]}
                            keyboardType="numeric"
                            value={
                                units === 'lbs'
                                    ? convertWeight(weight, 'kg').toString()
                                    : weight.toString()
                            }
                            onChangeText={handleChangeWeight}
                            placeholder={`Enter your weight (${units})`}
                        />
                        <Text
                            style={{
                                position: 'absolute',
                                right: 10,
                                top: 10,
                                fontSize: 16,
                                color: COLORS.text,
                            }}
                        >
                            {units}
                        </Text>
                    </View>
                    {error ? (
                        <Text style={styles.errorText}>{error}</Text>
                    ) : null}
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={onCloseModal}
                        >
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.saveButton}
                            onPress={() => handleSaveWeight()}
                        >
                            <Text style={styles.saveText}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

export default ChangeWeight

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 20,
    },
    popupContainer: {
        width: '100%',
        backgroundColor: COLORS.white,
        borderRadius: 10,
        padding: 10,
        alignItems: 'center',
    },
    title: {
        fontSize: 14,
        fontFamily: FONT.bold,
        color: COLORS.text,
        marginBottom: 10,
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: COLORS.gray,
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
        marginBottom: 10,
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        fontFamily: FONT.regular,
        marginBottom: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    cancelButton: {
        flex: 1,
        alignItems: 'center',
        padding: 10,
        borderRadius: 8,
        backgroundColor: COLORS.white,
        marginRight: 10,
    },
    saveButton: {
        flex: 1,
        alignItems: 'center',
        padding: 10,
        borderRadius: 8,
        backgroundColor: COLORS.white,
    },
    cancelText: {
        fontSize: 14,
        fontFamily: FONT.bold,
        color: COLORS.extradark,
    },
    saveText: {
        fontSize: 14,
        fontFamily: FONT.bold,
        color: COLORS.primaryDark,
    },
})
