import React, { useState } from 'react'
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { COLORS, FONT } from '../../../constants/theme'
import useUserQueries from '../../../app/database/tables/user'

const ChangeGender = ({ visible, handleEditUser, onCloseModal, gender }) => {
    const { updateUserInfo } = useUserQueries()

    const handleGenderSelection = async (selectedGender) => {
        handleEditUser('gender', selectedGender)
        try {
            const res = await updateUserInfo({ gender: selectedGender })
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
                    <Text style={styles.title}>Gender</Text>
                    <Text style={styles.title2}>What’s your gender?</Text>
                    <View style={styles.divider} />
                    <TouchableOpacity
                        style={[
                            styles.option,
                            gender === 'Male' && styles.selectedOption,
                        ]}
                        onPress={() => handleGenderSelection('Male')}
                    >
                        <Text
                            style={[
                                styles.optionText,
                                gender === 'Male' && styles.selectedOptionText,
                            ]}
                        >
                            Male
                        </Text>
                    </TouchableOpacity>
                    <View style={styles.divider} />
                    <TouchableOpacity
                        style={[
                            styles.option,
                            gender === 'Female' && styles.selectedOption,
                        ]}
                        onPress={() => handleGenderSelection('Female')}
                    >
                        <Text
                            style={[
                                styles.optionText,
                                gender === 'Female' &&
                                styles.selectedOptionText,
                            ]}
                        >
                            Female
                        </Text>
                    </TouchableOpacity>
                    <View style={styles.divider} />
                    <TouchableOpacity
                        style={[
                            styles.option,
                            gender === 'Other' && styles.selectedOption,
                        ]}
                        onPress={() => handleGenderSelection('Other')}
                    >
                        <Text
                            style={[
                                styles.optionText,
                                gender === 'Other' && styles.selectedOptionText,
                            ]}
                        >
                            Perfer not to say
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

export default ChangeGender

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
        fontSize: 18,
        fontFamily: FONT.bold,
        color: COLORS.primaryDark,
    },

    title2: {
        fontSize: 12,
        fontFamily: FONT.regular,
        color: COLORS.primaryDark,
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
        backgroundColor: '#BDBDBD',
        padding: 10,
        borderRadius: 12,
        width: '100%',
        alignItems: 'center',
        shadowColor: 'rgba(0, 0, 0, 0.10)', // iOS
        shadowOffset: { width: 0, height: 0 }, // iOS
        shadowOpacity: 0.1, // iOS
        shadowRadius: 4, // iOS
        elevation: 4, // Android
    },
    saveButton: {
        alignItems: 'center',
        padding: 10,
        borderRadius: 8,
        width: '100%',
        backgroundColor: COLORS.primary,
    },
    cancelText: {
        fontSize: 14,
        fontFamily: FONT.bold,
        color: COLORS.extradark,
    },
    saveText: {
        fontSize: 14,
        fontFamily: FONT.bold,
        color: COLORS.white,
    },
})
