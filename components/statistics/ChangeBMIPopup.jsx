import React, { useEffect, useState } from 'react'
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Modal,
    KeyboardAvoidingView,
    Platform,
} from 'react-native'
import { COLORS, FONT, SIZES } from '../../constants/theme'
import Icon from 'react-native-vector-icons/Feather'
import useUserQueries from '../../app/database/tables/user'
import { ftInToCm } from '../question/questionFive'
import { cmToFtIn } from '../profile/edit/ChangeHeight'

const ChangeBMIPopup = ({ visible, onClose, bmi, onSave }) => {
    console.log(bmi, 'BMI')

    const [showHelpModal, setShowHelpModal] = useState(false)
    const [tempWeight, setTempWeight] = useState(bmi.weight)
    const [tempHeight, setTempHeight] = useState(bmi.height)
    const [ft, setFt] = useState('')
    const [inches, setInches] = useState('')
    const [unitWeight, setUnitWeight] = useState('kg')
    const [unitHeight, setUnitHeight] = useState('cm')
    const [error, setError] = useState('')

    const { updateUserInfo } = useUserQueries()

    const toggleUnitWeight = () => {
        setUnitWeight((prev) => (prev === 'kg' ? 'lb' : 'kg'))
    }

    const toggleUnitHeight = () => {
        setUnitHeight((prev) => (prev === 'cm' ? 'ft&in' : 'cm'))
    }

    const handleChangeWeight = (text) => {
        setError('')
        if (text.length <= 5) {
            setTempWeight(text)
        }
    }

    const validateInputs = () => {
        if (
            tempWeight.trim() === '' ||
            (unitHeight === 'cm' && tempHeight.trim() === '') ||
            (unitHeight === 'ft&in' && (!ft || !inches))
        ) {
            setError('Please enter both height and weight.')
            return false
        }

        const weightValue = parseFloat(tempWeight)
        const heightValue = parseFloat(tempHeight)

        // Kiểm tra cân nặng hợp lệ theo đơn vị
        if (unitHeight === 'kg') {
            if (weightValue < 30 || weightValue > 200) {
                setError('Weight must be between 30kg and 200kg.')
                return false
            }
        } else if (unitHeight === 'lbs') {
            if (weightValue < 66 || weightValue > 440) {
                setError('Weight must be between 66lbs and 440lbs.')
                return false
            }
        }

        // Kiểm tra chiều cao hợp lệ theo đơn vị
        if (unitHeight === 'cm') {
            if (heightValue < 50 || heightValue > 300) {
                setError('Height must be between 50cm and 300cm.')
                return false
            }
        } else if (unitHeight === 'ft&in') {
            if (
                parseInt(ft) < 1 ||
                parseInt(ft) > 9 ||
                parseInt(inches) < 0 ||
                parseInt(inches) > 12
            ) {
                setError('Height must be between 1\'8" and 9\'10"')
                return false
            }
        }

        setError('') // Reset lỗi nếu tất cả hợp lệ
        return true
    }

    const handleSave = async () => {
        if (!validateInputs()) {
            return // Nếu không hợp lệ, không tiếp tục
        }
        const finalWeight =
            unitWeight === 'kg'
                ? tempWeight
                : (parseFloat(tempWeight) / 2.205).toFixed(2) // Convert kg to lbs

        let finalHeight = tempHeight

        if (unitHeight === 'ft&in') {
            finalHeight = ftInToCm(ft, inches).toFixed(2) // Chuyển ft&in sang cm
        }

        try {
            await updateUserInfo({ weight: finalWeight, height: finalHeight })
            onSave({ weight: finalWeight, height: finalHeight })
        } catch (error) {
            console.error('Error fetching updateUser: ', error)
            throw error
        }
        onClose() // Đóng modal
    }

    const handleCloseModal = () => {
        onClose()
        setTempHeight(bmi.height)
        setTempWeight(bmi.weight)
    }

    useEffect(() => {
        setTempWeight(
            unitWeight === 'kg' ? bmi.weight : (bmi.weight * 2.205).toFixed(2)
        )
        setTempHeight(bmi.height)
        const { feet, inches } = cmToFtIn(bmi.height)
        setFt(feet.toString())
        setInches(inches.toString())
    }, [bmi, unitWeight])

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose} // Hỗ trợ đóng khi nhấn nút back
        >
            <View style={styles.modalContainer}>
                <KeyboardAvoidingView
                    style={{
                        flex: 1,
                        width: '100%',
                        justifyContent: 'flex-end',
                    }}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                >
                    <View style={styles.popupContainer}>
                        <View style={styles.header}>
                            <Text style={styles.title}>BMI</Text>
                            <TouchableOpacity
                                onPress={() => setShowHelpModal(true)}
                            >
                                <Icon
                                    name="help-circle"
                                    size={20}
                                    color="gray"
                                    style={{ top: 5, left: 5 }}
                                />
                            </TouchableOpacity>
                        </View>

                        <Modal
                            transparent={true}
                            visible={showHelpModal}
                            animationType="none"
                            onRequestClose={() => setShowHelpModal(false)}
                        >
                            <TouchableOpacity
                                style={styles.helpModalContainer}
                                onPress={() => setShowHelpModal(false)}
                            >
                                <View style={styles.helpModalContent}>
                                    <Text style={styles.helpText}>
                                        BMI is a measure of body fat based on
                                        height and weight. Although there are
                                        some limitations, BMI can give a general
                                        idea of weight to determine whether
                                        someone is healthy or not.
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </Modal>

                        <Text style={styles.label}>Weight</Text>
                        <View style={styles.unitRow}>
                            <TouchableOpacity
                                style={[
                                    styles.unitButton,
                                    unitWeight === 'lb' &&
                                        styles.unitButtonActive,
                                ]}
                                onPress={toggleUnitWeight}
                            >
                                <Text
                                    style={[
                                        styles.unitText,
                                        unitWeight === 'lb' &&
                                            styles.unitTextActive,
                                    ]}
                                >
                                    lb
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.unitButton,
                                    unitWeight === 'kg' &&
                                        styles.unitButtonActive,
                                ]}
                                onPress={toggleUnitWeight}
                            >
                                <Text
                                    style={[
                                        styles.unitText,
                                        unitWeight === 'kg' &&
                                            styles.unitTextActive,
                                    ]}
                                >
                                    kg
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.inputRow}>
                            <TextInput
                                style={styles.input}
                                value={tempWeight.toString()}
                                keyboardType="numeric"
                                onChangeText={handleChangeWeight}
                                placeholder="Enter your weight"
                            />
                            <Text style={styles.unitLabel}>{unitWeight}</Text>
                            <TouchableOpacity
                                style={styles.clearButton}
                                onPress={() => setTempWeight('')}
                            >
                                <Icon name="x-circle" size={20} color="gray" />
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.label}>Height</Text>
                        <View style={styles.unitRow}>
                            <TouchableOpacity
                                style={[
                                    styles.unitButton,
                                    unitHeight === 'ft&in' &&
                                        styles.unitButtonActive,
                                ]}
                                onPress={toggleUnitHeight}
                            >
                                <Text
                                    style={[
                                        styles.unitText,
                                        unitHeight === 'ft&in' &&
                                            styles.unitTextActive,
                                    ]}
                                >
                                    ft
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.unitButton,
                                    unitHeight === 'cm' &&
                                        styles.unitButtonActive,
                                ]}
                                onPress={toggleUnitHeight}
                            >
                                <Text
                                    style={[
                                        styles.unitText,
                                        unitHeight === 'cm' &&
                                            styles.unitTextActive,
                                    ]}
                                >
                                    cm
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.inputRow}>
                            {unitHeight === 'ft&in' ? (
                                <View style={{ flexDirection: 'row', gap: 16 }}>
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            flex: 1,
                                            alignItems: 'center',
                                        }}
                                    >
                                        <TextInput
                                            style={styles.input}
                                            value={ft}
                                            onChangeText={(text) => {
                                                setFt(text), setError('')
                                            }}
                                            placeholder="Enter feet"
                                            keyboardType="numeric"
                                        />
                                        <Text style={styles.unitLabel}>ft</Text>
                                        <TouchableOpacity
                                            style={styles.clearButton}
                                            onPress={() => setFt('')}
                                        >
                                            <Icon
                                                name="x-circle"
                                                size={20}
                                                color="gray"
                                            />
                                        </TouchableOpacity>
                                    </View>
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            flex: 1,
                                            alignItems: 'center',
                                        }}
                                    >
                                        <TextInput
                                            style={styles.input}
                                            value={inches}
                                            onChangeText={(text) => {
                                                setInches(text)
                                                setError('')
                                            }}
                                            placeholder="Enter inches"
                                            keyboardType="numeric"
                                        />
                                        <Text style={styles.unitLabel}>in</Text>
                                        <TouchableOpacity
                                            style={styles.clearButton}
                                            onPress={() => setInches('')}
                                        >
                                            <Icon
                                                name="x-circle"
                                                size={20}
                                                color="gray"
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ) : (
                                <>
                                    <TextInput
                                        style={styles.input}
                                        value={Math.round(
                                            tempHeight
                                        ).toString()}
                                        onChangeText={(text) => {
                                            setTempHeight(text), setError('')
                                        }}
                                        placeholder="Enter height in cm"
                                        keyboardType="numeric"
                                    />
                                    <Text style={styles.unitLabel}>cm</Text>
                                    <TouchableOpacity
                                        style={styles.clearButton}
                                        onPress={() => setTempHeight('')}
                                    >
                                        <Icon
                                            name="x-circle"
                                            size={20}
                                            color="gray"
                                        />
                                    </TouchableOpacity>
                                </>
                            )}
                        </View>
                        {/* Error Message */}
                        {error && <Text style={styles.errorText}>{error}</Text>}

                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={handleCloseModal}
                            >
                                <Text style={styles.cancelText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.saveButton}
                                onPress={handleSave}
                            >
                                <Text style={styles.saveText}>Saved</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end', // Đặt modal ở dưới cùng
        alignItems: 'center', // Căn giữa theo chiều ngang
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    popupContainer: {
        backgroundColor: COLORS.white,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        width: '100%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    title: {
        fontSize: 20,
        fontFamily: FONT.bold,
        color: COLORS.text,
    },
    label: {
        fontSize: 20,
        fontFamily: FONT.bold,
        color: COLORS.text,
        marginBottom: 20,
    },
    unitRow: {
        flexDirection: 'row',
        marginBottom: 8,
        alignContent: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        backgroundColor: COLORS.gray,
        borderRadius: 999,
        width: '60%',
    },
    unitButton: {
        flex: 1,
        padding: 8,
        borderWidth: 1,
        borderColor: COLORS.gray,
        borderRadius: 999,
        alignItems: 'center',
    },
    unitButtonActive: {
        backgroundColor: COLORS.primaryDark,
        borderColor: COLORS.primaryDark,
    },
    unitText: {
        fontSize: 14,
        color: COLORS.grayDark,
        fontFamily: FONT.bold,
    },
    unitTextActive: {
        fontSize: 14,
        color: COLORS.white,
        fontFamily: FONT.bold,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.gray,
        borderRadius: 12,
        paddingHorizontal: 10,
        marginBottom: 20,
        backgroundColor: COLORS.white,
    },
    input: {
        flex: 1,
        color: 'blue',
        fontFamily: FONT.bold,
        minHeight: 45,
        height: 45,
    },
    unitLabel: {
        marginLeft: 8,
        color: COLORS.text,
        fontFamily: FONT.bold,
    },
    clearButton: {
        marginLeft: 8,
        padding: 4,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
    },
    cancelButton: {
        flex: 1,
        backgroundColor: COLORS.gray,
        padding: 12,
        borderRadius: 999,
        marginRight: 8,
    },
    cancelText: {
        fontSize: 16,
        color: COLORS.text,
        textAlign: 'center',
        fontFamily: FONT.bold,
    },
    saveButton: {
        flex: 1,
        backgroundColor: COLORS.primaryDark,
        padding: 12,
        borderRadius: 999,
    },
    saveText: {
        fontSize: 16,
        color: COLORS.white,
        textAlign: 'center',
        fontFamily: FONT.bold,
    },
    helpModalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    helpModalContent: {
        backgroundColor: COLORS.white,
        padding: 20,
        borderRadius: 10,
        width: '80%',
    },
    helpText: {
        fontSize: 16,
        color: COLORS.text,
        fontFamily: FONT.regular,
    },
    errorText: {
        color: 'red',
        fontSize: SIZES.small,
        fontFamily: FONT.regular,
    },
})

export default ChangeBMIPopup
