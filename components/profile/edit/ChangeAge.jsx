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
import useUserQueries from '../../../app/database/tables/user'

const ChangeAge = ({
    visible,
    handleEditUser,
    onCloseModal,
    age: initialAge,
}) => {
    const [age, setAge] = useState(initialAge || '')
    const [error, setError] = useState('')

    const { updateUserInfo } = useUserQueries()

    const handleChangeText = (text) => {
        // Loại bỏ ký tự không phải số
        const cleaned = text.replace(/[^0-9]/g, '')

        // Giới hạn tuổi từ 1 đến 120
        if (cleaned && (Number(cleaned) < 1 || Number(cleaned) > 120)) {
            setError('Age must be between 1 and 120')
        } else {
            setError('')
        }

        setAge(cleaned)
    }

    const handleSaveAge = async () => {
        if (!age || Number(age) < 1 || Number(age) > 120) {
            setError('Please enter a valid age')
            return
        }

        handleEditUser('age', age)
        try {
            const res = await updateUserInfo({ age })
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
                    <Text style={styles.title}>Please enter your age</Text>
                    <TextInput
                        style={[
                            styles.input,
                            error ? { borderColor: 'red' } : {},
                        ]}
                        keyboardType="numeric"
                        value={age.toString()}
                        onChangeText={handleChangeText}
                        placeholder="Enter your age"
                        maxLength={3} // Giới hạn số ký tự tối đa là 3
                    />
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
                            onPress={handleSaveAge}
                        >
                            <Text style={styles.saveText}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

export default ChangeAge

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
        color: COLORS.text,
        marginBottom: 10,
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginBottom: 10,
        fontFamily: FONT.regular,
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
        backgroundColor: COLORS.primaryLight,
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
