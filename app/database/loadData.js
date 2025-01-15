import * as FileSystem from 'expo-file-system'
import { Asset } from 'expo-asset'
import * as Sharing from 'expo-sharing'

async function copySQLFileToDocumentDirectory() {
    // lấy file SQL từ thư mục assets
    const asset = Asset.fromModule(
        require('../../assets/database/fitness_v2.db.sql')
    )
    // thư mục cục bộ
    const destinationUri = FileSystem.documentDirectory + 'fitness_v2.db.sql'

    try {
        //Expo tải file từ assets
        //tải file SQL và đặt tại cache
        await asset.downloadAsync()

        const fileExists = await FileSystem.getInfoAsync(destinationUri)

        if (fileExists.exists) {
            console.log('Deleting old SQL file')
            await FileSystem.deleteAsync(destinationUri, { idempotent: true })
        }

        await FileSystem.copyAsync({
            from: asset.localUri,
            to: destinationUri,
        })
        console.log('SQL file copied to document directory:', destinationUri)

        return destinationUri
    } catch (error) {
        console.error('Error copying SQL file:', error)
        throw error
    }
}

export async function loadSQLFileAndExecute(db) {
    try {
        const checkTableExists = await db.getAllAsync(
            `SELECT name FROM sqlite_master WHERE type='table' AND name='User';`
        )

        if (checkTableExists.length > 0) {
            console.log('DB already exists, no need to import again.')
            return
        }

        const sqlFilePath = await copySQLFileToDocumentDirectory()
        const sqlContent = await FileSystem.readAsStringAsync(sqlFilePath)

        const statements = sqlContent
            .split(';')
            .map((stmt) => stmt.trim())
            .filter(Boolean)

        for (const statement of statements) {
            await db.execAsync(statement)
        }
    } catch (error) {
        console.error('Error executing SQL file:', error)
    }
}

export default loadSQLFileAndExecute

export const listDatabases = async () => {
    const files = await FileSystem.readDirectoryAsync(
        FileSystem.documentDirectory
    )
    // console.log('Files in app directory:', files)

    const sqliteDir = `${FileSystem.documentDirectory}SQLite/`
    try {
        const sqliteFiles = await FileSystem.readDirectoryAsync(sqliteDir)
        console.log('Files in SQLite directory:', sqliteFiles)
    } catch (error) {
        console.error('SQLite directory not found:', error)
    }
}

export const shareDatabase = async () => {
    try {
        const databasePath = `${FileSystem.documentDirectory}SQLite/fitness.db`
        const fileExists = await FileSystem.getInfoAsync(databasePath)

        if (fileExists.exists) {
            console.log('Database exists. Preparing to share...')
            await Sharing.shareAsync(databasePath, {
                mimeType: 'application/x-sqlite3',
                dialogTitle: 'Chia sẻ cơ sở dữ liệu SQLite',
            })
            console.log('Database shared successfully!')
        } else {
            console.log('Database file does not exist.')
        }
    } catch (error) {
        console.error('Error while sharing database:', error)
    }
}

export const deleteDb = async (dbName) => {
    try {
        // const dbName = 'fitness.db'
        const dbPath = `${FileSystem.documentDirectory}SQLite/fitness.db`
        // const walPath = `${FileSystem.documentDirectory}SQLite/fitness.db-wal`
        // const shmPath = `${FileSystem.documentDirectory}SQLite/fitness.db-shm`

        console.log('Database path:', dbPath)

        const fileExists = await FileSystem.getInfoAsync(dbPath)
        if (fileExists.exists) {
            await FileSystem.deleteAsync(dbPath)
            console.log('Database file deleted successfully!')
        } else {
            console.log('Database file does not exist.')
        }

        // const walExists = await FileSystem.getInfoAsync(walPath)
        // if (walExists.exists) {
        //     await FileSystem.deleteAsync(walPath)
        //     console.log('WAL file deleted successfully!')
        // } else {
        //     console.log('WAL file does not exist.')
        // }

        // const shmExists = await FileSystem.getInfoAsync(shmPath)
        // if (shmExists.exists) {
        //     await FileSystem.deleteAsync(shmPath)
        //     console.log('SHM file deleted successfully!')
        // } else {
        //     console.log('SHM file does not exist.')
        // }
    } catch (error) {
        console.error('Error deleting database files:', error)
    }
}
