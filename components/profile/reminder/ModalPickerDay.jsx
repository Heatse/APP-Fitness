import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { COLORS, FONT } from '../../../constants/theme'
import Icon from 'react-native-vector-icons/AntDesign'

const ModalPickerDays = ({
    isVisible,
    days,
    onCloseModal,
    handleChangeUserSettings,
}) => {
    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

    const handleSelectDay = (day) => {
        let newDays = [...days]
        if (newDays.includes(day)) {
            newDays = newDays.filter((item) => item !== day)
        } else {
            newDays.push(day)
        }
        handleChangeUserSettings('days', newDays)
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
                        <Text
                            style={{
                                fontSize: 20,
                                fontFamily: FONT.bold,
                                color: COLORS.text,
                            }}
                        >
                            Training Days
                        </Text>
                        <TouchableOpacity
                            style={styles.btnClose}
                            onPress={onCloseModal}
                        >
                            <Icon name="close" size={16} color={COLORS.text} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.pickerWrap}>
                        {daysOfWeek.map((day) => (
                            <TouchableOpacity
                                key={day}
                                style={[
                                    styles.dayButton,
                                    days.includes(day)
                                        ? styles.dayButtonSelected
                                        : null,
                                ]}
                                onPress={() => handleSelectDay(day)}
                            >
                                <Text
                                    style={[
                                        styles.dayText,
                                        days.includes(day)
                                            ? styles.dayTextSelected
                                            : null,
                                    ]}
                                >
                                    {day}
                                </Text>
                                {days.includes(day) && (
                                    <Icon
                                        name="checkcircle"
                                        size={24}
                                        color={COLORS.primaryDark}
                                        style={styles.checkIcon}
                                    />
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Text
                        style={{
                            fontSize: 14,
                            fontFamily: FONT.regular,
                            color: '#8C9093',
                            textAlign: 'center',
                            marginVertical: 16,
                        }}
                    >
                        Tap to change your selected days.
                    </Text>
                    <TouchableOpacity style={styles.btnSave}>
                        <Text
                            style={{
                                color: COLORS.white,
                                textAlign: 'center',
                                fontSize: 16,
                                fontFamily: FONT.bold,
                            }}
                        >
                            Save
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}

export default ModalPickerDays

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        position: 'relative',
    },
    modalContent: {
        width: '100%',
        height: '40%',
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
        marginBottom: 24,
    },
    btnClose: {
        width: 24,
        height: 24,
        borderRadius: 50,
        backgroundColor: COLORS.bgColor,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 4,
    },
    btnSave: {
        padding: 10,
        width: '100%',
        borderRadius: 1000,
        backgroundColor: COLORS.text,
        height: 44,
    },

    checkIcon: {
        position: 'absolute',
        top: -10,
        right: -10,
        zIndex: 3,
        backgroundColor: COLORS.white,
    },
    pickerWrap: {
        flexWrap: 'wrap',
        gap: 15,
        justifyContent: 'center',
        flexDirection: 'row',
    },
    dayButton: {
        width: '18.658892128%',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        backgroundColor: COLORS.bgColor,
    },
    dayButtonSelected: {
        borderColor: COLORS.primaryDark,
        borderWidth: 2,
        backgroundColor: COLORS.white,
    },
    dayText: {
        fontSize: 16,
        fontFamily: FONT.bold,
        color: COLORS.text,
    },
    dayTextSelected: {
        fontFamily: FONT.bold,
        color: COLORS.primaryDark,
    },
})
