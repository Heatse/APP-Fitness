import React from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import { COLORS, FONT, SIZES } from '../../../constants/theme'

const ExerciseDay = ({ exercises }) => {
    const validExercises = Array.isArray(exercises) ? exercises : []

    if (!exercises.length) {
        return null // Or you can return a placeholder if you want
    }
    // Nhóm dữ liệu thành từng cụm 3 bài tập
    const groupedExercises = validExercises.reduce(
        (result, exercise, index) => {
            const groupIndex = Math.floor(index / 3)
            if (!result[groupIndex]) result[groupIndex] = []
            result[groupIndex].push(exercise)
            return result
        },
        []
    )

    return (
        <View style={styles.container}>
            {groupedExercises.map((group, groupIndex) => (
                <React.Fragment key={groupIndex}>

                    <View style={styles.card}>
                        {group.map((exercise, index) => (
                            <React.Fragment key={index}>
                                <View style={styles.overlay}>
                                    <Image
                                        source={{
                                            uri: `https://drive.google.com/thumbnail?id=${exercise?.image}&sz=w1000`,
                                        }}
                                        style={styles.image}
                                    />
                                    <View style={styles.containerTitle}>
                                        <Text style={styles.textTitle}>
                                            {exercise?.name}
                                        </Text>
                                        <Text style={styles.textSec}>
                                            {exercise?.seconds}s
                                        </Text>
                                    </View>
                                </View>
                                {index < group.length - 1 && (
                                    <View style={styles.separator} />
                                )}
                            </React.Fragment>
                        ))}
                    </View>

                    {groupIndex < groupedExercises.length - 1 && (
                        <View style={styles.restPeriod}>
                            <Text style={styles.restText}>- Rest: 30s -</Text>
                        </View>
                    )}
                </React.Fragment>
            ))}
        </View>
    )
}

export default ExerciseDay

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        backgroundColor: COLORS.bgColor,
        paddingVertical: 16,
        paddingBottom: 90,
    },
    card: {
        backgroundColor: COLORS.white,
        borderRadius: 12,
        marginHorizontal: 20,
        paddingVertical: 16,
        borderWidth: 1,
        borderColor: COLORS.gray,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
    },
    overlay: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
    },
    image: {
        width: 64,
        height: 64,
        borderRadius: 4,
    },
    containerTitle: {
        marginLeft: 20,
        justifyContent: 'center',
    },
    textTitle: {
        color: COLORS.text,
        fontSize: SIZES.medium,
        fontFamily: FONT.bold,
    },
    textSec: {
        color: COLORS.text,
        fontSize: SIZES.smallX,
        fontFamily: FONT.regular,
    },
    separator: {
        height: 1,
        backgroundColor: COLORS.gray,
        marginVertical: 10,
    },
    restPeriod: {
        alignItems: 'center',
        marginVertical: 16,
    },
    restText: {
        color: COLORS.text,
        fontSize: 14,
        fontFamily: FONT.bold,
        opacity: 0.5,
    },
})
