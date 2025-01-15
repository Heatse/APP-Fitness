import React, { useState, useEffect } from 'react'
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

const ChangeHeight = ({
    visible,
    handleEditUser,
    onCloseModal,
    height: initialHeight,
    units,
}) => {
    const { updateUserInfo } = useUserQueries()
    const [height, setHeight] = useState(initialHeight || '')
    const [error, setError] = useState('')
    const [ft, setFt] = useState('')
    const [inches, setInches] = useState('')

    console.log('initialHeight', initialHeight)
    console.log('height', height)

    // Hàm chuyển đổi từ feet và inches sang cm
    const ftInToCm = (ft, inches) => {
        const totalInches = parseInt(ft, 10) * 12 + parseInt(inches, 10)
        const cm = totalInches * 2.54 // 1 inch = 2.54 cm
        return Math.round(cm)
    }

    // Kiểm tra giá trị chiều cao hợp lệ
    const validateHeight = (value) => {
        const numericValue = parseInt(value, 10)
        return numericValue >= 50 && numericValue <= 300 // Giới hạn chiều cao từ 50 đến 300 cm
    }

    // Xử lý khi thay đổi giá trị nhập
    const handleChangeText = (text) => {
        // Loại bỏ ký tự không phải số
        const cleaned = text.replace(/[^0-9]/g, '')
        setHeight(cleaned)
        setError('') // Reset lỗi khi người dùng tiếp tục nhập
    }

    const handleChangeFt = (text) => {
        const cleaned = text.replace(/[^0-9]/g, '')
        setFt(cleaned)
        setError('')
    }

    const handleChangeInches = (text) => {
        const cleaned = text.replace(/[^0-9]/g, '')
        setInches(cleaned)
        setError('')
    }

    const handleSaveHeight = async () => {
        let finalHeight = height

        // Nếu đơn vị là 'ft & in', chuyển đổi sang cm
        if (units === 'ft & in') {
            if (!ft || !inches) {
                setError('Please enter both feet and inches.')
                return
            }

            finalHeight = ftInToCm(ft, inches)
        }

        // Kiểm tra chiều cao hợp lệ
        if (!validateHeight(finalHeight)) {
            if (units === 'ft & in') {
                setError('Height must be between 1\'8" and 9\'10"')
            } else setError('Height must be between 50 and 300 cm')
            return
        }

        try {
            await updateUserInfo({ height: finalHeight }) // Gọi API cập nhật
            console.log('Updated height:', finalHeight)
            handleEditUser('height', finalHeight)
            setHeight(finalHeight)
            onCloseModal()
        } catch (error) {
            console.error('Error updating height: ', error)
            setError('Failed to update height. Please try again.')
        }
    }

    // Chuyển đổi chiều cao ban đầu (nếu có) từ cm sang ft & in khi modal mở
    useEffect(() => {
        if (units === 'ft & in' && initialHeight) {
            const { feet, inches } = cmToFtIn(initialHeight)
            setFt(feet.toString())
            setInches(inches.toString())
        }
    }, [initialHeight, units])

    return (
        <Modal transparent={true} visible={visible} animationType="slide">
            <View style={styles.overlay}>
                <View style={styles.popupContainer}>
                    <Text style={styles.title}>What is your height?</Text>

                    {units === 'ft & in' ? (
                        <View
                            style={{
                                flexDirection: 'row',
                                gap: 16,
                                width: '100%',
                            }}
                        >
                            <View style={{ flex: 1, flexDirection: 'column' }}>
                                <Text style={{ fontFamily: FONT.bold }}>
                                    ft
                                </Text>
                                <TextInput
                                    style={[
                                        styles.input,
                                        { height: 40 },
                                        error ? { borderColor: 'red' } : {},
                                    ]}
                                    keyboardType="numeric"
                                    value={ft}
                                    onChangeText={handleChangeFt}
                                    placeholder="Enter feet"
                                    maxLength={3} // Giới hạn 3 ký tự
                                />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontFamily: FONT.bold }}>
                                    in
                                </Text>

                                <TextInput
                                    style={[
                                        styles.input,
                                        { height: 40 },
                                        error ? { borderColor: 'red' } : {},
                                    ]}
                                    keyboardType="numeric"
                                    value={inches}
                                    onChangeText={handleChangeInches}
                                    placeholder="Enter inches"
                                    maxLength={3} // Giới hạn 3 ký tự
                                />
                            </View>
                        </View>
                    ) : (
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                position: 'relative',
                            }}
                        >
                            <TextInput
                                style={[
                                    styles.input,
                                    error ? { borderColor: 'red' } : {},
                                    { flex: 1 },
                                ]}
                                keyboardType="numeric"
                                value={Math.round(height).toString()}
                                onChangeText={handleChangeText}
                                placeholder={`Enter your height (${units})`}
                                maxLength={3} // Giới hạn 3 ký tự
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
                    )}

                    {error ? (
                        <Text style={styles.errorText}>{error}</Text>
                    ) : null}

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={() => {
                                onCloseModal()
                                setHeight(initialHeight)
                            }}
                        >
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.saveButton}
                            onPress={handleSaveHeight}
                        >
                            <Text style={styles.saveText}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

export default ChangeHeight

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
        width: '90%',
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

// Hàm chuyển đổi từ cm sang feet và inches
export const cmToFtIn = (cm) => {
    const totalInches = cm / 2.54
    const feet = Math.floor(totalInches / 12)
    const inches = Math.round(totalInches % 12)
    return { feet, inches }
}
