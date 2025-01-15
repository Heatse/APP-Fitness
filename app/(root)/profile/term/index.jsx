import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'
import { COLORS, FONT, SIZES } from '../../../../constants/theme'
import PrevIcon from '../../../../components/icons/PrevIcon'
import AdvertiseMentOne from '../../../../components/advertisement/AdvertisementOne'
import { router } from 'expo-router'

const TermOfService = () => {
    return (
        <ScrollView style={styles.safeView}>
            {/* Header */}
            <View style={styles.stack}>
                <TouchableOpacity
                    style={{
                        marginLeft: 16,
                        width: 40,
                        height: 40,
                    }}
                    onPress={() => router.back()}
                >
                    <PrevIcon
                        style={{
                            width: 40,
                            height: 40,
                        }}
                    />
                </TouchableOpacity>
                <View
                    style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        transform: [{ translateX: -20 }],
                    }}
                >
                    <Text style={styles.title}>Terms of Service</Text>
                </View>
            </View>

            {/* Content */}
            <View style={styles.content}>
                <Text style={styles.lastUpdated}>Last Updated: [Date]</Text>

                <View
                    style={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                    }}
                >
                    <Text
                        style={{ fontFamily: FONT.regular, color: COLORS.text }}
                    >
                        Welcome to
                    </Text>
                    <Text
                        style={{
                            fontFamily: FONT.bold,
                            color: COLORS.primaryDark,
                            marginLeft: 4,
                        }}
                    >
                        Fitness and Workout!
                    </Text>
                </View>
                <Text style={styles.paragraph}>
                    Before you start using our services, please read these Terms
                    of Service carefully. By accessing or using our app, you
                    agree to be bound by these terms.
                </Text>

                <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
                <Text style={styles.paragraph}>
                    By creating an account or using our app, you acknowledge
                    that you have read, understood, and agree to these Terms of
                    Service.
                </Text>

                <Text style={styles.sectionTitle}>2. Use of the App</Text>
                <Text style={styles.paragraph}>
                    You must be at least 18 years old or have parental consent
                    to use this app. You are responsible for keeping your login
                    credentials secure. You agree not to misuse the app for
                    illegal purposes or unauthorized activities.
                </Text>

                <Text style={styles.sectionTitle}>3. Health Disclaimer</Text>
                <Text style={styles.paragraph}>
                    Our app provides general fitness guidance. However, we are
                    not medical professionals. Consult your doctor before
                    starting any new fitness program. You acknowledge that any
                    physical activity involves risks, including injury. Use the
                    app at your own risk.
                </Text>

                <Text style={styles.sectionTitle}>
                    4. Subscriptions and Payments
                </Text>
                <Text style={styles.paragraph}>
                    Some features of the app require a subscription. Payments
                    are processed through [Payment Method]. All subscription
                    fees are non-refundable. You may cancel your subscription at
                    any time through your account settings.
                </Text>

                <Text style={styles.sectionTitle}>5. Termination</Text>
                <Text style={styles.paragraph}>
                    We reserve the right to suspend or terminate your access to
                    the app if you violate these terms or engage in harmful
                    behavior.
                </Text>

                <Text style={styles.sectionTitle}>6. Changes to Terms</Text>
                <Text style={styles.paragraph}>
                    We may update these Terms of Service from time to time. We
                    will notify you of any significant changes by posting the
                    new terms on the app.
                </Text>

                <Text style={styles.sectionTitle}>7. Contact Us</Text>
                <Text style={styles.paragraph}>
                    If you have any questions regarding these terms, please
                    contact us at [Email Address].
                </Text>
            </View>

            {/* Advertisement */}
            <AdvertiseMentOne />
        </ScrollView>
    )
}

export default TermOfService

const styles = StyleSheet.create({
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
    content: {
        marginTop: 12,
        fontSize: SIZES.medium,
        padding: 16,
    },
    lastUpdated: {
        marginBottom: 16,
    },
    sectionTitle: {
        color: COLORS.text,
    },
    paragraph: {
        fontSize: 14,
        fontFamily: FONT.regular,
        color: COLORS.text,
        marginBottom: 16,
        lineHeight: 20,
    },
    advertisement: {
        marginTop: 16,
    },
})
