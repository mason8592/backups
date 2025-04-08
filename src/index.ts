import cron from 'node-cron'
import getSteamBackupMappings from './steam/getSteamBackupMappings'
import backup from './backup/backup'
import paths from './paths'
import delay from './utils/delay'
import logBackupResults from './logging/logBackupResults'

// get a list of cron expressions
Object.keys(paths).forEach(key => {
    paths[key].forEach(backupMap => {
        // for each cron expression, create a new cron job
        cron.schedule(key, () => {
            backup(backupMap).then(logBackupResults)
        })
    })
})

// special case for Steam backups, run every 6 hours
cron.schedule('30 * * * *', () => {
    getSteamBackupMappings().then(async (backupList) => {
        for (const backupInstance of backupList) {
            backup(backupInstance).then(logBackupResults)

            await delay(200)
        }
    })    
})