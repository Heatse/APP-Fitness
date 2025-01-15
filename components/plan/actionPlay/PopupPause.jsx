import React from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
} from 'react-native';
import { COLORS, FONT } from '../../../constants/theme';
import Icon from 'react-native-vector-icons/AntDesign';
import { router } from 'expo-router';

const PopupPause = ({ visible, onContinue, onRestart, onLeave, onStartOver }) => {
    return (
        <Modal transparent={true} visible={visible} animationType="slide">
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <TouchableOpacity style={styles.btnPrev} onPress={onContinue}>
                        <Icon name="arrowleft" size={24} color="white" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Pause</Text>
                    <View style={styles.header}>
                        <Text style={styles.subTitle}>Russian Twists</Text>
                        <TouchableOpacity style={styles.infoButton}>
                            <Icon name="questioncircle" size={24} color="gray" />
                        </TouchableOpacity>
                    </View>
                    <Image style={styles.imageoverplay} />

                    <TouchableOpacity style={styles.actionButton} onPress={onRestart}>
                        <Text style={styles.buttonText}>Restart Exercise</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton} onPress={onLeave}>
                        <Text style={styles.buttonText}>Leave</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton} onPress={onStartOver}>
                        <Text style={styles.buttonText}>Start Over</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.continueButton} onPress={onContinue}>
                        <Text style={styles.continueText}>Continue</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default PopupPause;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: '#038700',
        borderRadius: 10,
        paddingHorizontal: 20,
        paddingTop: 80,
        alignItems: 'flex-start',
    },
    btnPrev: {
        position: 'absolute',
        top: 56,
        left: 16,
    },
    title: {
        fontSize: 40,
        fontFamily: FONT.bold,
        color: COLORS.white,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 40,
    },
    subTitle: {
        fontSize: 16,
        fontFamily: FONT.bold,
        color: COLORS.white,
        marginBottom: 20,
    },
    infoButton: {
        position: "relative",
        left: 10
    },

    imageoverplay: {
        width: '30%',
        height: '16%',
        resizeMode: 'contain',
        position: 'absolute',
        top: '12%',
        right: 20,
        backgroundColor: '#D9D9D9',
    },

    actionButton: {
        backgroundColor: COLORS.white,
        paddingVertical: 20,
        paddingHorizontal: 10,
        borderRadius: 12,
        width: '100%',
        marginBottom: 10,
        alignItems: 'flex-start',
    },
    buttonText: {
        fontSize: 14,
        fontFamily: FONT.bold,
        color: COLORS.text,
    },
    continueButton: {
        backgroundColor: '#4AC947',
        padding: 20,
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
        marginTop: 20,
    },
    continueText: {
        fontSize: 14,
        fontFamily: FONT.bold,
        color: COLORS.white,
    },
});
