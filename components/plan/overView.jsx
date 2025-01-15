import React, { useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, FONT, SIZES } from '../../constants/theme';

const OverView = ({ item }) => {
    const [showImages, setShowImages] = useState(false);

    const toggleImages = () => {
        setShowImages(!showImages);
    };

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <View style={styles.header}>
                    <Text style={styles.weekText}>{item?.week}</Text>
                    <TouchableOpacity onPress={toggleImages}>
                        <MaterialIcons
                            name={showImages ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                            size={24}
                            color="black"
                        />
                    </TouchableOpacity>
                </View>
                <View style={styles.body}>
                    <View style={styles.iconTitle}>
                        <Image source={item?.icon} style={styles.icon} />
                        <Text style={styles.title}>{item?.title}</Text>
                    </View>
                    <Text style={styles.description}>
                        {item?.description || 'No description available'}
                    </Text>
                </View>
                {showImages && (
                    <View style={styles.imageContainer}>
                        <Image source={{
                            uri: `https://drive.google.com/thumbnail?id=${item?.image1}&sz=w1000`,
                        }} style={styles.image} />
                        <Image source={{
                            uri: `https://drive.google.com/thumbnail?id=${item?.image2}&sz=w1000`,
                        }} style={styles.image} />
                        <Image source={{
                            uri: `https://drive.google.com/thumbnail?id=${item?.image3}&sz=w1000`,
                        }} style={styles.image} />
                    </View>
                )}
            </View>
        </View>
    );
};

export default OverView;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 10,
    },
    card: {
        width: '100%',
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 15,
        elevation: 3,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    weekText: {
        fontSize: SIZES.smallX,
        fontFamily: FONT.regular,
        color: COLORS.text,
        backgroundColor: COLORS.gray,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
        overflow: 'hidden',
    },
    body: {
        marginTop: 5,
    },
    iconTitle: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    icon: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
    },
    title: {
        fontSize: SIZES.smallX,
        fontFamily: FONT.bold,
        color: COLORS.text,
        marginLeft: 5,
    },
    description: {
        fontSize: SIZES.smallX,
        fontFamily: FONT.regular,
        color: COLORS.text,
        opacity: 0.5
    },
    imageContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    image: {
        width: '30%',
        aspectRatio: 1.2,
        borderRadius: 12,
    },
});
