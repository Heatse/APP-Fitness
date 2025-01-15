import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity, ActivityIndicator, Modal, Dimensions } from 'react-native'
import { SwipeListView } from 'react-native-swipe-list-view'
import Icon from 'react-native-vector-icons/AntDesign'
import Icon2 from 'react-native-vector-icons/SimpleLineIcons'
import Icon3 from 'react-native-vector-icons/Entypo'
import { COLORS, FONT, SIZES } from '../../../constants/theme'
import icon from '../../../constants/icon'
import usePlanQueries from '../../../app/database/tables/plan'
const windowWidth = Dimensions.get('window').width
const windowHeight = Dimensions.get('window').height

const DonePlan = () => {
    const { getListPlansDone, deleteUserPlan } = usePlanQueries()
    const [data, setData] = useState([]);
    const [reload, setReload] = useState(false)
    const [isLoading, setIsLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [planNameToDelete, setPlanNameToDelete] = useState('');

    useEffect(() => {
        const fetchPlans = async () => {
            setIsLoading(true);
            try {
                const res = await getListPlansDone();

                if (Array.isArray(res)) {
                    if (res.length > 0) {
                        setData(res);
                    } else {
                        setData([]);
                    }
                } else {
                    setData([]);
                    console.error('Error getting plans: Expected an array but got:', res);
                }
            } catch (err) {
                console.error('Error fetching plans:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPlans();
    }, [reload]);

    const showDeleteModal = (planName) => {
        setPlanNameToDelete(planName);
        setModalVisible(true);
    };

    const handleDeletePlan = async () => {
        try {
            const result = await deleteUserPlan(planNameToDelete);
            console.log('Plan deleted successfully!');
            setReload(!reload);
        } catch (error) {
            console.error('Error deleting user plan:', error);
        } finally {
            setModalVisible(false);
            setPlanNameToDelete('');
        }
    };

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    const renderItem = ({ item }) => {
        const {
            plan_name,
            duration_minute,
            calories,
            duration_weeks,
            image_url,
        } = item
        return (
            <View style={styles.card}>
                <View style={styles.textContainer}>
                    <Text style={styles.title}>{plan_name}</Text>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoText}>
                            <Icon name="clockcircleo" size={12} color="black" />{' '}
                            {duration_minute} minutes
                        </Text>
                        <Text style={styles.infoText}>
                            <Icon2 name="fire" size={12} color="black" />{' '}
                            {calories} Kcal
                        </Text>
                    </View>
                    <Text style={styles.infoText}>
                        <Image
                            source={icon.muscle2}
                            style={{ width: 12, height: 12 }}
                        />{' '}
                        {duration_weeks} Exercises
                    </Text>
                </View>
                <Image
                    source={{
                        uri: `https://drive.google.com/thumbnail?id=${image_url}&sz=w1000`,
                    }}
                    style={styles.image}
                    resizeMode="cover"
                />
            </View>
        )
    }

    const renderHiddenItem = (data, rowMap) => (
        <View style={styles.hiddenContainer} key={data.item.id}>
            <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => {
                    showDeleteModal(plan_name);
                    rowMap[data.item.id].closeRow()
                }}
            >
                <Icon3 name="trash" size={30} color="red" />
            </TouchableOpacity>
        </View>
    )

    return (
        <>
            {data.length > 0 ? (
                <SwipeListView
                    data={plandone}
                    renderItem={renderItem}
                    renderHiddenItem={renderHiddenItem}
                    rightOpenValue={-70}
                    disableRightSwipe
                    showsVerticalScrollIndicator={false}
                />
            ) : (
                <View style={styles.noPlansContainer}>
                    <Text style={styles.noPlansText}>
                        You don't have any completed plans yet .
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
                        <Text style={styles.modalMessage}>Are you sure delete this plan "{planNameToDelete}"?</Text>
                        <View style={styles.modalActions}>
                            <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.okButton} onPress={handleDeletePlan}>
                                <Text style={styles.okButtonText}>OK</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    )
}

export default DonePlan

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        backgroundColor: COLORS.white,
        borderRadius: 20,
        width: windowWidth * 0.9,
        height: windowHeight * 0.3,
        alignItems: 'center',
    },
    textContainer: {
        flex: 1,
        justifyContent: 'space-between',
        marginRight: 16,
        padding: 16,
    },
    title: {
        fontSize: 14,
        fontFamily: FONT.bold,
        color: COLORS.text,
        lineHeight: 22,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    infoText: {
        fontSize: 12,
        fontFamily: FONT.regular,
        color: COLORS.text,
        neHeight: 20,
    },
    image: {
        width: 165,
        height: 'auto',
        position: 'relative',
        aspectRatio: 1.433333333333333,
        resizeMode: 'cover',
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
        overflow: 'hidden',
    },
    hiddenContainer: {
        backgroundColor: COLORS.white,
        justifyContent: 'center',
        alignItems: 'flex-end',
        borderRadius: 20,
        height: '100%',
    },
    deleteButton: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 70,
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
        opacity: 0.2
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
