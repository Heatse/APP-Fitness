import { StyleSheet, Text, View } from 'react-native'
import { COLORS } from '../../constants/theme'

const AdvertiseMentFour = ({ style, textStyle }) => {
    return (
        <View style={[styles.container, style]}>
            <Text
                style={[
                    { textAlign: 'center', color: COLORS.white },
                    textStyle,
                ]}
            >
                Box Google Ads
            </Text>
        </View>
    )
}

export default AdvertiseMentFour

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 66,
        backgroundColor: COLORS.primaryDark,
        justifyContent: 'center',
        alignItems: 'center',
        display: 'none',
    },
})
