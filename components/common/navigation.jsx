import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import PlanIcon from '../icons/navbar/PlanIcon'
import WorkoutIcon from '../icons/navbar/Workout'
import StatisticIcon from '../icons/navbar/StatisticsIcon'
import UserIcon from '../icons/navbar/UserIcon'
import { usePathname, useRouter } from 'expo-router'
import { COLORS, FONT, SIZES } from '../../constants/theme'

const Navigation = () => {
    const pathname = usePathname()
    const router = useRouter()

    const naviList = [
        {
            name: 'Home',
            path: '/home',
            IconComponent: PlanIcon,
        },
        {
            name: 'Workout',
            path: '/workout',
            IconComponent: WorkoutIcon,
        },
        {
            name: 'Statistics',
            path: '/statistics',
            IconComponent: StatisticIcon,
        },
        {
            name: 'Profile',
            path: '/profile',
            IconComponent: UserIcon,
        },
    ]

    const handleNavigate = (path) => {
        router.push(path)
    }
    if (!ROUTE_DISPLAY.includes(pathname)) {
        return null
    }

    return (
        <View style={styles.nav}>
            {naviList.map((item, index) => {
                const isActive = pathname?.includes(item.path)
                const Icon = item.IconComponent
                return (
                    <TouchableOpacity
                        onPress={() => handleNavigate(item.path)}
                        style={[
                            styles.navItem,
                            isActive && styles.activeNavItem,
                        ]}
                        key={index}
                    >
                        <Icon
                            width={24}
                            height={24}
                            color={isActive && COLORS.text}
                        />
                        {isActive && (
                            <Text style={styles.navText}>{item.name}</Text>
                        )}
                    </TouchableOpacity>
                )
            })}
        </View>
    )
}

export default Navigation

const styles = StyleSheet.create({
    nav: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
        paddingHorizontal: 38,
        backgroundColor: COLORS.text,
        position: 'absolute',
        bottom: 0,
    },
    navItem: {
        flexDirection: 'row',
        gap: 3,
        paddingVertical: 6,
        alignItems: 'center',
    },
    navText: {
        fontSize: SIZES.smallX,
        fontFamily: FONT.medium,
        color: COLORS.text,
    },
    activeNavItem: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 20,
        borderRadius: 43,
    },
})

const ROUTE_DISPLAY = [
    // '/intro',

    '/home',
    '/workout',
    '/statistics',
    '/profile',
    '/plan'
    // '/question',
    // '/plan/exerciseList',
]
