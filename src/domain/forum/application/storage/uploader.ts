export interface UploadParams {
  fileName: string
  fileType: string
  body: Buffer
}

export abstract class Uploader {
  abstract upload({
    body,
    fileName,
    fileType,
  }: UploadParams): Promise<{ url: string }>
}
