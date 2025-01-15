import React, { useState } from 'react'
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import YouTubePlayer from './YoutubePlayer'

const YoutubeVideoFrame = ({ videoId }) => {
    const [isPlaying, setIsPlaying] = useState(false)

    return (
        <View style={styles.container}>
            {isPlaying ? (
                <YouTubePlayer videoId={videoId} />
            ) : (
                <View style={styles.thumbnailContainer}>
                    <Image
                        source={{
                            uri: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
                        }}
                        style={styles.thumbnail}
                        resizeMode="cover"
                    />
                    <TouchableOpacity
                        style={styles.playButton}
                        onPress={() => setIsPlaying(true)}
                    >
                        <Icon
                            name="play-circle-outline"
                            size={64}
                            color="#fff"
                        />
                    </TouchableOpacity>
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        aspectRatio: 16 / 9,
        backgroundColor: '#000', // màu nền khi load video
    },
    video: {
        width: '100%',
        height: '100%',
    },
    thumbnailContainer: {
        position: 'relative',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    thumbnail: {
        width: '100%',
        height: '100%',
    },
    playButton: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
    },
})

export default YoutubeVideoFrame
