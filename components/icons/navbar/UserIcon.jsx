import React from 'react'
import Svg, { Circle, Path } from 'react-native-svg'
import { COLORS } from '../../../constants/theme'

const UserIcon = ({ width = 25, height = 24, color = COLORS.white }) => {
    return (
        <Svg
            xmlns="http://www.w3.org/2000/svg"
            width={width}
            height={height}
            viewBox="0 0 25 24"
            fill={color ? color : 'white'}
        >
            <Circle
                cx="12.3174"
                cy="7"
                r="4"
                stroke={color ? color : 'white'}
                strokeWidth="1.5"
            />

            <Path
                d="M4.31738 17.4135C4.31738 16.681 4.66361 15.9907 5.31196 15.65C6.58026 14.9835 9.01173 14 12.3174 14C15.623 14 18.0545 14.9835 19.3228 15.65C19.9712 15.9907 20.3174 16.681 20.3174 17.4135V17.4135C20.3174 18.2411 19.8739 19.0047 19.1025 19.3045C17.7837 19.8171 15.4408 20.5 12.3174 20.5C9.19398 20.5 6.85103 19.8171 5.5323 19.3045C4.76091 19.0047 4.31738 18.2411 4.31738 17.4135V17.4135Z"
                stroke={color ? color : 'white'}
                strokeWidth="1.5"
            />
        </Svg>
    )
}

export default UserIcon
