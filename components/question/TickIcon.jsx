import { View } from 'react-native'
import Feather from 'react-native-vector-icons/Feather'
import { COLORS } from '../../constants/theme'

const TickIcon = ({ isDisplay }) => {
    return (
        <View
            style={{
                position: 'absolute',
                right: 24,
                top: '50%',
                transform: [{ translateY: -12 }],
                backgroundColor: COLORS.primaryDark,
                color: COLORS.white,
                height: 24,
                width: 24,
                borderRadius: 1000,
                display: isDisplay ? 'block' : 'none',
            }}
        >
            <Feather name="check" size={24} color="white" />
        </View>
    )
}

export default TickIcon
