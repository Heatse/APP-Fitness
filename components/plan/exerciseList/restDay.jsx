import React from 'react'
import { Dimensions, StyleSheet, Text, View } from 'react-native'
import { COLORS, FONT, SIZES } from '../../../constants/theme'

const RestDay = () => {
    return (
        <View style={styles.container}>
            <View style={styles.overlay}>
                <Text style={styles.textTitel}>REST DAY</Text>
                <Text style={styles.textDesc}>You are training very well, take a day off to let{'\n'} your body recover.</Text>
                <Text style={styles.text}>Press to started to finish</Text>
            </View>
        </View>
    )
}

export default RestDay

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: COLORS.bgColor,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        paddingVertical: 16,
        paddingBottom: 60,
    },
    overlay: {
        marginBottom: 20,
        backgroundColor: COLORS.white,
        alignItems: 'center',
        width: '90%',
        paddingVertical: 16,
        borderRadius: 12,
    },

    textTitel: {
        color: '#2563EB',
        fontSize: 24,
        fontFamily: FONT.bold,
        top: -6,
        lineHeight: 32,
    },

    textDesc: {
        textAlign: 'center',
        color: COLORS.text,
        fontSize: 14,
        fontFamily: FONT.regular,
        paddingBottom: 20,
    },
    text: {
        color: '#BDBDBD',
        fontSize: 10,
        bottom: -6,
        fontFamily: FONT.regular,
        lineHeight: 18,
    }
})