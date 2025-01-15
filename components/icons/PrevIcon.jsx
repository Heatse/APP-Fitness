import React from 'react'
import { View } from 'react-native'
import Svg, { Path } from 'react-native-svg'

const PrevIcon = ({ width = 25, height = 24, color = 'white' }) => {
    return (
        <View
            style={{
                width: width,
                height: height,
                position: 'relative',
            }}
        >
            <Svg
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    zIndex: 1,
                }}
                width={width}
                height={height}
                viewBox="0 0 24 24"
                fill="none"
            >
                <Path
                    d="M12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22ZM9.21 11.47L12.74 7.94C12.89 7.79 13.08 7.72 13.27 7.72C13.46 7.72 13.65 7.79 13.8 7.94C14.09 8.23 14.09 8.71 13.8 9L10.8 12L13.8 15C14.09 15.29 14.09 15.77 13.8 16.06C13.51 16.35 13.03 16.35 12.74 16.06L9.21 12.53C8.91 12.24 8.91 11.76 9.21 11.47Z"
                    fill={color}
                />
            </Svg>
            <View
                style={{
                    position: 'absolute',
                    width: 18,
                    height: 20,
                    backgroundColor: 'black',
                    top: 2,
                    left: 3,
                    borderRadius: 1000,
                }}
            ></View>
        </View>
    )
}

export default PrevIcon
