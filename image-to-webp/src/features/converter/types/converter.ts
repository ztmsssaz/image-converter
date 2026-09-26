export type ConversionStatus = 'pending' | 'converting' | 'completed' | 'failed'

export type ImageFile = {
  id: string
  name: string
  path: string
  size: number
  extension: string
  status: ConversionStatus
  outputPath?: string
  outputSize?: number
  error?: string
}
