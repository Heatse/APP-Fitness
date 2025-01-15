import { StyleSheet, View } from 'react-native'
import { Stack } from 'expo-router'
import { useEffect, useState } from 'react'
import SpashScreenView from '../../components/splash/Splash'
import Intro from '../../components/intro/Intro'
import { deleteDb, shareDatabase } from '../database/loadData'

export default function App() {
    const [isSplash, setIsSplash] = useState(true)
    useEffect(() => {
        setTimeout(() => {
            setIsSplash(false)
        }, 3000)
    }, [])

    // Execute database queries
    // deleteDb()
    // shareDatabase()

    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    headerShown: false,
                }}
            />
            {isSplash ? <SpashScreenView /> : <Intro />}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
})
