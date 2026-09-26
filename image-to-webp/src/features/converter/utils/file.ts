const SUPPORTED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif'] as const

export type SupportedExtension = (typeof SUPPORTED_EXTENSIONS)[number]

export function getFileExtension(filePath: string): string {
  const fileName = filePath.split('/').pop() ?? ''
  const extension = fileName.split('.').pop() ?? ''

  return extension.toLowerCase()
}

export function isSupportedImage(filePath: string): boolean {
  const extension = getFileExtension(filePath)

  return SUPPORTED_EXTENSIONS.includes(extension as SupportedExtension)
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`
  }

  if (bytes < 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`
}
