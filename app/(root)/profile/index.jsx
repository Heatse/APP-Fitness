import {
    Image,
    ImageBackground,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import IconTwo from 'react-native-vector-icons/MaterialCommunityIcons'
import IconThree from 'react-native-vector-icons/Feather'
import IconFour from 'react-native-vector-icons/MaterialIcons'
import ArrowRightIcon from '../../../components/icons/ArrowRight'
import { StyleSheet } from 'react-native'
import { COLORS, FONT, SIZES } from '../../../constants/theme'
import Blur from '../../../components/common/blur'
import AdvertiseMentFour from '../../../components/advertisement/AdvertisementFour'
import { router, useFocusEffect } from 'expo-router'
import useUserQueries from '../../database/tables/user'
import { useCallback, useState } from 'react'
import { viewImageAvatar } from '../../../components/profile/edit/AvatarSelector'

const Profile = () => {
    const { getUser } = useUserQueries()
    const [user, setUser] = useState()

    useFocusEffect(
        useCallback(() => {
            getUser().then((res) => {
                if (!res) {
                    return
                }
                setUser(res[0])
            })
        }, [])
    )

    const handleRouter = (url) => {
        router.push(url)
    }

    if (!user) {
        return
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView style={styles.container}>
                <ImageBackground
                    source={viewImageAvatar(user.avatar)}
                    style={styles.bg}
                >
                    <View style={styles.wrapAva}>
                        <Image
                            source={viewImageAvatar(user.avatar)}
                            style={styles.profileAvt}
                        />
                        <Text style={styles.name}>{user.name}</Text>
                    </View>
                    <Blur style={styles.blurWrap} />
                </ImageBackground>

                <View style={styles.card}>
                    <Text style={styles.cardName}>Settings</Text>
                    <View style={styles.cardList}>
                        {settingList.map((item, index) => (
                            <TouchableOpacity
                                onPress={() => handleRouter(item.url)}
                                style={[
                                    styles.cardItem,
                                    index < settingList.length - 1 && {
                                        boxShadow:
                                            '0px 0px 1px 0px rgba(0, 0, 0, 0.10)',
                                    },
                                ]}
                                key={index}
                            >
                                <View style={styles.itemLeft}>
                                    {item.icon}
                                    <Text style={styles.itemName}>
                                        {item.name}
                                    </Text>
                                </View>
                                <ArrowRightIcon style={styles.arrowRightIcon} />
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View style={[styles.card, { marginTop: 16 }]}>
                    <Text style={styles.cardName}>We Love Feedback!</Text>
                    <View style={styles.cardList}>
                        <View style={styles.cardItem}>
                            <View style={styles.itemLeft}>
                                <Icon name="star" size={24} color="#8C9093" />
                                <Text style={styles.itemName}>
                                    Rate the App
                                </Text>
                            </View>
                            <ArrowRightIcon style={styles.arrowRightIcon} />
                        </View>
                        <View style={styles.cardItem}>
                            <View style={styles.itemLeft}>
                                <IconFour
                                    name="chat-bubble-outline"
                                    size={24}
                                    color="#8C9093"
                                />
                                <View style={styles.info}>
                                    <Text style={styles.itemName}>
                                        Send Feedback
                                    </Text>
                                    <Text style={styles.itemEx}>
                                        What can we imporve?
                                    </Text>
                                </View>
                            </View>
                            <ArrowRightIcon style={styles.arrowRightIcon} />
                        </View>
                    </View>
                </View>

                <TouchableOpacity
                    onPress={() => {
                        router.push('profile/term')
                    }}
                    style={styles.footer}
                >
                    <Text style={styles.footerText}>
                        Terms of Service, Privacy Policy, Contact
                    </Text>
                    <Text style={styles.footerText}>Version: 1.1.1</Text>
                </TouchableOpacity>
            </ScrollView>
            <AdvertiseMentFour style={styles.advertise4} />
        </SafeAreaView>
    )
}

export default Profile

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: {
        backgroundColor: COLORS.bgColor,
        flex: 1,
    },
    bg: {
        width: '100%',
        aspectRatio: 1.46484375,
        position: 'relative',
    },
    wrapAva: {
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'absolute',
        top: '32.03125%',
        zIndex: 1,
    },
    profileAvt: {
        width: 100,
        height: 100,
        borderRadius: 1000,
    },
    name: {
        fontSize: 32,
        fontFamily: FONT.bold,
        color: COLORS.primaryDark,
        textAlign: 'center',
    },
    blurWrap: {
        position: 'absolute',
        bottom: 0,
    },
    card: {
        paddingHorizontal: 16,
    },
    cardName: {
        fontSize: SIZES.medium,
        fontFamily: FONT.bold,
        color: '#8C9093',
        marginBottom: 8,
    },
    cardList: {
        backgroundColor: COLORS.white,
        borderRadius: 12,
        flexDirection: 'column',
    },
    cardItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
    },
    itemLeft: {
        flexDirection: 'row',
        gap: 16,
        alignItems: 'center',
    },
    itemName: {
        fontSize: SIZES.medium,
        fontFamily: FONT.bold,
        color: COLORS.text,
    },
    itemEx: {
        fontSize: SIZES.smallX,
        fontFamily: FONT.regular,
        color: COLORS.text,
    },
    footer: {
        marginTop: 16,
        flexDirection: 'column',
        gap: 8,
    },
    footerText: {
        opacity: 0.5,
        fontSize: SIZES.medium,
        color: COLORS.text,
        fontFamily: FONT.regular,
        textAlign: 'center',
        opacity: 0.5,
        textDecorationLine: 'underline',
    },
    advertise4: {
        position: 'absolute',
        bottom: 64,
        left: 0,
        right: 0,
    },
})

const settingList = [
    {
        name: 'Edit Profile',
        icon: <Icon name="pencil" size={24} color="#8C9093" />,
        url: 'profile/edit',
    },
    {
        name: 'Manager Plan',
        icon: <IconTwo name="folder-edit-outline" size={24} color="#8C9093" />,
        url: 'profile/managerPlan',
    },
    // {
    //     name: 'Sound',
    //     icon: <IconThree name="volume-2" size={24} color="#8C9093" />,
    //     url: 'profile/sound',
    // },
    // {
    //     name: 'Reminders',
    //     icon: <IconFour name="notifications" size={24} color="#8C9093" />,
    //     url: 'profile/reminder',
    // },
]
