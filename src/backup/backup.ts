import { spawn } from 'child_process'
import normalizeWindowsPath from '../utils/normalizeWindowsPath'
import { errorLogger, newAdditionsLogger } from '../logging/createLogger'
import { Backup } from './backup.types'

const isWindowsPath = (path: string): boolean => {
    return /^\/?[A-Z]:\/.+/.test(path)
}
 
const backup = ({ source, destination, options }: Backup): Promise<{ source: string, destination: string, secondsElapsed: string, code: number }> => {
    const startDate = Date.now()
    const include = options?.include?.flatMap(pattern => ['--include', pattern]) || []
    const exclude = options?.exclude?.flatMap(pattern => ['--exclude', pattern]) || []

    const normalizedSource = isWindowsPath(source) ? `mason@192.168.0.144:${normalizeWindowsPath(source)}` : source
    const normalizedDestination = isWindowsPath(destination) ? `mason@192.168.0.144:${normalizeWindowsPath(destination)}` : destination

    const rsyncArgs = [
        '-as',
        '-e', 'ssh',
        '--info=NAME',
        ...include,
        ...exclude,
        normalizedSource,
        normalizedDestination
    ]

    return new Promise((resolve, reject) => {
        const rsync = spawn('rsync', rsyncArgs)
    
        rsync.stdout.on('data', (data) => {
            data = data.toString().trim()

            // filter out any rsync outputs that AREN'T file transfers
            if (/sent ([\d,]+) bytes/.test(data) || /total size is ([\d,]+)/.test(data) || data.startsWith('sending incremental file list') || data.startsWith('receiving incremental file list') || data === "" || data === "\n") return 

            newAdditionsLogger.info(data)
        })
        
        rsync.stderr.on('data', (data) => {
            errorLogger.error(data)
        })
    
        rsync.on('close', code => {
            const secondsElapsed = ((Date.now() - startDate) / 1000).toFixed(3)
            
            resolve({
                source: source,
                destination: destination,
                secondsElapsed: secondsElapsed,
                code: code!
            })
        })
    })
}

export default backup