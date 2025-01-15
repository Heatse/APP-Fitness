import { useDatabase } from '../index'

export const useExerciseQueries = () => {
    const db = useDatabase()

    const getExercisesByCategory = async (category) => {
        try {
            const query = `
                SELECT id, image_url, ex_name, muscle_group
                FROM Exercises
                WHERE LOWER(category) LIKE '%' || LOWER(:category) || '%';
            `

            const result = await db.getAllAsync(query, {
                ':category': category,
            })

            return result
        } catch (error) {
            console.error('Error fetching exercises by category:', error)
            throw error
        }
    }

    const getExerciseDetail = async (id) => {
        try {
            const rs = await db.getAllAsync(
                `SELECT *
                FROM Exercises
                WHERE id = ?;
                `,
                [id]
            )
            return rs
        } catch (error) {
            console.error('Error fetching getExercisesByCategory:', error)
            throw error
        }
    }

    return { getExercisesByCategory, getExerciseDetail }
}

export default useExerciseQueries
