import { spawn } from "child_process";

const retrieveSteamScreenshotPaths = async (remotePath: string): Promise<string[]> => {
    return new Promise((resolve, reject) => {
        const sftp = spawn('sftp', [`mason@192.168.0.144`]);
        const folderList: string[] = []
    
        sftp.stdin.write(`ls /${remotePath.replace(/ /g, "\\ ")}\n`)
        sftp.stdin.end()
    
        sftp.stdout.on('data', (data) => {
            data.toString().split("\n").forEach((datum: string) => {
                const sanitizedPath = datum.replace(/ +$/gm, "")
                
                if (/\/C:\/Program Files \(x86\)\/Steam\/userdata\/\d+\/\d+\/remote\/\d+/gm.test(sanitizedPath)) {
                    folderList.push(sanitizedPath)
                }
            })
        })
        
        sftp.on('close', (code) => {
            if (code === 0) {
                resolve(folderList)
            } else {
                reject(code)
            }
        })
    })
}

export default retrieveSteamScreenshotPaths