import { StyleSheet, Text, View } from 'react-native'
import { COLORS } from '../../constants/theme'

const AdvertiseMentTwo = () => {
    return (
        <View style={styles.container}>
            <Text style={{ textAlign: 'center', color: COLORS.white }}>
                Box Google Ads
            </Text>
        </View>
    )
}

export default AdvertiseMentTwo

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 134,
        backgroundColor: COLORS.primaryDark,
        justifyContent: 'center',
        alignItems: 'center',
        display: 'none',
    },
})
