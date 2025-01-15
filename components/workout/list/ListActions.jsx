import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { COLORS, FONT, SIZES } from '../../../constants/theme'
import ArrowRightIcon from '../../icons/ArrowRight'
import { useRouter } from 'expo-router'

const ListActions = ({ list }) => {
    const { listAction, name } = list
    const router = useRouter()
    const handleOnPress = (id) => {
        router.push(`/workout/detail/${id}`)
    }

    return (
        <View style={styles.list}>
            <Text style={styles.groupName}>{name}</Text>
            <View style={styles.listAction}>
                {listAction?.map((item, index) => {
                    return (
                        <TouchableOpacity
                            key={item.id}
                            style={[
                                styles.item,
                                index !== listAction.length - 1 && {
                                    borderBottomColor:
                                        'rgba(207, 207, 207, 0.1)',
                                    borderBottomWidth: 1,
                                },
                            ]}
                            onPress={() => handleOnPress(item.id)}
                        >
                            <Image
                                style={styles.image}
                                source={{
                                    uri: `https://drive.google.com/thumbnail?id=${item.image_url}&sz=w1000`,
                                }}
                            />
                            <View style={styles.wrapContentItem}>
                                <Text style={styles.text}>{item.ex_name}</Text>
                                <ArrowRightIcon />
                            </View>
                        </TouchableOpacity>
                    )
                })}
            </View>
        </View>
    )
}

export default ListActions

const styles = StyleSheet.create({
    list: {
        width: '100%',
    },
    groupName: {
        fontSize: SIZES.large,
        fontFamily: FONT.bold,
        marginBottom: 8,
    },
    listAction: {
        backgroundColor: COLORS.white,
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 10,
    },
    item: {
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    image: {
        width: 64,
        height: 64,
        aspectRatio: 1,
    },
    wrapContentItem: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        justifyContent: 'space-between',
    },
    text: {
        fontSize: SIZES.medium,
        fontFamily: FONT.bold,
        color: COLORS.text,
    },
})
