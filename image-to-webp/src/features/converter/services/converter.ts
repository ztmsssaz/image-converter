import {invoke} from '@tauri-apps/api/core'

export type ConvertToWebPParams = {
  inputPath: string
  outputDirectory: string
  quality: number
}

export type ConversionResult = {
  input_path: string
  output_path: string
  original_size: number
  output_size: number
}

export async function convertToWebP(params: ConvertToWebPParams): Promise<ConversionResult> {
  return invoke<ConversionResult>('convert_to_webp', {
    inputPath: params.inputPath,
    outputDirectory: params.outputDirectory,
    quality: params.quality,
  })
}
