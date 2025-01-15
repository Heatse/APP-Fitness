import { useDatabase } from '../index'

export const usePlanQueries = () => {
    const db = useDatabase()

    const getAllPlans = async () => {
        try {
            const allRows = await db.getAllAsync('SELECT * FROM Plans')
            return allRows
        } catch (error) {
            console.error('Error fetching getAllPlans:', error)
            throw error
        }
    }

    const getDurationWeeks = async (plan_name) => {
        try {
            const result = await db.getAllAsync(
                `SELECT p.duration_weeks FROM Plans p WHERE lower(p.plan_name) = lower('${plan_name}')`
            )
            return result
        } catch (error) {
            console.log('Error fetching getDurationWeeks:', error)
        }
    }

    const getPlansbyTag = async (tag) => {
        try {
            const result = await db.getAllAsync(
                `SELECT * FROM Plans WHERE tag LIKE '%${tag}%'`
            )
            return result
        } catch (error) {
            console.error('Error fetching getPlansbyTag:', error)
            throw error
        }
    }

    const getPlanById = async (id) => {
        try {
            const result = await db.getAllAsync(
                `WITH RankedExercises AS (
                    SELECT DISTINCT e.image_url,          -- Dùng DISTINCT để loại bỏ trùng lặp ảnh
                        ps.plan_id,
                        ps.week_number,
                        e.id AS exercise_id,            -- Đảm bảo bài tập duy nhất trong từng tuần
                        ROW_NUMBER() OVER (PARTITION BY ps.plan_id, ps.week_number ORDER BY e.id) AS row_num
                    FROM Exercises e
                    JOIN PlanSchedule ps 
                        ON ps.list_exercise LIKE '%,' || e.id || ',%'     -- Kiểm tra chuỗi chứa ID bài tập
                        OR ps.list_exercise LIKE e.id || ',%' 
                        OR ps.list_exercise LIKE '%,' || e.id 
                        OR ps.list_exercise LIKE e.id    -- Trường hợp danh sách chỉ có một ID
                    WHERE ps.plan_id = ${id}                     -- Chỉ lấy kế hoạch với plan_id = 1
                )
                , CombinedExercises AS (
                    SELECT re.image_url,
                        re.plan_id,
                        re.week_number,
                        re.row_num,
                        ROW_NUMBER() OVER (PARTITION BY re.plan_id ORDER BY re.row_num) AS final_row_num
                    FROM RankedExercises re
                    WHERE re.week_number IN (2, 3)          -- Chỉ lấy ảnh từ tuần 2 và tuần 3
                )
                SELECT p.*,
                    -- Lấy 3 ảnh cho warm_up (tuần 1)
                    (SELECT GROUP_CONCAT(re.image_url)
                        FROM RankedExercises re
                        WHERE re.plan_id = p.plan_id AND re.week_number = 1 AND re.row_num <= 3) AS img_warm_up,

                    -- Lấy 3 ảnh cho main_workout (tuần 2 và tuần 3)
                    (SELECT GROUP_CONCAT(re.image_url)
                        FROM CombinedExercises re
                        WHERE re.plan_id = p.plan_id AND re.final_row_num <= 3) AS img_main_workout,

                    -- Lấy 3 ảnh cho light_session (tuần 3)
                    (SELECT GROUP_CONCAT(re.image_url)
                        FROM RankedExercises re
                        WHERE re.plan_id = p.plan_id AND (re.week_number = 3 OR re.week_number = 4) AND re.row_num <= 3) AS img_light_session
                FROM Plans p
                WHERE p.plan_id = ${id};
                `
            )

            if (result.length > 0) {
                return result[0]
            }
            return null
        } catch (error) {
            console.log('Error fetching getPlansbyTag:', error)
            return null
        }
    }

    const getPlanByName = async (name) => {
        try {
            const result = await db.getAllAsync(
                `SELECT * FROM Plans WHERE name LIKE '%${name}%'`
            )
            return result
        } catch (error) {
            console.log('Error fetching getPlansbyTag:', error)
            return null
        }
    }

    const getPlanSchedule = async (plan_id) => {
        try {
            const allRows = await db.getAllAsync(`WITH RECURSIVE SplitIDs AS (
                                                        SELECT 
                                                            ps.schedule_id,
                                                            ps.plan_id,
                                                            ps.week_number,
                                                            ps.day_of_week,
                                                            ps.list_exercise,
                                                            CAST(SUBSTR(ps.list_exercise, 1, INSTR(ps.list_exercise || ',', ',') - 1) AS INTEGER) AS exercise_id,
                                                            SUBSTR(ps.list_exercise, INSTR(ps.list_exercise || ',', ',') + 1) AS remaining_exercises,
                                                            1 AS position
                                                        FROM 
                                                            PlanSchedule ps
                                                        WHERE
                                                            ps.plan_id = ${plan_id} AND ps.week_number = 1 

                                                        UNION ALL

                                                        SELECT 
                                                            schedule_id,
                                                            plan_id,
                                                            week_number,
                                                            day_of_week,
                                                            list_exercise,
                                                            CAST(SUBSTR(remaining_exercises, 1, INSTR(remaining_exercises || ',', ',') - 1) AS INTEGER) AS exercise_id,
                                                            SUBSTR(remaining_exercises, INSTR(remaining_exercises || ',', ',') + 1) AS remaining_exercises,
                                                            position + 1
                                                        FROM 
                                                            SplitIDs
                                                        WHERE 
                                                            remaining_exercises <> ''
                                                    )

                                                    SELECT 
                                                        s.schedule_id,
                                                        s.plan_id,
                                                        s.week_number,
                                                        s.day_of_week,
                                                        GROUP_CONCAT(e.ex_name, ', ') AS list_exercise_details
                                                        
                                                    FROM 
                                                        SplitIDs s
                                                    JOIN 
                                                        Exercises e ON s.exercise_id = e.id
                                                    GROUP BY 
                                                        s.schedule_id, s.plan_id, s.week_number, s.day_of_week
                                                    ORDER BY 
                                                        s.position;



        `)
            return allRows
        } catch (error) {
            console.error('Error fetching plans:', error)
            throw error
        }
    }

    const getTotalDaysInEachWeekForPlan = async (plan_id) => {
        try {
            const result = await db.getAllAsync(`
                SELECT 
                    COUNT(DISTINCT ps.week_number) AS total_weeks,  -- Total weeks
                    COUNT(DISTINCT ps.day_of_week) AS total_days_in_week,  -- Total days in a week
                    COUNT(ps.day_of_week) AS total_days  -- Total days for the plan
                FROM 
                    PlanSchedule ps
                WHERE 
                    ps.plan_id = ${plan_id};
            `)

            return result
        } catch (error) {
            console.error(
                'Error fetching total weeks, total days per week, and total days for plan:',
                error
            )
            throw error
        }
    }

    const getListPlansDone = async () => {
        try {
            const result =
                await db.getAllAsync(`SELECT p.plan_id, p.calories, p.duration_minute, p.duration_weeks, p.plan_name, p.image_url FROM Plans p 
                                                    JOIN UserPlans up on p.plan_id = up.plan_id
                                                    WHERE up.status = 'done'`)
            return result
        } catch (error) {
            console.log('Error fetching getPlansDone:', error)
        }
    }

    const getListPlansActive = async () => {
        try {
            const result = await db.getAllAsync(`WITH LatestProgress AS (
                SELECT 
                    up.plan_id,
                    upp.user_plan_id,
                    upp.week_number,
                    upp.day_number,
                    ROW_NUMBER() OVER (
                        PARTITION BY up.plan_id 
                        ORDER BY upp.week_number DESC, upp.day_number DESC
                    ) as rn
                FROM UserPlans up
                JOIN UserPlanProgress upp ON upp.user_plan_id = up.user_plan_id
                WHERE up.status = 'active'
            )
            SELECT 
                p.plan_id, 
                p.plan_name, 
                p.duration_weeks, 
				p.image_url,
                lp.day_number, 
                lp.week_number
            FROM LatestProgress lp
                JOIN Plans p ON p.plan_id = lp.plan_id
                WHERE lp.rn = 1`)
            return result
        } catch (error) {
            console.log('Error fetching getPlansActive:', error)
        }
    }

    const getListPlansActiveDetail = async () => {
        try {
            const result = await db.getAllAsync(`
                WITH LatestProgress AS (
                    SELECT 
                        user_plan_id,
                        MAX(date) as latest_date,
                        week_number as latest_week,
                        day_number as latest_day
                    FROM UserPlanProgress
                    GROUP BY user_plan_id
                )
                SELECT 
                    up.*,
                    p.*,
                    lp.latest_date,
                    lp.latest_week,
                    lp.latest_day
                FROM UserPlans up 
                JOIN Plans p ON up.plan_id = p.plan_id
                LEFT JOIN LatestProgress lp ON up.user_plan_id = lp.user_plan_id
                WHERE up.status = 'active'
                ORDER BY lp.latest_date DESC
                LIMIT 5
            `)
            return result
        } catch (error) {
            console.log('Lỗi khi lấy chi tiết plan đang hoạt động:', error)
            return []
        }
    }

    const deleteUserPlan = async (plan_name) => {
        try {
            const plan = await db.getAllAsync(
                'SELECT plan_id FROM Plans WHERE lower(plan_name) = lower(?)',
                [plan_name]
            )

            if (!plan.length) {
                return {
                    success: false,
                    message: 'This plan could not be found',
                    deletedCount: 0,
                }
            }

            const result = await db.runAsync(
                'DELETE FROM UserPlans WHERE plan_id IN (SELECT plan_id FROM Plans WHERE lower(plan_name) = lower(?))',
                [plan_name]
            )

            return {
                success: true,
                message: 'Delete plan successfully',
                deletedCount: result.changes,
            }
        } catch (error) {
            console.error('Error while deleting plan:', error)
            return {
                success: false,
                message: 'An error occurred while deleting the plan.',
                error: error.message,
            }
        }
    }

    const resetUserPlanProgress = async (plan_name) => {
        try {
            const planExists = await db.getAllAsync(
                `SELECT 1 FROM Plans WHERE lower(plan_name) = lower(?)`,
                [plan_name]
            )

            if (!planExists.length) {
                return {
                    success: false,
                    message: 'Plan not found',
                }
            }

            // Xóa tiến trình người dùng
            const deleteResult = await db.runAsync(
                `DELETE FROM UserPlanProgress 
                WHERE user_plan_id IN
                    (SELECT up.user_plan_id FROM UserPlans up
                    JOIN Plans p ON p.plan_id = up.plan_id
                    WHERE lower(p.plan_name) = lower(?));`,
                [plan_name]
            )

            // Chèn lại tiến trình người dùng
            const insertResult = await db.runAsync(
                `INSERT INTO UserPlanProgress (user_plan_id, day_number, week_number)
                VALUES (
                    (SELECT up.user_plan_id
                    FROM UserPlans up
                    JOIN Plans p ON p.plan_id = up.plan_id
                    WHERE lower(p.plan_name) = lower(?)),
                    0,
                    0
                );`,
                [plan_name]
            )

            return {
                success: true,
                message: 'Plan progress has been reset successfully',
                changes: deleteResult.changes + insertResult.changes,
            }
        } catch (error) {
            console.log('Error fetching resetUserPlanProgress:', error)
            return {
                success: false,
                message: 'An error occurred while resetting plan progress',
                error: error.message,
            }
        }
    }

    const getDaySchedulePlan = async (plan_id) => {
        try {
            const planInfo = await db.getAllAsync(`
                SELECT date_started 
                FROM UserPlans 
                WHERE plan_id = ${plan_id}
            `)

            const dateStarted =
                planInfo.length > 0 ? planInfo[0].date_started : null

            const result = await db.getAllAsync(`
                SELECT upp.*
                FROM UserPlanProgress upp
                WHERE user_plan_id = (
                    SELECT user_plan_id
                    FROM UserPlans
                    WHERE plan_id = ${plan_id}    
                )
                ORDER BY week_number ASC, day_number ASC
            `)

            return {
                date_started: dateStarted,
                schedule: result,
            }
        } catch (error) {
            console.log('Error fetching getSchedulePlan:', error)
        }
    }

    const addUserPlan = async (plan_name) => {
        try {
            const planExists = await db.getAllAsync(
                'SELECT 1 FROM Plans WHERE lower(plan_name) = lower(?)',
                [plan_name]
            )

            if (!planExists.length) {
                return {
                    success: false,
                    message: 'Plan not found',
                }
            }

            // Thực hiện INSERT đầu tiên và lấy user_plan_id

            const insertUserPlan = await db.runAsync(
                `INSERT INTO UserPlans (plan_id, date_started) 
                 VALUES (
                     (SELECT plan_id FROM Plans WHERE lower(plan_name) = lower(?)), 
                     datetime('now')
                 );`,
                [plan_name]
            )

            // Lấy user_plan_id vừa được tạo
            const newUserPlan = await db.getAllAsync(
                `SELECT up.user_plan_id
                 FROM UserPlans up
                 JOIN Plans p ON p.plan_id = up.plan_id
                 WHERE lower(p.plan_name) = lower(?)
                 ORDER BY up.user_plan_id DESC LIMIT 1`,
                [plan_name]
            )

            if (newUserPlan.length > 0) {
                // Thực hiện INSERT thứ hai với user_plan_id đã biết
                await db.runAsync(
                    `INSERT INTO UserPlanProgress (user_plan_id, day_number, week_number, date)
                     VALUES (?, 0, 0,  datetime('now'))`,
                    [newUserPlan[0].user_plan_id]
                )
            }

            return {
                success: true,
                message: 'Plan added successfully',
                changes: insertUserPlan.changes,
            }
        } catch (error) {
            console.log('Error fetching addUserPlan:', error)
            return {
                success: false,
                message: 'Đã xảy ra lỗi khi thêm kế hoạch',
                error: error.message,
            }
        }
    }

    const addUserPlanProgress = async (plan_name, day_number, week_number) => {
        try {
            // Kiểm tra record tồn tại
            const existingRecord = await db.getAllAsync(
                `SELECT 1 
                FROM UserPlanProgress upp
                JOIN UserPlans up ON up.user_plan_id = upp.user_plan_id 
                JOIN Plans p ON p.plan_id = up.plan_id
                WHERE lower(p.plan_name) = lower(?)
                AND upp.day_number = ?
                AND upp.week_number = ?`,
                [plan_name, day_number, week_number]
            )

            if (existingRecord.length > 0) {
                return {
                    success: false,
                    message: 'Bạn đã check-in cho ngày hôm nay',
                }
            }

            await db.runAsync(
                `DELETE FROM UserPlanProgress 
                WHERE user_plan_id IN (
                    SELECT up.user_plan_id FROM UserPlans up
                    JOIN Plans p ON p.plan_id = up.plan_id
                    WHERE lower(p.plan_name) = lower(?)
                )
                AND day_number = 0 
                AND week_number = 0`,
                [plan_name]
            )

            const result = await db.runAsync(
                `INSERT INTO UserPlanProgress (user_plan_id, week_number, day_number, date) 
                VALUES (
                    (SELECT up.user_plan_id
                    FROM UserPlans up
                    JOIN Plans p ON p.plan_id = up.plan_id
                    WHERE lower(p.plan_name) = lower(?)
                    ),
                    ?,
                    ?,
                    datetime('now', 'localtime')
                )`,
                [plan_name, week_number, day_number]
            )

            // Lấy thông tin kế hoạch
            const planDetails = await db.getAllAsync(
                `SELECT duration_weeks FROM Plans WHERE lower(plan_name) = lower(?)`,
                [plan_name]
            )
            const totalDays = planDetails[0].duration_weeks * 7

            // Kiểm tra xem đã điểm danh đầy đủ tất cả các ngày trong kế hoạch chưa
            const checkInRecords = await db.getAllAsync(
                `SELECT COUNT(day_number) as check_in_count
                FROM UserPlanProgress upp
                JOIN UserPlans up ON up.user_plan_id = upp.user_plan_id 
                JOIN Plans p ON p.plan_id = up.plan_id
                WHERE lower(p.plan_name) = lower(?)`,
                [plan_name]
            )

            if (checkInRecords[0].check_in_count === totalDays) {
                await db.runAsync(
                    `UPDATE UserPlans 
                    SET status = 'done', date_completed = datetime('now', 'localtime')
                    WHERE plan_id = (SELECT plan_id FROM Plans WHERE lower(plan_name) = lower(?))`,
                    [plan_name]
                )
            }

            if (!result || result.changes === 0) {
                throw new Error('Không thể thêm tiến trình')
            }

            return {
                success: true,
                message: 'Check-in thành công',
                changes: result.changes,
            }
        } catch (error) {
            console.error('Lỗi khi thêm tiến trình:', error)
            return {
                success: false,
                message: 'Đã xảy ra lỗi khi cập nhật tiến trình',
                error: error.message,
            }
        }
    }

    const getPlanScheduleByDay = async (plan_id, week_number, day_number) => {
        try {
            const result = await db.getAllAsync(`WITH RECURSIVE SplitIDs AS (
                                                        SELECT 
                                                            ps.schedule_id,
                                                            ps.plan_id,
                                                            ps.week_number,
                                                            ps.day_of_week,
                                                            ps.list_exercise,
                                                            CAST(SUBSTR(ps.list_exercise, 1, INSTR(ps.list_exercise || ',', ',') - 1) AS INTEGER) AS exercise_id,
                                                            SUBSTR(ps.list_exercise, INSTR(ps.list_exercise || ',', ',') + 1) AS remaining_exercises,
                                                            1 AS position
                                                        FROM 
                                                            PlanSchedule ps
                                                        WHERE
                                                            ps.plan_id = ${plan_id} AND ps.week_number = ${week_number} AND ps.day_of_week = ${day_number}

                                                        UNION ALL

                                                        SELECT 
                                                            schedule_id,
                                                            plan_id,
                                                            week_number,
                                                            day_of_week,
                                                            list_exercise,
                                                            CAST(SUBSTR(remaining_exercises, 1, INSTR(remaining_exercises || ',', ',') - 1) AS INTEGER) AS exercise_id,
                                                            SUBSTR(remaining_exercises, INSTR(remaining_exercises || ',', ',') + 1) AS remaining_exercises,
                                                            position + 1
                                                        FROM 
                                                            SplitIDs
                                                        WHERE 
                                                            remaining_exercises <> ''
                                                    )

                                                    SELECT 
                                                        s.schedule_id,
                                                        s.plan_id,
                                                        s.week_number,
                                                        s.day_of_week,
                                                        GROUP_CONCAT(e.ex_name, ', ') AS list_exercise_details
                                                        
                                                    FROM 
                                                        SplitIDs s
                                                    JOIN 
                                                        Exercises e ON s.exercise_id = e.id
                                                    GROUP BY 
                                                        s.schedule_id, s.plan_id, s.week_number, s.day_of_week
                                                    ORDER BY 
                                                        s.position;`)
            return result
        } catch (error) {
            console.log('Error fetching getPlanScheduleByDay:', error)
        }
    }

    const getPlanScheduleByDay2 = async (plan_id, week_number, day_number) => {
        try {
            const result = await db.getAllAsync(`WITH RECURSIVE SplitIDs AS (
	SELECT 
		ps.schedule_id,
		ps.plan_id,
		ps.week_number,
		ps.day_of_week,
		ps.list_exercise,
		ps.second_list,
		ps.rep_list,
		CAST(SUBSTR(ps.list_exercise, 1, INSTR(ps.list_exercise || ',', ',') - 1) AS INTEGER) AS exercise_id,
		SUBSTR(ps.list_exercise, INSTR(ps.list_exercise || ',', ',') + 1) AS remaining_exercises,
		1 AS position
	FROM 
		PlanSchedule ps
	WHERE
		ps.plan_id = ${plan_id} AND ps.week_number = ${week_number} AND ps.day_of_week = ${day_number}

	UNION ALL

	SELECT 
		schedule_id,
		plan_id,
		week_number,
		day_of_week,
		list_exercise,
		second_list,
		rep_list,
		CAST(SUBSTR(remaining_exercises, 1, INSTR(remaining_exercises || ',', ',') - 1) AS INTEGER) AS exercise_id,
		SUBSTR(remaining_exercises, INSTR(remaining_exercises || ',', ',') + 1) AS remaining_exercises,
		position + 1
	FROM 
		SplitIDs
	WHERE 
		remaining_exercises <> ''
	)

	SELECT 
		s.schedule_id,
		s.plan_id,
		s.week_number,
		s.day_of_week,
		s.second_list,
		s.rep_list,
		GROUP_CONCAT(e.ex_name, ', ') AS list_exercise_details,
		GROUP_CONCAT(e.image_url, ', ') AS list_exercise_images,
		GROUP_CONCAT(e.video_url, ', ') AS list_exercise_video
		
	FROM 
		SplitIDs s
	JOIN 
		Exercises e ON s.exercise_id = e.id
	GROUP BY 
		s.schedule_id, s.plan_id, s.week_number, s.day_of_week, s.second_list, s.rep_list
	ORDER BY 
		s.position;`)
            return result
        } catch (error) {
            console.log('Error fetching getPlanScheduleByDay:', error)
        }
    }

    const getCurrentDayInPlan = async (plan_id) => {
        try {
            const result = await db.getAllAsync(`
                SELECT upp.*
                FROM UserPlanProgress upp
                WHERE user_plan_id = (
                    SELECT user_plan_id
                    FROM UserPlans
                    WHERE plan_id = ${plan_id}  
                )
                ORDER BY week_number DESC, day_number DESC
                LIMIT 1
            `)
            return result[0]
        } catch (error) {
            console.error('Error fetching getCurrentDayInPlan:', error)
            return 0
        }
    }

    const getAllUserPlanProgress = async () => {
        try {
            const result = await db.getAllAsync(`
                SELECT * 
                FROM UserPlanProgress
                ORDER BY week_number ASC, day_number ASC
            `)
            return result
        } catch (error) {
            console.error('Error fetching getAllUserPlanProgress:', error)
            return []
        }
    }

    const getAllUserPlans = async () => {
        try {
            const result = await db.getAllAsync(`
                SELECT * 
                FROM UserPlans

            `)
            return result
        } catch (error) {
            console.error('Error fetching getAllUserPlanProgress:', error)
            return []
        }
    }

    const getRecommendedPlan = async () => {
        try {
            const [user] = await db.getAllAsync(
                `SELECT gender, age, type_body, weight, height, goal FROM User LIMIT 1`
            )

            if (!user) {
                return {
                    success: false,
                    message: 'Không tìm thấy thông tin người dùng',
                    data: null,
                }
            }

            const bmi = calculateBMI(user.weight, user.height)

            const result = await db.getAllAsync(
                `
              SELECT p.*, (
                CASE 
                    WHEN ? < 30 AND p.level = 'Beginner' THEN 2
                    WHEN ? BETWEEN 30 AND 40 AND p.level = 'Intermediate' THEN 3
                    WHEN ? BETWEEN 20 AND 35 AND p.level = 'Advanced' THEN 4
                    ELSE 0
                END * 2
                +
                CASE 
                    WHEN ? < 18.5 AND p.tag LIKE '%Gain Muscle%' THEN 3
                    WHEN ? > 25 AND p.tag LIKE '%Lose Fat%' THEN 3
                    WHEN ? BETWEEN 18.5 AND 25 AND p.tag LIKE '%Get Fitter%' THEN 2
                    ELSE 1
                END * 1.5
                +
                CASE 
                    WHEN ? = 'Male' AND p.tag LIKE '%Gain Muscle%' THEN 3
                    WHEN ? = 'Female' AND p.tag LIKE '%Get Fitter%' THEN 2
                    ELSE 1
                END
                +
                CASE
                    WHEN ? = 'slim' AND p.tag LIKE '%Gain Muscle%' THEN 3
                    WHEN ? = 'heavy' AND p.tag LIKE '%Lose Fat%' THEN 3
                    ELSE 1
                END
                +
                CASE
                    WHEN ? = 'Lose Weight' AND p.tag = 'Lose Fat' THEN 10
                    WHEN ? = 'Gain Muscle Mass' AND p.tag = 'Gain Muscle' THEN 10
                    WHEN ? = 'Get Shredded' AND p.tag = 'Get Fitter' THEN 10
                    ELSE 5
                END
            ) as match_score
            FROM Plans p
            ORDER BY match_score DESC, duration_weeks ASC
            LIMIT 2

            `,
                [
                    user.age,
                    user.age,
                    user.age,
                    bmi,
                    bmi,
                    user.gender,
                    user.type_body,
                    user.goal,
                    user.goal,
                ]
            )

            if (!result.length) {
                return {
                    success: false,
                    message: 'Không tìm thấy kế hoạch phù hợp',
                    data: null,
                }
            }

            return {
                success: true,
                message: 'Đã tìm thấy kế hoạch phù hợp nhất',
                data: result,
            }
        } catch (error) {
            console.error('Error fetching recommended plan:', error)
            return {
                success: false,
                message: 'Đã xảy ra lỗi khi tìm kế hoạch phù hợp',
                error: error.message,
            }
        }
    }

    const calculateBMI = (weight, height) => {
        const heightInMeters = height / 100
        return weight / (heightInMeters * heightInMeters)
    }

    const getHistoryUser = async (startDate, endDate) => {
        try {
            const result = await db.getAllAsync(
                `
                SELECT DISTINCT strftime('%Y-%m-%d', date) as formatted_date 
                FROM UserPlanProgress
                WHERE date >= ? AND date <= ?
                ORDER BY date ASC`,
                [startDate, endDate]
            )

            // Chuyển đổi kết quả thành mảng chỉ chứa các ngày
            return result.map((row) => row.formatted_date)
        } catch (error) {
            console.error('Lỗi khi lấy lịch sử người dùng:', error)
            return []
        }
    }

    const markPlanAsCompleted = async (plan_name) => {
        try {
            const planExists = await db.getAllAsync(
                'SELECT 1 FROM Plans WHERE lower(plan_name) = lower(?)',
                [plan_name]
            )

            if (!planExists.length) {
                return {
                    success: false,
                    message: 'Plan không tồn tại',
                }
            }

            const result = await db.runAsync(
                `UPDATE UserPlans 
                 SET status = 'done',
                     date_completed = datetime('now')
                 WHERE plan_id IN (
                     SELECT plan_id 
                     FROM Plans 
                     WHERE lower(plan_name) = lower(?)
                 )`,
                [plan_name]
            )

            return {
                success: true,
                message: 'Plan đã được đánh dấu hoàn thành',
                changes: result.changes,
            }
        } catch (error) {
            console.log('Error marking plan as completed:', error)
            return {
                success: false,
                message: 'Đã xảy ra lỗi khi đánh dấu plan hoàn thành',
                error: error.message,
            }
        }
    }

    // lấy tổng thời gian tập và tổng calor trong một buổi tập cụ thể
    const getWorkoutStatsByPlan = async (plan_id, week_number, day_number) => {
        try {
            const result = await db.getAllAsync(
                `
                SELECT 
                    SUM(ps.second_list) AS total_seconds,
                    SUM(ps.second_list * e.calories_per_m / 60.0) AS total_calories
                FROM 
                    PlanSchedule ps
                JOIN 
                    Exercises e ON ps.list_exercise LIKE '%' || e.id || '%'
                WHERE 
                    ps.plan_id = ? AND 
                    ps.week_number = ? AND 
                    ps.day_of_week = ?
            `,
                [plan_id, week_number, day_number]
            )

            return {
                success: true,
                data: {
                    total_seconds: result[0].total_seconds || 0,
                    total_calories: result[0].total_calories || 0,
                },
            }
        } catch (error) {
            console.error('Error fetching workout stats by plan:', error)
            return {
                success: false,
                message: 'Đã xảy ra lỗi khi lấy thống kê tập luyện',
                error: error.message,
            }
        }
    }

    return {
        getAllPlans,
        getDurationWeeks,
        getPlanSchedule,
        getTotalDaysInEachWeekForPlan,
        getPlansbyTag,
        getPlanById,
        getPlanByName,
        getListPlansDone,
        getListPlansActive,
        deleteUserPlan,
        resetUserPlanProgress,
        getDaySchedulePlan,
        addUserPlan,
        addUserPlanProgress,
        getPlanScheduleByDay,
        getPlanScheduleByDay2,
        getCurrentDayInPlan,
        getAllUserPlanProgress,
        getAllUserPlans,
        getRecommendedPlan,
        getHistoryUser,
        getListPlansActiveDetail,
        markPlanAsCompleted,
        getWorkoutStatsByPlan,
    }
}

export default usePlanQueries
