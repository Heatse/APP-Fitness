import Svg, { Path, G, Rect } from 'react-native-svg'
import { COLORS } from '../../../constants/theme'

const PlanIcon = ({ width = 25, height = 24, color }) => {
    return (
        <Svg width={width} height={height} viewBox="0 0 25 24" fill="none">
            {/* First path to simulate the top border and box */}
            <Path
                d="M10.6825 19V14H14.6825V19C14.6825 19.55 15.1325 20 15.6825 20H18.6825C19.2325 20 19.6825 19.55 19.6825 19V12H21.3825C21.8425 12 22.0625 11.43 21.7125 11.13L13.3525 3.59997C12.9725 3.25997 12.3925 3.25997 12.0125 3.59997L3.65247 11.13C3.31247 11.43 3.52247 12 3.98247 12H5.68247V19C5.68247 19.55 6.13247 20 6.68247 20H9.68247C10.2325 20 10.6825 19.55 10.6825 19Z"
                fill={color ? color : COLORS.white}
            />
        </Svg>
    )
}

export default PlanIcon
