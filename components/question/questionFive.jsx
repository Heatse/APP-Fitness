import React, { useState } from 'react'
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native'
import { COLORS, FONT, SIZES } from '../../constants/theme'

// Hàm chuyển đổi từ ft & in sang cm
export const ftInToCm = (ft, inches) => {
    const totalInches = parseInt(ft, 10) * 12 + parseInt(inches, 10)
    return totalInches * 2.54 // 1 inch = 2.54 cm
}

export const cmToFtIn = (cm) => {
    const totalInches = cm / 2.54 // Chuyển đổi cm sang inch
    const ft = Math.floor(totalInches / 12) // Lấy số feet
    const inches = Math.round(totalInches % 12) // Lấy phần dư inches
    return { ft, inches }
}

const QuestionFive = ({ answer, onAnswer }) => {
    const [weight, setWeight] = useState(answer?.weight || '')
    const [height, setHeight] = useState(answer?.height || '')
    const { ft: defaultFt, inches: defaultInches } = cmToFtIn(
        answer?.height || ''
    )
    const [ft, setFt] = useState(defaultFt.toString())
    const [inches, setInches] = useState(defaultInches.toString())
    const [weightUnit, setWeightUnit] = useState('kg')
    const [heightUnit, setHeightUnit] = useState('cm')
    const [error, setError] = useState('')

    const isContinueEnabled =
        (heightUnit === 'cm' && weight.trim() && height.trim() && !error) ||
        (heightUnit === 'ft&in' && weight.trim() && ft && inches && !error)

    const handleChangeWeight = (text) => {
        setError('')
        const regex = /^\d{0,6}([.,]\d{0,2})?$/
        if (regex.test(text)) {
            setWeight(text)
        }
    }

    // Kiểm tra tính hợp lệ của chiều cao và cân nặng
    const validateInputs = () => {
        if (
            weight.trim() === '' ||
            (heightUnit === 'cm' && height.trim() === '') ||
            (heightUnit === 'ft&in' && (!ft || !inches))
        ) {
            setError('Please enter both height and weight.')
            return false
        }

        const weightValue = parseFloat(weight)
        const heightValue = parseFloat(height)

        // Kiểm tra cân nặng hợp lệ theo đơn vị
        if (weightUnit === 'kg') {
            if (weightValue < 30 || weightValue > 200) {
                setError('Weight must be between 30kg and 200kg.')
                return false
            }
        } else if (weightUnit === 'lbs') {
            const weightInKg = weightValue / 2.205
            if (weightInKg < 30 || weightInKg > 200) {
                setError('Weight must be between 66lbs and 440lbs.')
                return false
            }
        }

        // Kiểm tra chiều cao hợp lệ theo đơn vị
        if (heightUnit === 'cm') {
            if (heightValue < 50 || heightValue > 300) {
                setError('Height must be between 50cm and 300cm.')
                return false
            }
        } else if (heightUnit === 'ft&in') {
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

    // Chuyển đổi chiều cao và cân nặng trước khi gửi
    const onContinue = () => {
        if (!validateInputs()) {
            return // Nếu không hợp lệ, không tiếp tục
        }

        const finalWeight =
            weightUnit === 'kg'
                ? weight
                : (parseFloat(weight) / 2.205).toFixed(2) // Convert kg to lbs
        let finalHeight = height

        if (heightUnit === 'ft&in') {
            finalHeight = ftInToCm(ft, inches).toFixed(2) // Chuyển ft&in sang cm
        }

        onAnswer({
            ...answer,
            weight: finalWeight,
            height: finalHeight,
        })
    }

    const changeWeightUnit = (newUnit) => {
        if (weightUnit !== newUnit) {
            if (!weight.trim()) {
                setWeightUnit(newUnit)
                return
            }

            let convertedWeight
            if (newUnit === 'kg') {
                convertedWeight =
                    Math.round((parseFloat(weight) / 2.205) * 100) / 100
            } else if (newUnit === 'lbs') {
                convertedWeight =
                    Math.round(parseFloat(weight) * 2.205 * 100) / 100
            }
            setWeight(convertedWeight.toString())
            setWeightUnit(newUnit)
        }
    }

    const handleHeightInput = (text) => {
        setError('') // Reset lỗi khi thay đổi chiều cao
        const regex = /^\d{0,3}([.,]\d{0,2})?$/ // 3 chữ số nguyên + 1 dấu ngăn cách + 2 số thập phân
        if (regex.test(text)) {
            setHeight(text) // Chỉ cập nhật nếu đầu vào hợp lệ
        }
    }

    const handleInchesInput = (text) => {
        setError('') // Reset lỗi khi thay đổi inches
        const regex = /^([0-9]|1[0-2])?$/ // Cho phép số từ 0-12
        if (regex.test(text)) {
            setInches(text) // Chỉ cập nhật nếu đầu vào hợp lệ
        }
    }

    const handleFtInput = (text) => {
        setError('') // Reset lỗi khi thay đổi feet
        const regex = /^\d{0,3}$/ // Cho phép tối đa 3 chữ số nguyên
        if (regex.test(text)) {
            setFt(text) // Chỉ cập nhật nếu đầu vào hợp lệ
        }
    }

    const handleChangeHeightUnit = (newUnit) => {
        if (heightUnit !== newUnit) {
            if (newUnit === 'cm') {
                if (!ft.trim() || !inches.trim()) {
                    setHeight('')
                } else {
                    const convertedHeight = ftInToCm(ft, inches).toFixed(2)
                    setHeight(convertedHeight)
                }
                setFt('')
                setInches('')
            } else if (newUnit === 'ft&in') {
                if (!height.trim()) {
                    setFt('')
                    setInches('')
                } else {
                    const { ft: convertedFt, inches: convertedInches } =
                        cmToFtIn(parseFloat(height))
                    setFt(convertedFt.toString())
                    setInches(convertedInches.toString())
                }
                setHeight('')
            }
            setHeightUnit(newUnit)
        }
    }

    return (
        <ScrollView contentContainerStyle={{ flex: 1 }}>
            <View style={styles.container}>
                <View style={styles.wrapContent}>
                    {/* Weight Section */}
                    <View>
                        <View style={styles.label}>
                            <Text style={styles.text1}>
                                What’s your weight?
                            </Text>

                            <View style={styles.unitSelectionContainer}>
                                <Text style={styles.text2}>
                                    Current Weight ({weightUnit})
                                </Text>

                                <View style={{ flexDirection: 'row' }}>
                                    <TouchableOpacity
                                        style={[
                                            styles.unitButton,
                                            weightUnit === 'kg' &&
                                                styles.selectedUnitButton,
                                        ]}
                                        onPress={() => {
                                            changeWeightUnit('kg')
                                            setError('')
                                        }}
                                    >
                                        <Text style={styles.unitButtonText}>
                                            kg
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[
                                            styles.unitButton,
                                            weightUnit === 'lbs' &&
                                                styles.selectedUnitButton,
                                        ]}
                                        onPress={() => {
                                            changeWeightUnit('lbs')
                                            setError('')
                                        }}
                                    >
                                        <Text style={styles.unitButtonText}>
                                            lbs
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <TextInput
                                style={styles.input}
                                placeholder="Enter your weight"
                                placeholderTextColor="lightgray"
                                value={weight}
                                onChangeText={handleChangeWeight}
                                keyboardType="numeric"
                            />
                        </View>

                        {/* Height Section */}
                        <View style={styles.label}>
                            <Text style={styles.text1}>
                                What’s your height?
                            </Text>

                            <View style={styles.unitSelectionContainer}>
                                <Text style={styles.text2}>
                                    Current Height ({heightUnit})
                                </Text>

                                <View style={{ flexDirection: 'row' }}>
                                    <TouchableOpacity
                                        style={[
                                            styles.unitButton,
                                            heightUnit === 'cm' &&
                                                styles.selectedUnitButton,
                                        ]}
                                        onPress={() => {
                                            handleChangeHeightUnit('cm')
                                            setError('')
                                        }}
                                    >
                                        <Text style={styles.unitButtonText}>
                                            cm
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[
                                            styles.unitButton,
                                            heightUnit === 'ft&in' &&
                                                styles.selectedUnitButton,
                                        ]}
                                        onPress={() => {
                                            handleChangeHeightUnit('ft&in')
                                            setError('')
                                        }}
                                    >
                                        <Text style={styles.unitButtonText}>
                                            ft&in
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {heightUnit === 'cm' ? (
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter your height"
                                    placeholderTextColor="lightgray"
                                    value={height}
                                    onChangeText={handleHeightInput}
                                    keyboardType="numeric"
                                />
                            ) : (
                                <View style={{ flexDirection: 'row', gap: 8 }}>
                                    <View style={{ flex: 1 }}>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Feet"
                                            placeholderTextColor="lightgray"
                                            value={ft}
                                            onChangeText={handleFtInput}
                                            keyboardType="numeric"
                                        />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Inches"
                                            placeholderTextColor="lightgray"
                                            value={inches}
                                            onChangeText={handleInchesInput}
                                            keyboardType="numeric"
                                        />
                                    </View>
                                </View>
                            )}
                        </View>

                        {/* Error Message */}
                        {error && <Text style={styles.errorText}>{error}</Text>}
                    </View>

                    {/* Continue Button */}
                    <TouchableOpacity
                        style={[
                            styles.continueButton,
                            isContinueEnabled
                                ? styles.continueButtonEnabled
                                : styles.continueButtonDisabled,
                        ]}
                        onPress={onContinue}
                        disabled={!isContinueEnabled}
                    >
                        <Text style={styles.continueText}>Continue</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    )
}

