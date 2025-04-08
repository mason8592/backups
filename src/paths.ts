import { Backup } from './backup/backup.types'

type Paths = {
    [key: string]: Backup[]
}

const paths: Paths = {
    "0 * * * *": [ // every hour on the hour
        { // backup user folder, but only the important folders
            source: "C:/Users/Mason/", 
            destination: "/mnt/storage/Backups/UserFolder",
            options: { 
                "include": [
                    "Documents/***",
                    "Music/***",
                    "Pictures/***",
                    "Saved Games/***",
                    "Scripts/***",
                    "Videos/***",
                    "VirtualBox VMs/***"
                ], 
                "exclude": ["*"]
            }
        }
    ],
    "10 * * * *": [ // 10 minutes past the hour
        { // automatically backup from the SSD to the ZFS pool
            source: "/mnt/storage/",
            destination: "/mnt/pool",
            options: {
                include: [
                    "Backups/***",
                    "Services/***"
                ],
                exclude: ["*"]
            }
        }
    ]
}

export default paths