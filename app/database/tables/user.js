import { getStartAndEndOfWeek } from '../../../utils/helper'
import { useDatabase } from '../index'

export const useUserQueries = () => {
    const db = useDatabase()

    const getUser = async () => {
        try {
            const rs = await db.getAllAsync(
                `SELECT *
                FROM User`
            )
            return rs
        } catch (error) {
            console.error('Error fetching getUser:', error)
            throw error
        }
    }

    const getUserByParams = async (params) => {
        try {
            if (!Array.isArray(params) || params.length === 0) {
                throw new Error('Params must be a non-empty array')
            }

            const validFields = [
                'id',
                'name',
                'age',
                'gender',
                'goal',
                'height',
                'status',
                'type_body',
                'weight',
                'avatar',
                'units',
            ]

            const selectedFields = params.filter((field) =>
                validFields.includes(field)
            )

            if (selectedFields.length === 0) {
                throw new Error('No valid fields provided in params')
            }

            const query = `SELECT ${selectedFields.join(', ')} FROM User`

            const result = await db.getAllAsync(query)
            return result
        } catch (error) {
            console.error('Error fetching user by params:', error)
            throw error
        }
    }

    const updateUserInfo = async (updateData) => {
        try {
            const validFields = [
                'age',
                'gender',
                'goal',
                'height',
                'name',
                'status',
                'type_body',
                'weight',
                'avatar',
                'units',
            ]
            const updates = Object.entries(updateData)
                .filter(([key]) => validFields.includes(key))
                .map(([key, value]) => `${key} = '${value}'`)

            if (updates.length === 0) {
                return null
            }

            const query = `
                UPDATE User 
                SET ${updates.join(', ')}
            `

            const result = await db.runAsync(query)
            return result
        } catch (error) {
            console.error('Error updating user info:', error)
            throw error
        }
    }

    const getWorkoutStatis = async () => {
        try {
            const result = await db.getAllAsync(`
                WITH ExerciseStats AS (
                    SELECT 
                        COUNT(DISTINCT e.id) as total_exercises,
                        SUM(CAST(ps.second_list AS INTEGER)) as total_seconds,
                        SUM(CAST(ps.second_list AS INTEGER) * e.calories_per_m / 60.0) as total_calories
                    FROM UserPlanProgress upp
                    JOIN UserPlans up ON up.user_plan_id = upp.user_plan_id
                    JOIN PlanSchedule ps ON ps.plan_id = up.plan_id 
                        AND ps.week_number = upp.week_number 
                        AND ps.day_of_week = upp.day_number
                    JOIN Exercises e ON ps.list_exercise LIKE '%' || e.id || '%'
                    WHERE upp.day_number > 0
                )
                SELECT 
                    COALESCE(total_exercises, 0) as total_exercises,
                    ROUND(COALESCE(total_seconds/60.0, 0), 2) as total_minutes,
                    ROUND(COALESCE(total_calories, 0), 2) as total_calories
                FROM ExerciseStats;
            `)

            return {
                success: true,
                data: result[0] || {
                    total_exercises: 0,
                    total_minutes: 0,
                    total_calories: 0,
                },
            }
        } catch (error) {
            console.error('Error getting workout stats:', error)
            return {
                success: false,
                message: 'Đã xảy ra lỗi khi lấy thống kê tập luyện',
                error: error.message,
            }
        }
    }

    const getLongestStreak = async () => {
        try {
            const result = await db.getAllAsync(`
                WITH RECURSIVE DateSequence AS (
                    -- Lấy tất cả các ngày điểm danh
                    SELECT date(date) as check_date
                    FROM UserPlanProgress
                    WHERE day_number > 0
                    GROUP BY date(date)
                    ORDER BY date(date)
                ),
                Streaks AS (
                    SELECT 
                        check_date,
                        julianday(check_date) - 
                        julianday(LAG(check_date, 1) OVER (ORDER BY check_date)) as day_diff,
                        1 as streak_group
                    FROM DateSequence
                ),
                GroupedStreaks AS (
                    SELECT 
                        check_date,
                        SUM(CASE WHEN day_diff > 1 OR day_diff IS NULL THEN 1 ELSE 0 END) 
                        OVER (ORDER BY check_date) as streak_group
                    FROM Streaks
                )
                SELECT 
                    MIN(check_date) as start_date,
                    MAX(check_date) as end_date,
                    COUNT(*) as streak_length,
                    GROUP_CONCAT(check_date) as dates_in_streak
                FROM GroupedStreaks
                GROUP BY streak_group
                ORDER BY streak_length DESC
                LIMIT 1
            `)

            if (result.length === 0) {
                return {
                    success: true,
                    data: {
                        startDate: null,
                        endDate: null,
                        streakLength: 0,
                        datesInStreak: [],
                    },
                }
            }

            return {
                success: true,
                data: {
                    startDate: result[0].start_date,
                    endDate: result[0].end_date,
                    streakLength: result[0].streak_length,
                    datesInStreak: result[0].dates_in_streak.split(','),
                },
            }
        } catch (error) {
            console.error('Lỗi khi lấy chuỗi điểm danh dài nhất:', error)
            return {
                success: false,
                message: 'Đã xảy ra lỗi khi lấy chuỗi điểm danh dài nhất',
                error: error.message,
            }
        }
    }

    const updateCupCountForPlan = async (plan_id, week_number) => {
        try {
            // Lấy số ngày đã điểm danh trong tuần hiện tại
            const checkInRecords = await db.getAllAsync(
                `
                SELECT COUNT(DISTINCT day_number) as check_in_count
                FROM UserPlanProgress
                WHERE user_plan_id = (
                    SELECT user_plan_id
                    FROM UserPlans
                    WHERE plan_id = ?
                ) AND week_number = ? AND day_number > 0
            `,
                [plan_id, week_number]
            )

            const totalDaysInWeek = 7

            // Kiểm tra điều kiện nhận cup
            if (checkInRecords[0].check_in_count === totalDaysInWeek) {
                // Kiểm tra tuần trước
                const previousWeekCheckIn = await db.getAllAsync(
                    `
                    SELECT COUNT(DISTINCT day_number) as check_in_count
                    FROM UserPlanProgress
                    WHERE user_plan_id = (
                        SELECT user_plan_id
                        FROM UserPlans
                        WHERE plan_id = ?
                    ) AND week_number = ? AND day_number > 0
                `,
                    [plan_id, week_number - 1]
                )

                // Kiểm tra tuần trước nữa
                const weekBeforePreviousCheckIn = await db.getAllAsync(
                    `
                    SELECT COUNT(DISTINCT day_number) as check_in_count
                    FROM UserPlanProgress
                    WHERE user_plan_id = (
                        SELECT user_plan_id
                        FROM UserPlans
                        WHERE plan_id = ?
                    ) AND week_number = ? AND day_number > 0
                `,
                    [plan_id, week_number - 2]
                )

                let cupType = null

                if (previousWeekCheckIn[0].check_in_count === totalDaysInWeek) {
                    if (
                        weekBeforePreviousCheckIn[0].check_in_count ===
                        totalDaysInWeek
                    ) {
                        cupType = 'gold'
                    } else {
                        cupType = 'silver'
                    }
                } else {
                    cupType = 'bronze'
                }

                const cupAwarded = await db.getAllAsync(
                    `
                    SELECT COUNT(*) as count
                    FROM CupAwards
                    WHERE plan_id = ? AND week_number = ? AND cup_type = ?
                `,
                    [plan_id, week_number, cupType]
                )

                if (cupAwarded[0].count === 0) {
                    await db.runAsync(
                        `
                        INSERT INTO CupAwards (plan_id, week_number, cup_type)
                        VALUES (?, ?, ?)
                    `,
                        [plan_id, week_number, cupType]
                    )

                    return {
                        success: true,
                        message: `Great start! 🥉 You've unlocked the ${cupType}! Keep going – the next level awaits!`,
                        cupType,
                    }
                }
            }

            // Kiểm tra nếu hoàn thành kế hoạch
            const isPlanCompleted = await db.getAllAsync(
                `
                SELECT COUNT(*) as completed
                FROM UserPlans
                WHERE plan_id = ? AND status = 'done'
            `,
                [plan_id]
            )

            if (isPlanCompleted[0].completed > 0) {
                const diamondAwarded = await db.getAllAsync(
                    `
                    SELECT COUNT(*) as count
                    FROM CupAwards
                    WHERE plan_id = ? AND cup_type = 'diamond'
                `,
                    [plan_id]
                )

                if (diamondAwarded[0].count === 0) {
                    await db.runAsync(
                        `
                        INSERT INTO CupAwards (plan_id, cup_type)
                        VALUES (?, 'diamond')
                    `,
                        [plan_id]
                    )

                    return {
                        success: true,
                        message:
                            "Incredible! 💎 You've achieved the Diamond Cup – the pinnacle of success! Keep being unstoppable!",
                        cupType,
                    }
                }
            }

            return {
                success: false,
                message: 'Không có cúp nào mới được thêm.',
            }
        } catch (error) {
            console.error('Error updating cup count for plan:', error)
            return {
                success: false,
                message: 'Đã xảy ra lỗi khi cập nhật cúp.',
            }
        }
    }

    const getCupCount = async () => {
        try {
            const result = await db.getAllAsync(
                `
                SELECT cup_type, COUNT(*) as count
                FROM CupAwards
                GROUP BY cup_type;
                `
            )

            const cupCount = {
                gold: 0,
                silver: 0,
                bronze: 0,
                diamond: 0,
            }

            result.forEach((row) => {
                cupCount[row.cup_type] = row.count
            })

            return {
                success: true,
                data: cupCount,
            }
        } catch (error) {
            console.error('Error fetching cup count:', error)
            return {
                success: false,
                message: 'Đã xảy ra lỗi khi lấy số lượng cúp.',
                error: error.message,
            }
        }
    }

    return {
        getUser,
        updateUserInfo,
        getUserByParams,
        getWorkoutStatis,
        getLongestStreak,
        getCupCount,
        updateCupCountForPlan,
    }
}

export default useUserQueries
