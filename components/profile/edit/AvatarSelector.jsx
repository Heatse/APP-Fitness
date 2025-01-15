import {
    FlatList,
    Image,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'
import image from '../../../constants/image'
import { COLORS, FONT, SIZES } from '../../../constants/theme'
import useUserQueries from '../../../app/database/tables/user'

const AvatarSelector = ({ avatar, visible, handleEditUser, onCloseModal }) => {
    const { updateUserInfo } = useUserQueries()

    const handleChangeAvatar = async (avatar) => {
        handleEditUser('avatar', avatar)
        try {
            const res = await updateUserInfo({ avatar })
        } catch (error) {
            //Toaster
            console.error('Error fetching updateUser: ', error)
            throw error
        }
        onCloseModal()
    }

    return (
        <Modal visible={visible} transparent animationType="slide">
            <View style={styles.modalContainer}>
                <View>
                    <FlatList
                        data={avatars}
                        horizontal
                        renderItem={({ index, item }) => (
                            <TouchableOpacity
                                onPress={() => handleChangeAvatar(index)}
                                style={{ height: 100 }}
                            >
                                <Image
                                    source={item}
                                    style={[
                                        styles.modalAvatarImage,
                                        index === avatar &&
                                        styles.activeAvatarImage,
                                    ]}
                                />
                            </TouchableOpacity>
                        )}
                        keyExtractor={(_item, index) => index.toString()}
                        style={{ height: 100, marginBottom: 12 }}
                        showsHorizontalScrollIndicator={false}
                    />
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                    <TouchableOpacity
                        style={styles.buttonCancle}
                        onPress={() => onCloseModal()}
                    >
                        <Text style={styles.textCancle}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}

export default AvatarSelector

const styles = StyleSheet.create({
    avatarContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    avatarImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        paddingHorizontal: 16,
        paddingVertical: 20,
    },
    modalAvatarImage: {
        width: 80,
        height: 80,
        borderRadius: 16,
        marginHorizontal: 10,
        backgroundColor: 'white',
    },
    buttonCancle: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 12,
        width: '100%',
        alignItems: 'center',
        shadowColor: 'rgba(0, 0, 0, 0.10)', // iOS
        shadowOffset: { width: 0, height: 0 }, // iOS
        shadowOpacity: 0.1, // iOS
        shadowRadius: 4, // iOS
        elevation: 4, // Android
    },
    textCancle: {
        fontSize: SIZES.medium,
        color: COLORS.extradark,
        fontFamily: FONT.bold,
    },
    activeAvatarImage: {
        borderWidth: 3,
        borderColor: COLORS.primary,
        backgroundColor: COLORS.lightGray,
    },
})

export const avatars = [
    image.ava1,
    image.ava2,
    image.ava3,
    image.ava4,
    image.ava5,
    image.ava6,
    image.ava7,
]

export function viewImageAvatar(number) {
    if (number >= 0 && number < avatars.length) {
        return avatars[number]
    } else {
        console.warn('Invalid avatar number. Returning default avatar.')
        return image.ava1
    }
}
