import fs from 'fs'
import path from 'path'
import winston from 'winston'
import 'winston-daily-rotate-file'

const centralTimeFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Chicago',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
})
  
const timestampFormat = winston.format.timestamp({
    format: () => centralTimeFormatter.format(new Date())
})

const createLogger = (filename: string) => {
    const transport = new winston.transports.DailyRotateFile({
        filename: `logs/%DATE%-${filename}.log`,
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '10m',
        maxFiles: '7d', // keep logs for 7 days
    })

    return winston.createLogger({
        level: 'info',
        format: winston.format.combine(
            timestampFormat,
            winston.format.printf(({ level, message, timestamp }) => {
                return `(${timestamp}) ${message}`
            })
        ),
        transports: [transport],
    })
}

export const newAdditionsLogger = createLogger('newfiles')
export const errorLogger = createLogger('error')

export default createLogger