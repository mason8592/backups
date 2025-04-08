import createLogger from "./createLogger"

export const resultsLogger = createLogger('results')

const logBackupResults = (
    { source, destination, secondsElapsed, code }:
    { source: string, destination: string, secondsElapsed: string, code: number }
) => {
    if (code === 0) {
        resultsLogger.info(`[✅ in ${secondsElapsed}s] ${source} -> ${destination}`)
    } else {
        resultsLogger.warn(`[❌ in ${secondsElapsed}s] [CODE ${code}] ${source} -> ${destination}`)
    }
}

export default logBackupResults