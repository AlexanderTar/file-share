import { File } from './file'

export interface ShareFile {
  url: string
}

export interface ShareRequest {
  name: string
  files: ShareFile[]
  expiresAt: number
  password?: string
}

export interface Share {
  id: string
  name: string
  files: File[]
  expiresAt: number
}
