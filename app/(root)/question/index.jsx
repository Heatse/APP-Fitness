import React, { useState, Suspense } from 'react'
import {
    ActivityIndicator,
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'
import { COLORS, FONT, SIZES } from '../../../constants/theme'
import { Stack, useRouter } from 'expo-router'
import icon from '../../../constants/icon'

const QuestionOne = React.lazy(() =>
    import('../../../components/question/questionOne')
)
const QuestionTwo = React.lazy(() =>
    import('../../../components/question/questionTwo')
)
const QuestionThree = React.lazy(() =>
    import('../../../components/question/questionThree')
)
const QuestionFour = React.lazy(() =>
    import('../../../components/question/questionFour')
)
const QuestionFive = React.lazy(() =>
    import('../../../components/question/questionFive')
)
const QuestionSix = React.lazy(() =>
    import('../../../components/question/questionSix')
)

const Question = () => {
    const [currentQuestion, setCurrentQuestion] = useState(1)
    const [answer, setAnswer] = useState({})

    const router = useRouter()

    const goBack = () => {
        if (currentQuestion > 1) {
            setCurrentQuestion(currentQuestion - 1)
        } else {
            router.push('/')
        }
    }

    const handleAnswer = (answers) => {
        setAnswer((prevAnswer) => ({
            ...prevAnswer,
            ...answers,
        }))

        // Tiến đến câu hỏi tiếp theo nếu chưa đến câu 6
        if (currentQuestion < 6) {
            setCurrentQuestion(currentQuestion + 1)
        }
    }

    const renderQuestion = () => {
        switch (currentQuestion) {
            case 1:
                return <QuestionOne answer={answer} onAnswer={handleAnswer} />
            case 2:
                return <QuestionTwo answer={answer} onAnswer={handleAnswer} />
            case 3:
                return <QuestionThree answer={answer} onAnswer={handleAnswer} />
            case 4:
                return <QuestionFour answer={answer} onAnswer={handleAnswer} />
            case 5:
                return <QuestionFive answer={answer} onAnswer={handleAnswer} />
            case 6:
                return <QuestionSix answer={answer} />
            default:
                return null
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen
                options={{
                    headerTintColor: COLORS.text,
                    headerShadowVisible: false,
                    headerTitleStyle: {
                        fontSize: 10,
                        fontFamily: FONT.bold,
                    },
                    headerTitleAlign: 'center',
                    headerStyle: {
                        backgroundColor: COLORS.bgColor,
                    },
                    headerLeft: () => (
                        <TouchableOpacity
                            onPress={goBack}
                            style={{
                                width: 24,
                                height: 24,
                            }}
                        >
                            <Image source={icon.backBtn} />
                        </TouchableOpacity>
                    ),
                    headerRight: () => (
                        <TouchableOpacity
                            style={{
                                backgroundColor: '#DBEAFE',
                                borderRadius: 8,
                                paddingHorizontal: 15,
                                paddingVertical: 5,
                                marginRight: 0,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: SIZES.medium,
                                    fontFamily: FONT.regular,
                                    color: '#2563EB',
                                    lineHeight: 20,
                                }}
                            >{`${currentQuestion} of 6`}</Text>
                        </TouchableOpacity>
                    ),
                }}
            />

            <Suspense
                fallback={
                    <View
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <ActivityIndicator
                            size="large"
                            color={COLORS.primary}
                        />
                    </View>
                }
            >
                <View style={{ flex: 1 }}>{renderQuestion()}</View>
            </Suspense>
        </SafeAreaView>
    )
}

export default Question

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.bgColor,
        justifyContent: 'space-between',
    },
})
