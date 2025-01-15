import React, { useEffect, useState } from 'react'
import {
    ActivityIndicator,
    Dimensions,
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'
import Icon from 'react-native-vector-icons/Entypo'
import * as Progress from 'react-native-progress'
import { SwipeListView } from 'react-native-swipe-list-view'
import { COLORS, FONT, SIZES } from '../../../constants/theme'
import usePlanQueries from '../../../app/database/tables/plan'
import { router } from 'expo-router'

const ActivePlan = () => {
    const { getListPlansActive, deleteUserPlan } = usePlanQueries()
    const [data, setData] = useState([])
    const [reload, setReload] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [modalVisible, setModalVisible] = useState(false)
    const [planNameToDelete, setPlanNameToDelete] = useState('')

    useEffect(() => {
        const fetchPlans = async () => {
            setIsLoading(true)
            try {
                const res = await getListPlansActive()

                if (Array.isArray(res)) {
                    if (res.length > 0) {
                        setData(res)
                    } else {
                        setData([])
                    }
                } else {
                    setData([])
                    console.error(
                        'Error getting plans: Expected an array but got:',
                        res
                    )
                }
            } catch (err) {
                console.error('Error fetching plans:', err)
            } finally {
                setIsLoading(false)
            }
        }

        fetchPlans()
    }, [reload])

    const showDeleteModal = (planName) => {
        setPlanNameToDelete(planName)
        setModalVisible(true)
    }

    const handleDeletePlan = async () => {
        try {
            const result = await deleteUserPlan(planNameToDelete)
            console.log('Plan deleted successfully!')
            setReload(!reload)
        } catch (error) {
            console.error('Error deleting user plan:', error)
        } finally {
            setModalVisible(false)
            setPlanNameToDelete('')
        }
    }

    if (isLoading) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        )
    }

    const renderItem = ({ item }) => {
        const {
            day_number,
            week_number,
            plan_name,
            duration_weeks,
            plan_id,
            image_url,
        } = item

        const totalDays = duration_weeks * 7
        let completedDays

        if (week_number > 1) {
            completedDays = (week_number - 1) * 7 + day_number
        } else {
            completedDays = day_number
        }

        const progress = completedDays / totalDays

        return (
            <ScrollView style={{ flex: 1 }}>
                <TouchableOpacity
                    style={styles.item}
                    onPress={() => {
                        router.push(`/plan/${plan_id}`)
                    }}
                >
                    <View style={styles.imageContainer}>
                        <Image
                            source={{
                                uri: `https://drive.google.com/thumbnail?id=${image_url}&sz=w1000`,
                            }}
                            style={styles.image}
                            resizeMode="cover"
                        />
                        <View style={styles.progressContainer}>
                            <Text style={styles.dayText}>Day {day_number}</Text>
                            <Progress.Bar
                                progress={progress}
                                width={Dimensions.get('screen').width * 0.5}
                                color={COLORS.primary}
                                unfilledColor="rgba(128, 128, 128, 0.7)"
                                borderWidth={0}
                                height={10}
                                style={styles.progressBar}
                            />
                            <Text style={styles.progressPercentage}>
                                {`${Math.round(progress * 100)}% Complete`}
                            </Text>
                            <TouchableOpacity
                                style={styles.playButton}
                                onPress={() => {
                                    router.push(`/plan/${plan_id}`)
                                }}
                            >
                                <Icon
                                    name="controller-play"
                                    size={30}
                                    color={COLORS.text}
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.overlayContainer}>
                            <Text
                                style={styles.planTitle}
                                numberOfLines={1}
                                ellipsizeMode="tail"
                            >
                                {plan_name}
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </ScrollView>
        )
    }

    const renderHiddenItem = (data, rowMap) => {
        const { plan_name } = data.item

        return (
            <View style={styles.hiddenItem}>
                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => {
                        showDeleteModal(plan_name)
                        rowMap[data.item.id].closeRow()
                    }}
                >
                    <Icon name="trash" size={30} color="red" />
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <>
            {data.length > 0 ? (
                <SwipeListView
                    data={data}
                    renderItem={renderItem}
                    renderHiddenItem={renderHiddenItem}
                    leftOpenValue={0}
                    rightOpenValue={-75}
                    disableRightSwipe
                />
            ) : (
                <View style={styles.noPlansContainer}>
                    <Text style={styles.noPlansText}>
                        You don't have any active plans.
                    </Text>
                </View>
            )}

            <Modal
                transparent={true}
                visible={modalVisible}
                animationType="fade"
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Confirm Delete</Text>
                        <Text style={styles.modalMessage}>
                            Are you sure delete this plan "{planNameToDelete}"?
                        </Text>
                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.cancelButtonText}>
                                    Cancel
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.okButton}
                                onPress={handleDeletePlan}
                            >
                                <Text style={styles.okButtonText}>OK</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    )
}

export default ActivePlan

const styles = StyleSheet.create({
    item: {
        position: 'relative',
        width: '100%',
        aspectRatio: 1.9,
        overflow: 'hidden',
        marginVertical: 10,
        alignSelf: 'center',
    },
    imageContainer: {
        width: '100%',
        height: '100%',
        borderRadius: 20,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    overlayContainer: {
        position: 'absolute',
        bottom: 10,
        left: 20,
        right: 20,
    },
    planTitle: {
        fontFamily: FONT.bold,
        fontSize: SIZES.largeX,
        color: COLORS.white,
        lineHeight: 28,
    },
    playButton: {
        position: 'absolute',
        right: 10,
        top: '40%',
        backgroundColor: COLORS.primary,
        borderRadius: 25,
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    progressContainer: {
        position: 'absolute',
        top: 10,
        left: 20,
        right: 10,
    },
    dayText: {
        fontFamily: FONT.bold,
        fontSize: 40,
        color: COLORS.white,
        lineHeight: 48,
    },
    progressBar: {
        marginTop: 10,
        borderRadius: 5,
    },
    progressPercentage: {
        fontFamily: FONT.regular,
        fontSize: SIZES.smallX,
        color: COLORS.white,
        lineHeight: 20,
    },
    hiddenItem: {
        flex: 1,
        alignItems: 'flex-end',
        justifyContent: 'center',
        backgroundColor: COLORS.white,
        borderRadius: 20,
        marginVertical: 10,
    },
    deleteButton: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 75,
        height: '100%',
    },

    noPlansContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        borderRadius: 20,
        height: 'auto',
        aspectRatio: 1,
    },
    noPlansText: {
        textAlign: 'center',
        fontFamily: FONT.bold,
        fontSize: SIZES.large,
        color: COLORS.text,
    },

    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontFamily: FONT.bold,
        color: COLORS.native,
        marginBottom: 10,
    },
    modalMessage: {
        fontSize: 12,
        fontFamily: FONT.bold,
        color: COLORS.text,
        textAlign: 'center',
        marginBottom: 20,
        opacity: 0.5,
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    cancelButton: {
        flex: 1,
        paddingVertical: 12,
        marginRight: 10,
        borderRadius: 8,
        backgroundColor: COLORS.bgColor,
        alignItems: 'center',
    },
    cancelButtonText: {
        color: COLORS.text,
        fontSize: 14,
        fontFamily: FONT.bold,
        opacity: 0.2,
    },
    okButton: {
        flex: 1,
        paddingVertical: 12,
        marginLeft: 10,
        borderRadius: 8,
        backgroundColor: COLORS.primaryDark,
        alignItems: 'center',
    },
    okButtonText: {
        color: COLORS.white,
        fontSize: 14,
        fontFamily: FONT.bold,
    },
})
