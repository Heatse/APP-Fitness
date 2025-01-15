import React from 'react'
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { COLORS, FONT } from '../../../constants/theme'
import useUserQueries from '../../../app/database/tables/user'

const ChangeUnits = ({ visible, handleEditUser, onCloseModal, units }) => {
    const { updateUserInfo } = useUserQueries()

    const handleUnitSelection = async (selectedUnit) => {
        try {
            const res = await updateUserInfo({ units: selectedUnit })
            handleEditUser('units', selectedUnit)
        } catch (error) {
            //Toaster
            console.error('Error fetching updateUser: ', error)
            throw error
        }

        onCloseModal()
    }

    return (
        <Modal transparent={true} visible={visible} animationType="slide">
            <View style={styles.overlay}>
                <View style={styles.popupContainer}>
                    <Text style={styles.title}>Units</Text>
                    <View style={styles.divider} />
                    <TouchableOpacity
                        style={[
                            styles.option,
                            units === 'Kg/cm' && styles.selectedOption,
                        ]}
                        onPress={() => handleUnitSelection('Kg/cm')}
                    >
                        <Text
                            style={[
                                styles.optionText,
                                units === 'Kg/cm' && styles.selectedOptionText,
                            ]}
                        >
                            Kg/cm
                        </Text>
                    </TouchableOpacity>
                    <View style={styles.divider} />
                    <TouchableOpacity
                        style={[
                            styles.option,
                            units === 'ft & in/lbs' && styles.selectedOption,
                        ]}
                        onPress={() => handleUnitSelection('ft & in/lbs')}
                    >
                        <Text
                            style={[
                                styles.optionText,
                                units === 'ft & in/lbs' &&
                                    styles.selectedOptionText,
                            ]}
                        >
                            ft & in/lbs
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={onCloseModal}
                    >
                        <Text style={styles.cancelText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 20,
    },
    popupContainer: {
        width: '100%',
        backgroundColor: COLORS.white,
        borderRadius: 10,
        paddingVertical: 10,
        alignItems: 'center',
    },
    title: {
        fontSize: 14,
        fontFamily: FONT.bold,
        color: COLORS.primaryDark,
        marginBottom: 10,
        marginTop: 10,
    },
    option: {
        padding: 10,
        borderRadius: 5,
        width: '100%',
        alignItems: 'center',
    },
    selectedOption: {
        backgroundColor: COLORS.lightGray,
    },
    optionText: {
        fontSize: 14,
        fontFamily: FONT.bold,
        color: COLORS.text,
    },
    selectedOptionText: {
        color: COLORS.primary,
    },
    divider: {
        width: '100%',
        height: 1,
        backgroundColor: COLORS.gray,
        marginVertical: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
        marginTop: 10,
    },
    cancelButton: {
        alignItems: 'center',
        padding: 10,
        borderRadius: 8,
        width: '100%',
        backgroundColor: '#BDBDBD',
        shadowColor: 'rgba(0, 0, 0, 0.10)', // iOS
        shadowOffset: { width: 0, height: 0 }, // iOS
        shadowOpacity: 0.1, // iOS
        shadowRadius: 4, // iOS
        elevation: 4, // Android
    },
    cancelText: {
        fontSize: 14,
        fontFamily: FONT.bold,
        color: COLORS.extradark,
    },
})

export default ChangeUnits

export function convertWeight(weight, newUnit) {
    let convertedWeight
    if (newUnit === 'kg') {
        convertedWeight = Math.round((parseFloat(weight) / 2.205) * 100) / 100
    } else if (newUnit === 'lbs') {
        convertedWeight = Math.round(parseFloat(weight) * 2.205 * 100) / 100
    } else return 'Invalid unit. Please use "lbs" or "kg".'

    return convertedWeight
}
