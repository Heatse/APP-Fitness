import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { COLORS, FONT } from '../../constants/theme'

const BMIScale = ({ bmi = '15', height = '170' }) => {
    const bmiRanges = [15, 18, 22, 25, 30, 35, 40]
    // [15, 16, 18.5, 25, 30, 35, 40]
    const colors = [
        '#6014CB ', // 15
        '#8E58EE ', // 18
        '#6CC5C8 ', // 20
        '#F8D200 ', // 22
        '#FEA700 ', // 25
        '#FF781F ', // 27
        '#FA5441 ', // 29
    ]

    // Hàm nội suy màu
    const interpolateColor = (startColor, endColor, factor) => {
        const hex = (color) => parseInt(color.slice(1), 16)
        const start = hex(startColor)
        const end = hex(endColor)

        const r = Math.round(
            ((end >> 16) & 0xff) * factor +
                ((start >> 16) & 0xff) * (1 - factor)
        )
        const g = Math.round(
            ((end >> 8) & 0xff) * factor + ((start >> 8) & 0xff) * (1 - factor)
        )
        const b = Math.round(
            (end & 0xff) * factor + (start & 0xff) * (1 - factor)
        )

        return `#${((1 << 24) + (r << 16) + (g << 8) + b)
            .toString(16)
            .slice(1)}`
    }

    // Hàm lấy màu tại vị trí BMI
    const getStatusCircleColor = (bmiValue) => {
        if (bmiValue <= bmiRanges[0]) return colors[0] // Nếu nhỏ hơn hoặc bằng giá trị đầu tiên
        if (bmiValue >= bmiRanges[bmiRanges.length - 1])
            return colors[colors.length - 1] // Nếu lớn hơn hoặc bằng giá trị cuối cùng

        for (let i = 0; i < bmiRanges.length - 1; i++) {
            const rangeStart = bmiRanges[i]
            const rangeEnd = bmiRanges[i + 1]
            const colorStart = colors[i]
            const colorEnd = colors[i + 1]

            if (bmiValue >= rangeStart && bmiValue < rangeEnd) {
                // Tính tỷ lệ phần trăm của giá trị trong khoảng này
                const factor = (bmiValue - rangeStart) / (rangeEnd - rangeStart)
                // Trả về màu sắc nội suy giữa hai màu
                return interpolateColor(colorStart, colorEnd, factor)
            }
        }
        return colors[0] // Mặc định nếu không có giá trị nào khớp (không nên xảy ra)
    }

    const getBmiPosition = (bmiValue) => {
        const minBMI = 15
        const maxBMI = 40
        const totalRange = maxBMI - minBMI

        // Kiểm tra nếu BMI nằm ngoài phạm vi
        if (bmiValue <= minBMI) return 0 // 0% nếu nhỏ hơn hoặc bằng 15
        if (bmiValue >= maxBMI) return 1 // 100% nếu lớn hơn hoặc bằng 40

        // Tính vị trí dựa trên tỷ lệ phần trăm từ 15 đến 40
        return (bmiValue - minBMI) / totalRange
    }

    const getLabelPosition = (value) => {
        const minBMI = 15
        const maxBMI = 40
        const rangeLength = maxBMI - minBMI // Độ dài khoảng từ 15 đến 40 là 25 đơn vị

        // Tính toán vị trí của value dựa trên khoảng từ 15 đến 40
        return ((value - minBMI) / rangeLength) * 100 // Trả về vị trí tính theo phần trăm
    }

    const bmiPosition = getBmiPosition(bmi)
    const statusCircleColor = getStatusCircleColor(bmi)

    return (
        <View style={styles.container}>
            <View style={styles.bmiRow}>
                <Text style={styles.bmiText}>{bmi}</Text>
                <View style={styles.statusContainer}>
                    <View
                        style={[
                            styles.statusCircle,
                            { backgroundColor: statusCircleColor },
                        ]}
                    />
                    <Text style={styles.statusLabel}>
                        {bmi < 18.5
                            ? 'Underweight'
                            : bmi < 24.9
                            ? 'Healthy weight'
                            : bmi < 29.9
                            ? 'Overweight'
                            : 'Obesity'}
                    </Text>
                </View>
            </View>
            <View style={styles.scaleContainer}>
                <LinearGradient
                    colors={[
                        '#6A00F4',
                        '#39B2FF',
                        '#4AC1FF',
                        '#FFD300',
                        '#FF9900',
                        '#FF4C4C',
                    ]}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={styles.scale}
                    // Tính toán lại các locations dựa trên tỷ lệ khoảng cách
                    locations={[0, 0.35, 0.4, 0.6, 0.8, 1]}
                >
                    <View
                        style={[
                            styles.indicator,
                            { left: `${getBmiPosition(bmi) * 100}%` }, // Chuyển vị trí thành phần trăm
                        ]}
                    />
                </LinearGradient>
                <View style={styles.labelRow}>
                    {bmiRanges.map((range, index) => (
                        <Text
                            key={index}
                            style={[
                                styles.label,
                                { left: `${getLabelPosition(range)}%` }, // Sử dụng hàm getLabelPosition để xác định vị trí
                            ]}
                        >
                            {range}
                        </Text>
                    ))}
                </View>
            </View>
            <View style={styles.heightContainer}>
                <Text style={styles.heightLabel}>Height</Text>
                <TouchableOpacity style={styles.heightValueContainer}>
                    <Text style={styles.heightText}>
                        {Math.round(height)}cm
                    </Text>
                    {/* <Icon
                        name="edit"
                        size={24}
                        color="#192126"
                        style={styles.editIcon}
                    /> */}
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        backgroundColor: COLORS.white,
        borderRadius: 12,
    },
    bmiRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
    },
    bmiText: {
        fontSize: 20,
        fontFamily: FONT.bold,
        color: COLORS.text,
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusCircle: {
        width: 24,
        height: 24,
        borderRadius: 100000,
        marginRight: 5,
    },
    statusLabel: {
        fontSize: 12,
        fontFamily: FONT.regular,
        color: COLORS.text,
    },
    scaleContainer: {
        marginTop: 10,
        width: '100%',
        alignItems: 'center',
    },
    scale: {
        width: '100%',
        height: 20,
        borderRadius: 10,
        position: 'relative',
    },
    indicator: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#4AC947',
        position: 'absolute',
        top: -5,
    },
    labelRow: {
        position: 'relative',
        width: '100%',
        paddingHorizontal: 5,
        marginTop: 5,
    },
    label: {
        position: 'absolute',
        fontSize: 12,
        color: '#666',
        transform: [{ translateX: -10 }],
    },
    heightContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 24,
        justifyContent: 'space-between',
    },
    heightLabel: {
        fontSize: 16,
        fontFamily: FONT.regular,
        color: COLORS.text,
        opacity: 0.5,
    },
    heightValueContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 10,
    },
    heightText: {
        fontSize: 20,
        fontFamily: FONT.bold,
        color: COLORS.text,
    },
    editIcon: {
        marginLeft: 24,
        opacity: 0.5,
    },
})

export default BMIScale
