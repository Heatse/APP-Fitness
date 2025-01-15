import React, { useEffect, useState } from 'react'
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import PrevIcon from '../../../../components/icons/PrevIcon'
import { COLORS, FONT } from '../../../../constants/theme'
import AdvertiseMentFour from '../../../../components/advertisement/AdvertisementFour'
import ChangeGender from '../../../../components/profile/edit/ChangeGender'
import ChangeWeight from '../../../../components/profile/edit/ChangeWeight'
import ChangeHeight, {
    cmToFtIn,
} from '../../../../components/profile/edit/ChangeHeight'
import ChangeUnits, {
    convertWeight,
} from '../../../../components/profile/edit/ChangeUnits'
import ChangeName from '../../../../components/profile/edit/ChangeName'
import AvatarSelector, {
    viewImageAvatar,
} from '../../../../components/profile/edit/AvatarSelector'
import useUserQueries from '../../../database/tables/user'
import ChangeAge from '../../../../components/profile/edit/ChangeAge'

const EditProfile = () => {
    const [user, setUser] = useState()
    const [visibleModal, setVisibleModal] = useState(null)

    const { getUser } = useUserQueries()

    useEffect(() => {
        getUser().then((res) => {
            if (!res) {
                return
            }
            setUser(res[0])
        })
    }, [])

    const handleOpenModal = (key) => {
        setVisibleModal(key)
    }

    const handleEditUser = async (key, value) => {
        setUser({ ...user, [key]: value })
    }

    const onCloseModal = () => {
        setVisibleModal(null)
    }

    if (!user) {
        return
    }

    console.log(user.height, 'HEHEHEHE')

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.safeView}>
                {/* Header */}
                <View style={styles.stack}>
                    <TouchableOpacity
                        style={{ marginLeft: 16, width: 40, height: 40 }}
                        onPress={() => {
                            router.back()
                        }}
                    >
                        <PrevIcon style={{ width: 40, height: 40 }} />
                    </TouchableOpacity>
                    <View
                        style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                            transform: [{ translateX: -20 }],
                        }}
                    >
                        <Text style={styles.title}>Edit Profile</Text>
                    </View>
                </View>

                {/* Edit Ava */}
                <View style={{ width: '100%', alignItems: 'center' }}>
                    <View style={styles.wrapAva}>
                        <Image
                            source={viewImageAvatar(user.avatar)}
                            style={styles.profileAvt}
                        />
                        <TouchableOpacity
                            style={styles.wrapIcon}
                            onPress={() => handleOpenModal('avatar')}
                        >
                            <Icon name="edit" size={24} color="#000" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* router other page */}
                <View style={styles.cardList}>
                    <TouchableOpacity
                        style={styles.cardItem}
                        onPress={() => handleOpenModal('name')}
                    >
                        <Text style={styles.itemTitle}>Name</Text>
                        <Text style={styles.itemNumber}>{user.name}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.cardItem}
                        onPress={() => handleOpenModal('gender')}
                    >
                        <Text style={styles.itemTitle}>Gender</Text>
                        <Text style={styles.itemNumber}>{user.gender}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.cardItem}
                        onPress={() => handleOpenModal('birthday')}
                    >
                        <Text style={styles.itemTitle}>Age</Text>
                        <Text style={styles.itemNumber}>{user.age}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.cardItem}
                        onPress={() => handleOpenModal('units')}
                    >
                        <Text style={styles.itemTitle}>Units</Text>
                        <Text style={styles.itemNumber}>{user.units}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.cardItem}
                        onPress={() => handleOpenModal('height')}
                    >
                        <Text style={styles.itemTitle}>Height</Text>
                        <Text style={styles.itemNumber}>
                            {user.units !== 'ft & in/lbs'
                                ? `${Math.round(user.height)} cm`
                                : `${Math.round(
                                      cmToFtIn(user.height).feet
                                  )} ft ${Math.round(
                                      cmToFtIn(user.height).inches
                                  )} in`}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.cardItem}
                        onPress={() => handleOpenModal('weight')}
                    >
                        <Text style={styles.itemTitle}>Weight</Text>
                        <Text style={styles.itemNumber}>
                            {user.units === 'ft & in/lbs'
                                ? convertWeight(user.weight, 'kg')
                                : user.weight}{' '}
                            {user.units === 'ft & in/lbs' ? 'lbs' : 'kg'}
                        </Text>
                    </TouchableOpacity>
                </View>

                <AdvertiseMentFour style={styles.advertise4} />

                {/* Modal Components */}
                <ChangeAge
                    visible={visibleModal === 'birthday'}
                    handleEditUser={handleEditUser}
                    onCloseModal={onCloseModal}
                    age={user.age}
                />
                <ChangeGender
                    visible={visibleModal === 'gender'}
                    handleEditUser={handleEditUser}
                    onCloseModal={onCloseModal}
                    gender={user.gender}
                />
                <AvatarSelector
                    visible={visibleModal === 'avatar'}
                    handleEditUser={handleEditUser}
                    onCloseModal={onCloseModal}
                    avatar={user.avatar}
                />
                <ChangeWeight
                    visible={visibleModal === 'weight'}
                    handleEditUser={handleEditUser}
                    onCloseModal={onCloseModal}
                    weight={user.weight}
                    units={user.units === 'ft & in/lbs' ? 'lbs' : 'kg'}
                />
                <ChangeHeight
                    visible={visibleModal === 'height'}
                    handleEditUser={handleEditUser}
                    onCloseModal={onCloseModal}
                    height={user.height}
                    units={user.units === 'ft & in/lbs' ? 'ft & in' : 'cm'}
                />
                <ChangeUnits
                    visible={visibleModal === 'units'}
                    handleEditUser={handleEditUser}
                    onCloseModal={onCloseModal}
                    units={user.units}
                />
                <ChangeName
                    visible={visibleModal === 'name'}
                    handleEditUser={handleEditUser}
                    onCloseModal={onCloseModal}
                    name={user.name}
                />
            </ScrollView>
        </SafeAreaView>
    )
}

export default EditProfile

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeView: {
        flex: 1,
        backgroundColor: COLORS.bgColor,
        flexDirection: 'column',
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
    cardList: {
        backgroundColor: COLORS.white,
        borderRadius: 12,
        flexDirection: 'column',
        marginTop: 16,
        marginHorizontal: 16,
    },
    cardItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
    },
    advertise4: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    wrapAva: {
        width: 100,
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
    },
    itemTitle: {
        fontSize: 14,
        fontFamily: FONT.bold,
        color: COLORS.text,
    },
    itemNumber: {
        fontSize: 14,
        fontFamily: FONT.regular,
        color: COLORS.text,
    },
    wrapIcon: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: COLORS.white,
        borderRadius: 100,
        padding: 5,
    },
    profileAvt: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
})
