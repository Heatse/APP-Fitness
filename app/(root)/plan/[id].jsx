import React, { useEffect, useState } from 'react';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import {
    ActivityIndicator,
    Animated,
    ImageBackground,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    ScrollView,
    View,
    FlatList,
} from 'react-native';
import { COLORS, FONT, SIZES } from '../../../constants/theme';
import icon from '../../../constants/icon';
import OverView from '../../../components/plan/overView';
import AboutPlan from '../../../components/plan/aboutPlan';
import Blur from '../../../components/common/blur';
import Icon from 'react-native-vector-icons/AntDesign';
import AdvertiseMentOne from '../../../components/advertisement/AdvertisementOne';
import AdvertiseMentFour from '../../../components/advertisement/AdvertisementFour';
import usePlanQueries from '../../database/tables/plan';

const Plan = () => {
    const { getPlanById, addUserPlan, getAllUserPlans, getAllUserPlanProgress, resetUserPlanProgress } = usePlanQueries();
    const { id } = useLocalSearchParams();
    const [data, setData] = useState();
    const [weekSections, setWeekSections] = useState({});
    const [weeks, setWeeks] = useState([]);
    const [isPlanSelected, setIsPlanSelected] = useState(false);
    const [isResetPopupVisible, setIsResetPopupVisible] = useState(false);
    const [allUserPlan, setAllUserPlan] = useState([]);
    const [allUserPlanProgress, setAllUserPlanProgress] = useState([]);
    const [isFloatingButtonVisible, setFloatingButtonVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    const handleSelectPlan = async () => {
        try {
            const result = await addUserPlan(data.plan_name);
            setIsPlanSelected(true);
            console.log('Plan selected successfully!');
        } catch (error) {
            console.error('Error adding user plan progress:', error);
        }
    };

    const handleReset = async () => {
        try {
            const result = await resetUserPlanProgress(data.plan_name);
            console.log('Plan Reset successfully!');
        } catch (error) {
            console.error('Error adding user plan progress:', error);
        }
    };

    const handleScroll = (event) => {
        const currentScrollY = event.nativeEvent.contentOffset.y;
        const speed = currentScrollY - lastScrollY;

        if (speed > 0 && currentScrollY > 150) {
            setFloatingButtonVisible(false);
        } else if (speed < 0) {
            setFloatingButtonVisible(true);
        }

        setLastScrollY(currentScrollY);
    };




    const checkIfPlanSelected = () => {
        return allUserPlan.some(plan => plan.plan_id === id);
    };

    const handleResetPlan = () => {
        setIsResetPopupVisible(true);
    };

    const confirmResetPlan = () => {
        handleReset()
        setIsResetPopupVisible(false);
    };

    const cancelResetPlan = () => {
        setIsResetPopupVisible(false);
    };

    useEffect(() => {
        if (!isPlanSelected) {
            setIsPlanSelected(checkIfPlanSelected());
        }
    }, [allUserPlan, id]);

    useEffect(() => {
        getPlanById(id).then(res => {
            setData(res);
            const { des_light_session, des_main_workout, des_warm_up, img_warm_up, img_main_workout, img_light_session } = res;
            const { firstWeek, middleWeeks, lastWeek } = splitWeeks(res.duration_weeks, des_light_session, des_main_workout, des_warm_up, img_warm_up, img_main_workout, img_light_session);
            setWeekSections({ firstWeek, middleWeeks, lastWeek });

            const combinedWeeks = [
                ...firstWeek,
                ...middleWeeks,
                ...lastWeek
            ];
            setWeeks(combinedWeeks);
        }).catch(err => console.error('Error fetching plan:', err));

        getAllUserPlans()
            .then(data => {
                setAllUserPlan(data);
            })
            .catch(err => console.error('Error fetching plan details:', err));

        getAllUserPlanProgress()
            .then(data => {
                setAllUserPlanProgress(data);
            })
            .catch(err => console.error('Error fetching plan details:', err));
    }, [id]);

    const splitWeeks = (totalWeeks, des_light_session, des_main_workout, des_warm_up, img_warm_up, img_main_workout, img_light_session) => {
        const parseImages = (imageString) => imageString.split(',').map((url) => (url.trim()));
        const firstWeekImages = parseImages(img_warm_up);
        const middleWeekImages = parseImages(img_main_workout);
        const lastWeekImages = parseImages(img_light_session);

        const firstWeek = [{
            id: 1,
            week: 'Week 1',
            icon: icon.planprimary,
            title: 'Assesment Week',
            description: des_warm_up,
            image1: firstWeekImages[0],
            image2: firstWeekImages[1],
            image3: firstWeekImages[2],
        }];

        const lastWeek = [{
            id: totalWeeks,
            week: `Week ${totalWeeks}`,
            icon: icon.vector2,
            title: 'Brutal Week',
            description: des_light_session,
            image1: lastWeekImages[0],
            image2: lastWeekImages[1],
            image3: lastWeekImages[2],
        }];

        let middleWeeks = [];

        if (totalWeeks > 3) {
            middleWeeks = [{
                id: 2,
                week: `Week 2-${totalWeeks - 1}`,
                icon: icon.caloprimary,
                title: 'Main Part',
                description: des_main_workout,
                image1: middleWeekImages[0],
                image2: middleWeekImages[1],
                image3: middleWeekImages[2],
            }];
        } else if (totalWeeks === 3) {
            middleWeeks = [{
                id: 2,
                week: 'Week 2',
                icon: icon.caloprimary,
                title: 'Main Part',
                description: des_main_workout,
                image1: middleWeekImages[0],
                image2: middleWeekImages[1],
                image3: middleWeekImages[2],
            }];
        }

        return { firstWeek, middleWeeks, lastWeek };
    };

    if (!data) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    const renderHeader = () => (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <ImageBackground
                source={{ uri: `https://drive.google.com/thumbnail?id=${data?.image_url}&sz=w1000` }}
                style={styles.image}
                resizeMode="cover"
            >
                <TouchableOpacity style={styles.btnPrev} onPress={() => router.back()}>
                    <Icon name="arrowleft" size={24} color="black" />
                </TouchableOpacity>
                <Blur style={styles.blurWrap} />
                <View style={styles.overlay}>
                    <Text style={styles.matchTag}>{data?.level}</Text>
                    <Text
                        style={styles.title}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                    >
                        {data?.plan_name}
                    </Text>
                </View>
            </ImageBackground>
            <View style={styles.detailsContainer}>
                <View style={styles.detailBox}>
                    <Text style={styles.detailNumber}>{data?.duration_minute}</Text>
                    <Text style={styles.detailLabel}>Minutes</Text>
                </View>
                <View style={styles.detailBox}>
                    <Text style={styles.detailNumber}>{data?.calories}</Text>
                    <Text style={styles.detailLabel}>Kcal</Text>
                </View>
                <View style={styles.detailBox}>
                    <Text style={styles.detailNumber}>{data?.duration_weeks}</Text>
                    <Text style={styles.detailLabel}>Weeks</Text>
                </View>
            </View>

            <View style={styles.detailDes}>
                <View style={{ flexDirection: 'row' }}>
                    <Icon name="checkcircle" size={16} color="green" />
                    <Text style={styles.detailtext}>Your goal: {data?.goal}</Text>
                </View>
                {data?.benefits.split(',').map((benefit, index) => (
                    <View key={index} style={{ flexDirection: 'row', marginTop: 5 }}>
                        <Icon name="checkcircle" size={16} color="green" />
                        <Text style={styles.detailtext}>{benefit.trim()}</Text>
                    </View>
                ))}
            </View>
            <View style={{ paddingHorizontal: 16 }}>
                <Text style={styles.aboutText}>How?</Text>
                <View style={{ flexDirection: 'row' }}>
                    <FlatList
                        data={about}
                        renderItem={({ item }) => <AboutPlan key={item.id} item={item} />}
                        horizontal
                        keyExtractor={(item) => item.id.toString()}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                    />
                </View>
            </View>
            <View style={{ paddingHorizontal: 16 }}>
                <Text style={styles.aboutText}>Plan Overview</Text>
                <View style={{ flexDirection: 'column' }}>
                    <ScrollView>
                        {weeks.map((week) => (
                            <View key={week.id}>
                                <OverView item={week} />
                            </View>
                        ))}
                    </ScrollView>
                </View>
            </View>
            <View style={styles.floatingButton}>
                {isPlanSelected ? (
                    <>
                        <TouchableOpacity
                            style={styles.startButton}
                            onPress={() => { router.push(`plan/startPlan/${id}`); }}

                        >
                            <Text style={styles.continueText}>Start Plan</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.resetButton}
                            onPress={handleResetPlan}
                        >
                            <Icon name="reload1" size={24} color="white" />
                        </TouchableOpacity>
                    </>
                ) : (
                    <TouchableOpacity style={styles.continueButton} onPress={handleSelectPlan}>
                        <Text style={styles.continueText}>Select</Text>
                    </TouchableOpacity>
                )}
            </View>
        </>
    );

    const renderFooter = () => (
        <View>
            <AdvertiseMentOne />
            <AdvertiseMentFour />
            <Modal
                transparent={true}
                visible={isResetPopupVisible}
                animationType="fade"
                onRequestClose={cancelResetPlan}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Reset Plan!!!</Text>
                        <View style={styles.modalMessage}>
                            <Text style={styles.modalMessagePart1}>Are you sure </Text>
                            <Text style={styles.modalMessagePart2}>Reset Plan?</Text>
                        </View>
                        <View style={styles.modalActions}>
                            <TouchableOpacity style={styles.cancelButton} onPress={cancelResetPlan}>
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.okButton} onPress={confirmResetPlan}>
                                <Text style={styles.okButtonText}>OK</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );

    return (
        <View style={{ flex: 1 }}>
            <ScrollView
                style={{ flex: 1, }}
                showsVerticalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={16}
            >
                {renderHeader()}
                {renderFooter()}

            </ScrollView>
            {isFloatingButtonVisible && (
                <View style={styles.floatingButton}>
                    {isPlanSelected ? (
                        <>
                            <TouchableOpacity
                                style={styles.startButton}
                                onPress={() => { router.push(`plan/startPlan/${id}`); }}
                            >
                                <Text style={styles.continueText}>Start Plan</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.resetButton}
                                onPress={handleResetPlan}
                            >
                                <Icon name="reload1" size={24} color="white" />
                            </TouchableOpacity>
                        </>
                    ) : (
                        <TouchableOpacity style={styles.continueButton} onPress={handleSelectPlan}>
                            <Text style={styles.continueText}>Select</Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}
        </View>
    );
};

export default Plan;

const about = [
    {
        id: 1,
        icon: icon.muscle,
        text1: 'Strength',
        text2: 'Building',
    },
    {
        id: 2,
        icon: icon.vector,
        text1: 'Full - Body',
        text2: 'Exercises',
    },
    {
        id: 3,
        icon: icon.rotine,
        text1: 'Low Rep ',
        text2: 'Counts',
    },
];

const weeks = [
    {
        id: 1,
        week: 'Week 1',
        icon: icon.caloprimary,
        title: 'Main Part',
    },
    {
        id: 2,
        week: 'Week 2',
        icon: icon.caloblue,
        title: 'Rest and Recovery',
    },
]

const styles = StyleSheet.create({

    plan: {
        backgroundColor: COLORS.bgColor,
        flex: 1,
    },
    image: {
        width: '100%',
        aspectRatio: 1.63755458515,
        justifyContent: "flex-end",
    },

    btnPrev: {
        position: 'absolute',
        top: 56,
        left: 16,
    },
    overlay: {
        alignItems: 'center',
        paddingVertical: 10,
    },
    matchTag: {
        backgroundColor: COLORS.primaryDark,
        color: COLORS.white,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        fontSize: 10,
        fontFamily: FONT.bold,
    },
    title: {
        color: COLORS.text,
        fontSize: SIZES.largeX,
        fontFamily: FONT.bold,
        marginTop: 5,
    },

    blurWrap: {
        position: 'absolute',
        bottom: 0,
    },
    detailsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 10,
        paddingHorizontal: 25,
        paddingVertical: 10,
    },
    detailBox: {
        alignItems: 'center',
        flexDirection: 'column',
        backgroundColor: COLORS.white,
        width: 90,
        paddingHorizontal: 3,
        paddingVertical: 6,
        borderRadius: 12,
    },
    detailNumber: {
        marginTop: 5,
        bottom: 0,
        fontSize: 16,
        fontFamily: FONT.bold,
        color: COLORS.primaryDark,
        lineHeight: 24,
    },
    detailLabel: {
        fontSize: 10,
        fontFamily: FONT.regular,
        color: COLORS.primaryDark,
        lineHeight: 18,
    },
    detailDes: {
        paddingHorizontal: 16,
    },

    detailtext: {
        fontSize: SIZES.smallX,
        color: COLORS.text,
        fontFamily: FONT.regular,
        paddingHorizontal: 16,
        lineHeight: 20,
    },
    detailPlan: {
        paddingHorizontal: 16,
        marginTop: 10,
        marginBottom: 10,
    },

    aboutText: {
        marginTop: 10,
        marginBottom: 10,
        fontSize: SIZES.mediumX,
        color: COLORS.text,
        fontFamily: FONT.bold,
    },
    plantext: {
        marginTop: 10,
        marginBottom: 10,
        paddingHorizontal: 16,
        fontSize: SIZES.mediumX,
        color: COLORS.text,
        fontFamily: FONT.bold,
    },

    floatingButton: {
        backgroundColor: 'transparent',
        position: 'relative',
        top: 0,
        bottom: 10,
        marginBottom: 10,
        paddingHorizontal: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 12,
    },

    continueButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        backgroundColor: COLORS.primaryDark,
        justifyContent: 'center',
        alignItems: 'center',
    },
    startButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        backgroundColor: COLORS.primaryDark,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10
    },
    continueText: {
        color: COLORS.white,
        fontSize: SIZES.mediumX,
        fontFamily: FONT.bold,
    },
    resetButton: {
        padding: 12,
        borderRadius: 12,
        backgroundColor: COLORS.grayDark,
        justifyContent: 'center',
        alignItems: 'center',
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
        padding: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 17.32,
        fontFamily: FONT.semibold,
        color: COLORS.native,
        marginBottom: 10,
    },
    modalMessage: {
        flexDirection: 'row',
        textAlign: 'center',
        marginBottom: 10,
    },
    modalMessagePart1: {
        fontSize: 12,
        fontFamily: FONT.regular,
        color: COLORS.text,
        opacity: 0.5
    },
    modalMessagePart2: {
        fontSize: 12,
        fontFamily: FONT.bold,
        color: COLORS.text,
        opacity: 0.5,
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        bottom: 0,
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

});
