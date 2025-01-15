import React, { useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, FONT, SIZES } from '../../constants/theme';
import icon from '../../constants/icon';

const AboutPlan = ({ item }) => {
    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <View style={styles.header}>
                    <Image source={item?.icon} style={styles.icon} />
                </View>
                <View style={styles.body}>
                    <View style={styles.textTitle}>
                        <Text style={styles.title}>{item?.text1}</Text>
                    </View>
                    <View style={styles.textTitle}>
                        <Text style={styles.title}>{item?.text2}</Text>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default AboutPlan


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        paddingRight: 16,
    },
    card: {
        minWidth: 124,
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 15,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    icon: {
        width: 28,
        height: 28,
        resizeMode: 'contain',
        backgroundColor: COLORS.gray,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 4,
    },
    body: {
        marginTop: 15,
    },
    textTitle: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        fontSize: SIZES.smallX,
        fontFamily: FONT.bold,
        color: COLORS.text,
        lineHeight: 20
    },
});