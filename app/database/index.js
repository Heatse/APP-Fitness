import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite'
import { loadSQLFileAndExecute } from './loadData'
import * as FileSystem from 'expo-file-system'
import { Suspense, useEffect } from 'react'
import SpashScreenView from '../../components/splash/Splash'

export const DatabaseProvider = ({ children }) => (
    <Suspense fallback={<SpashScreenView />}>
        <SQLiteProvider
            databaseName="fitness.db"
            onInit={loadSQLFileAndExecute}
        >
            {children}
        </SQLiteProvider>
    </Suspense>
)

export const useDatabase = () => useSQLiteContext()

export default DatabaseProvider
