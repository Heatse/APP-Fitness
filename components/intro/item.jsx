import React from 'react'
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native'
import { COLORS, FONT, SIZES } from '../../constants/theme'

const ItemIntro = ({ item }) => {
    return (
        <View style={styles.item}>
            <Image source={item.url} style={styles.image1} />
            <Text style={styles.text}>{item.text}</Text>
            <Text style={styles.text1}>{item.text1}</Text>
        </View>
    )
}

export default ItemIntro

const styles = StyleSheet.create({
    item: {
        width: Dimensions.get('screen').width * 0.88,
        marginHorizontal: 10,
        alignItems: 'center',
    },
    image1: {
        width: '100%',
        height: 'auto',
        aspectRatio: 1.12459016393,
        borderRadius: 20,
        marginBottom: 10,
    },
    text: {
        fontSize: SIZES.largeX,
        fontFamily: FONT.bold,
        color: COLORS.text,
        textAlign: 'center',
        marginBottom: 5,
    },
    text1: {
        fontSize: SIZES.mediumX,
        fontFamily: FONT.regular,
        color: COLORS.text,
        textAlign: 'center',
        paddingHorizontal: 30,
    },
})
