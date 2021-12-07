export interface IFileService {
  deleteOneFromFs: (dir: string, fileName: string) => Promise<void>
}
