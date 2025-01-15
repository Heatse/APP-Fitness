import React from 'react'
import { View, StyleSheet, Dimensions } from 'react-native'
import WebView from 'react-native-webview'

const YouTubePlayer = ({ videoId }) => {
    const videoUrl = `https://www.youtube.com/embed/${videoId}?controls=1&autoplay=1`

    return (
        <View style={styles.container}>
            <WebView
                source={{ uri: videoUrl }}
                style={styles.webview}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                allowsInlineMediaPlayback={true}
                mediaPlaybackRequiresUserAction={false}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: Dimensions.get('window').width * (9 / 16),
        width: '100%',
        overflow: 'hidden',
    },
    webview: {
        flex: 1,
    },
})

export default YouTubePlayer