export default QuestionFive

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    wrapContent: {
        paddingHorizontal: 16,
        gap: 24,
        flex: 1,
        justifyContent: 'space-between',
    },
    label: {
        gap: 8,
    },

    text1: {
        color: COLORS.text,
        fontSize: SIZES.largeX,
        fontFamily: FONT.black,
    },
    text2: {
        color: COLORS.primaryDark,
        fontSize: SIZES.med,
        fontFamily: FONT.black,
    },

    input: {
        backgroundColor: COLORS.white,
        borderRadius: 12,
        fontSize: SIZES.mediumX,
        fontFamily: FONT.bold,
        paddingVertical: 10,
        paddingHorizontal: 20,
        minHeight: 44,
    },

    unitSelectionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
    },
    unitButton: {
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: COLORS.grayDark,
        marginRight: 8,
    },
    selectedUnitButton: {
        backgroundColor: COLORS.primaryLight,
        borderColor: COLORS.primaryDark,
    },
    unitButtonText: {
        fontSize: SIZES.medium,
        fontFamily: FONT.medium,
        color: COLORS.text,
    },

    errorText: {
        color: 'red',
        fontSize: SIZES.small,
        fontFamily: FONT.regular,
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
        backgroundColor: COLORS.gray,
    },

    continueText: {
        color: COLORS.white,
        fontSize: SIZES.mediumX,
        fontFamily: FONT.bold,
    },
})
