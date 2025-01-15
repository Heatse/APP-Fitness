import React, { useState } from 'react'
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { COLORS, FONT } from '../../../constants/theme'
import Icon from 'react-native-vector-icons/AntDesign'
import WheelPickerExpo from 'react-native-wheel-picker-expo'

const ModalPickerTime = ({
    isVisible,
    time,
    onCloseModal,
    handleChangeUserSettings,
}) => {
    const [selectedHour, setSelectedHour] = useState(time.hour)
    const [selectedMinute, setSelectedMinute] = useState(time.minute)
    const [selectedPeriod, setSelectedPeriod] = useState(time.period)

    const hours = Array.from({ length: 12 }, (_, i) =>
        (i + 1).toString().padStart(2, '0')
    ) // 01-12
    const minutes = Array.from({ length: 60 }, (_, i) =>
        i.toString().padStart(2, '0')
    ) // 00-59
    const periods = ['AM', 'PM'] // AM or PM

    const handleSave = () => {
        // Save the selected time
        const updatedTime = {
            hour: parseInt(selectedHour),
            minute: parseInt(selectedMinute),
            period: selectedPeriod,
        }
        handleChangeUserSettings('time', updatedTime)
        onCloseModal()
    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={onCloseModal}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Select Time</Text>
                        <TouchableOpacity
                            style={styles.btnClose}
                            onPress={onCloseModal}
                        >
                            <Icon name="close" size={16} color={COLORS.text} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.pickerWrap}>
                        {/* Hour Wheel Picker */}
                        <WheelPickerExpo
                            height={200}
                            width={100}
                            initialSelectedIndex={hours.indexOf(selectedHour)}
                            items={hours.map((hour) => ({
                                label: hour,
                                value: hour,
                            }))}
                            onChange={({ item }) => setSelectedHour(item.label)}
                        />

                        {/* Separator */}
                        <Text style={styles.separator}>:</Text>

                        {/* Minute Wheel Picker */}
                        <WheelPickerExpo
                            height={200}
                            width={100}
                            initialSelectedIndex={minutes.indexOf(
                                selectedMinute
                            )}
                            items={minutes.map((minute) => ({
                                label: minute,
                                value: minute,
                            }))}
                            onChange={({ item }) =>
                                setSelectedMinute(item.label)
                            }
                        />

                        {/* Period Wheel Picker */}
                        <WheelPickerExpo
                            height={200}
                            width={100}
                            initialSelectedIndex={periods.indexOf(
                                selectedPeriod
                            )}
                            items={periods.map((period) => ({
                                label: period,
                                value: period,
                            }))}
                            onChange={({ item }) =>
                                setSelectedPeriod(item.label)
                            }
                        />
                    </View>

                    <Text style={styles.instructionText}>
                        Tap to change your time notify.
                    </Text>
                    <TouchableOpacity
                        style={styles.btnSave}
                        onPress={handleSave}
                    >
                        <Text style={styles.btnSaveText}>Save</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}

export default ModalPickerTime

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '100%',
        height: '50%',
        backgroundColor: 'white',
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        padding: 20,
        position: 'absolute',
        bottom: 0,
        paddingHorizontal: 16,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    modalTitle: {
        fontSize: 20,
        fontFamily: FONT.bold,
        color: COLORS.text,
    },
    btnClose: {
        width: 24,
        height: 24,
        borderRadius: 50,
        backgroundColor: COLORS.bgColor,
        alignItems: 'center',
        justifyContent: 'center',
    },
    pickerWrap: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    separator: {
        fontSize: 24,
        fontFamily: FONT.bold,
        color: COLORS.text,
        marginHorizontal: 10,
    },
    instructionText: {
        fontSize: 14,
        fontFamily: FONT.regular,
        color: '#8C9093',
        textAlign: 'center',
        marginVertical: 16,
    },
    btnSave: {
        padding: 10,
        width: '100%',
        borderRadius: 1000,
        backgroundColor: COLORS.text,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnSaveText: {
        color: COLORS.white,
        fontSize: 16,
        fontFamily: FONT.bold,
    },
})
