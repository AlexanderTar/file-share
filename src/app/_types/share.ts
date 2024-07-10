import { File } from './file'

export interface ShareRequest {
  name: string
  files: File[]
  expiresAt: number
  password?: string
}

export interface Share {
  id: string
  name: string
  files: File[]
  expiresAt: number
}
