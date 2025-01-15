import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { COLORS, FONT, SIZES } from '../constants/theme'
import PropTypes from 'prop-types'

const Pagination = ({ data, activeIndex, style, onNext, onStart }) => {
    return (
        <View style={[styles.contain, style]}>
            <View style={styles.pagination}>
                {data.map((_item, index) => (
                    <View
                        key={index}
                        style={[
                            styles.circle,
                            index === activeIndex ? styles.activeCircle : null,
                        ]}
                    />
                ))}
            </View>
            <TouchableOpacity
                style={styles.btnNext}
                onPress={activeIndex === data.length - 1 ? onStart : onNext}
            >
                <Text style={styles.textBtn}>
                    {activeIndex === data.length - 1 ? 'Start' : 'Next'}
                </Text>
            </TouchableOpacity>
        </View>
    )
}

Pagination.propTypes = {
    data: PropTypes.array.isRequired,
    activeIndex: PropTypes.number.isRequired,
    style: PropTypes.object,
    onNext: PropTypes.func.isRequired,
    onStart: PropTypes.func.isRequired,
}

export default Pagination

const styles = StyleSheet.create({
    contain: {
        marginTop: 28,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
    },
    pagination: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    circle: {
        borderRadius: 50,
        backgroundColor: COLORS.gray,
        width: 11,
        height: 11,
        marginHorizontal: 5,
    },
    activeCircle: {
        backgroundColor: COLORS.primaryDark,
        width: 25,
    },
    btnNext: {
        paddingHorizontal: 20,
    },
    textBtn: {
        color: COLORS.text,
        fontSize: SIZES.medium,
        fontFamily: FONT.regular,
    },
})
