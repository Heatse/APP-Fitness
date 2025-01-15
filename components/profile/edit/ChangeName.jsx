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

const ChangeName = ({
    visible,
    handleEditUser,
    onCloseModal,
    name: initialName,
}) => {
    const { updateUserInfo } = useUserQueries()
    const [name, setName] = useState(initialName || '')
    const [error, setError] = useState('')

    const validateName = (value) =>
        value.trim().length > 0 && value.length <= 20

    const handleNameChange = (text) => {
        if (text.length <= 20) {
            setError('')
        } else {
            setError('Name cannot exceed 20 characters')
        }
        setName(text)
    }

    const handleSaveName = async () => {
        if (!validateName(name)) {
            setError(
                name.trim().length === 0
                    ? 'Name cannot be empty'
                    : 'Name cannot exceed 20 characters'
            )
            return
        }

        try {
            await updateUserInfo({ name })
            handleEditUser('name', name)
            onCloseModal()
        } catch (error) {
            console.error('Error updating name:', error)
            setError('Failed to update name. Please try again.')
        }
    }

    return (
        <Modal transparent={true} visible={visible} animationType="slide">
            <View style={styles.overlay}>
                <View style={styles.popupContainer}>
                    <Text style={styles.title}>
                        Please enter your full name
                    </Text>
                    <TextInput
                        style={[
                            styles.input,
                            error ? { borderColor: 'red' } : {},
                        ]}
                        keyboardType="default"
                        value={name}
                        onChangeText={handleNameChange}
                        placeholder="Enter your name"
                        maxLength={20} // Giới hạn số ký tự nhập vào
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
                            onPress={handleSaveName}
                        >
                            <Text style={styles.saveText}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

export default ChangeName

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
