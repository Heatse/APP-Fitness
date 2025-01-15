import React, { useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { COLORS, FONT } from '../../../../constants/theme'
import Icon from 'react-native-vector-icons/AntDesign'
import { router } from 'expo-router'
import ActivePlan from '../../../../components/profile/managerPlan/ActivePlan'
import DonePlan from '../../../../components/profile/managerPlan/DonePlan'

const ManagerPlan = () => {
    const [activeButton, setActiveButton] = useState('Active')

    const handleButtonPress = (buttonName) => {
        setActiveButton(buttonName)
    }

    return (
        <SafeAreaView style={styles.safeView}>
            <View style={styles.stack}>
                <TouchableOpacity
                    style={{
                        padding: 16,
                    }}
                    onPress={() => router.back()}
                >
                    <Icon name="arrowleft" size={24} color="black" />
                </TouchableOpacity>
                <View
                    style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        transform: [{ translateX: -20 }],
                    }}
                >
                    <Text style={styles.title}>Manager Plan</Text>
                </View>
            </View>

            <View style={styles.btn}>
                <TouchableOpacity
                    style={[
                        styles.btnSelect,
                        activeButton === 'Active' && styles.selectedBtn,
                    ]}
                    onPress={() => handleButtonPress('Active')}
                >
                    <Text
                        style={[
                            styles.btnText,
                            activeButton === 'Active' && styles.selectedText,
                        ]}
                    >
                        Active
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.btnSelect,
                        activeButton === 'Done' && styles.selectedBtn,
                    ]}
                    onPress={() => handleButtonPress('Done')}
                >
                    <Text
                        style={[
                            styles.btnText,
                            activeButton === 'Done' && styles.selectedText,
                        ]}
                    >
                        Done
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                {activeButton === 'Active' ? <ActivePlan /> : <DonePlan />}
            </View>
        </SafeAreaView>
    )
}

// Component Active
const ActiveComponent = () => (
    <View style={styles.activeContainer}>
        <Text style={styles.contentText}>This is the Active Plan</Text>
    </View>
)

// Component Done
const DoneComponent = () => (
    <View style={styles.doneContainer}>
        <Text style={styles.contentText}>This is the Done Plan</Text>
    </View>
)

export default ManagerPlan

const styles = StyleSheet.create({
    safeView: {
        flex: 1,
    },
    stack: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginTop: 8,
    },
    title: {
        fontSize: 24,
        fontFamily: FONT.bold,
        color: COLORS.text,
        marginLeft: 16,
    },
    btn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: 16,
        gap: 8,
    },
    btnSelect: {
        paddingVertical: 10,
        paddingHorizontal: 56,
        borderRadius: 12,
        backgroundColor: COLORS.white,
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    btnText: {
        color: COLORS.text,
        fontSize: 14,
        fontFamily: FONT.bold,
    },
    selectedBtn: {
        backgroundColor: COLORS.primaryDark,
    },
    selectedText: {
        color: COLORS.white,
    },
    content: {
        marginTop: 10,
        paddingHorizontal: 16,
        paddingBottom: 150,
    },
    activeContainer: {
        padding: 20,
        backgroundColor: COLORS.lightGray,
        borderRadius: 10,
    },
    doneContainer: {
        padding: 20,
        backgroundColor: COLORS.lightGray,
        borderRadius: 10,
    },
    contentText: {
        fontSize: 16,
        fontFamily: FONT.regular,
        color: COLORS.text,
    },
})
