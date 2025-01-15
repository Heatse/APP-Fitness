import { Stack } from 'expo-router'

export default function AppLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="question/index"
                options={{
                    headerShown: true,
                    title: '',
                }}
            />

            <Stack.Screen
                name="home/index"
                options={{
                    headerShown: false,
                    title: '',
                }}
            />
            <Stack.Screen
                name="workout/detail/[id]"
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="workout/list/[id]"
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="workout/index"
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="profile/index"
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="profile/term/index"
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="profile/sound/index"
                options={{
                    headerShown: false,
                }}
            />

            <Stack.Screen
                name="profile/managerPlan/index"
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="profile/edit/index"
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="profile/reminder/index"
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="plan/[id]"
                options={{
                    headerShown: false,
                }}
            />

            <Stack.Screen
                name="plan/listPlan/index"
                options={{
                    headerShown: false,
                }}
            />

            <Stack.Screen
                name="plan/actionPlay/index"
                options={{
                    headerShown: false,
                }}
            />

            <Stack.Screen
                name="plan/startPlan/[id]"
                options={{
                    headerShown: false,
                }}
            />

            <Stack.Screen
                name="plan/readyToStart/index"
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="plan/done/index"
                options={{
                    headerShown: false,
                }}
            />
        </Stack>
    )
}
