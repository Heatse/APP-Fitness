import React, { useEffect, useState } from 'react'
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    View,
} from 'react-native'
import Item from './Item'
import { COLORS, FONT, SIZES } from '../../constants/theme'
import usePlanQueries from '../../app/database/tables/plan'

const ListItem = ({ item }) => {
    const { getPlansbyTag } = usePlanQueries()
    const [plans, setPlans] = useState([])

    useEffect(() => {
        getPlansbyTag(item.title)
            .then((data) => {
                setPlans(data)
            })
            .catch((err) => console.error('Error fetching plan:', err))
    }, [])

    return (
        <View key={item.id}>
            <View style={styles.headText}>
                <Text style={styles.textIntro}>{item.title}</Text>
                <Text style={styles.textDes}>{item.desTitle}</Text>
            </View>

            <FlatList
                data={plans}
                renderItem={({ item }) => (
                    <Item key={item?.plan_id} list={item} />
                )}
                horizontal
                keyExtractor={(item) => item?.plan_id.toString()}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
            />
        </View>
    )
}

export default ListItem

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.white,
        flex: 1,
    },

    headText: {
        flexDirection: 'column',
        width: '100%',
        justifyContent: 'center',
        marginTop: 16,
        alignItems: 'flex-start',
    },
    textIntro: {
        fontSize: SIZES.largeX,
        fontFamily: FONT.bold,
        color: COLORS.text,
        lineHeight: 32,
    },
    textDes: {
        fontSize: SIZES.medium,
        fontFamily: FONT.regular,
        color: COLORS.text,
        opacity: 0.5,
        lineHeight: 22,
    },

    advertise4: {
        position: 'absolute',
        bottom: 64,
    },
})
