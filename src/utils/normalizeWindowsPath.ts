/**
 * Normalize a Windows path
 * @param path Windows path e.g. `C:/Users/Mason`
 * @returns Normalized path for use with rsync e.g. `/c/Users/Mason`
 */
const normalizeWindowsPath = (path: string): string => {
    // Replace backslashes with forward slashes
    path = path.replace(/\\/g, '/');

    if (!path.startsWith('/')) {
        path = '/' + path;
    }

    return path.replace(/^\/([A-Z]):/i, (_, driveLetter) => `/` + driveLetter.toLowerCase())
}

export default normalizeWindowsPath