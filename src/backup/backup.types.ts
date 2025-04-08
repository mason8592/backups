
export type Path = string

export interface BackupOptions {
    exclude?: Path[],
    include?: Path[]
}

export interface Backup {
    source: Path,
    destination: Path,
    options?: BackupOptions
}