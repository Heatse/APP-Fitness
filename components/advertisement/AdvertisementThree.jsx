import { StyleSheet, Text, View } from 'react-native'
import { COLORS } from '../../constants/theme'

const AdvertiseMentThree = () => {
    return (
        <View style={styles.container}>
            <Text style={{ textAlign: 'center', color: COLORS.white }}>
                Box Google Ads
            </Text>
        </View>
    )
}

export default AdvertiseMentThree

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 90,
        marginTop: 16,
        backgroundColor: COLORS.primaryDark,
        justifyContent: 'center',
        alignItems: 'center',
        display: 'none',
    },
})
