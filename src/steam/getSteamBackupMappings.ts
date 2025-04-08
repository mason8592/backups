import { spawn } from 'child_process'
import { Backup } from '../backup/backup.types'
import { errorLogger } from '../logging/createLogger';
import retrieveSteamScreenshotPaths from './retrieveSteamScreenshotPaths';
import getSteamNameFromId from './getSteamNameFromId';


const getSteamBackupMappings = async (): Promise<Backup[]> => {
    const remoteFiles = await retrieveSteamScreenshotPaths('C:/Program Files (x86)/Steam/userdata/85870189/760/remote')
    
    const backupMappings: Backup[] = []

    for (const path of remoteFiles) {
        const gameId = path.match(/\d+$/)![0]

        // Try to get the steam name for the game ID
        const name = await getSteamNameFromId(gameId)

        // Skip this iteration if we couldn't get the name
        if (!name) {
            errorLogger.error(`failed to get Steam name for game ID: ${gameId}`)
            continue // Continue to the next file if name is not found
        }

        // Construct the backup mapping
        backupMappings.push({
            source: path + '/screenshots/',
            destination: `/mnt/storage/Backups/Screenshots/Steam/${name.replace(/[^a-zA-Z0-9]+/g, "")}`,
            options: { exclude: ['thumbnails/'] }
        })
    }

    return backupMappings
}

export default getSteamBackupMappings