export interface IImageService {
  deleteOneByName: (name: string) => Promise<void>

  deleteManyByNames: (names: string[]) => Promise<PromiseSettledResult<void>[]>
}
