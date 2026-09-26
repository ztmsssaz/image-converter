import {open} from '@tauri-apps/plugin-dialog'
import {stat} from '@tauri-apps/plugin-fs'
import {useEffect, useState} from 'react'

import type {ImageFile} from '../types/converter'
import {getFileExtension, isSupportedImage} from '../utils/file'

type DropZoneProps = {
  onFilesSelected: (files: ImageFile[]) => void
}

function getFileName(filePath: string): string {
  return filePath.split('/').pop() ?? filePath
}

async function createImageFiles(paths: string[]): Promise<ImageFile[]> {
  const files: ImageFile[] = []

  for (const path of paths) {
    if (!isSupportedImage(path)) {
      continue
    }

    try {
      const metadata = await stat(path)

      files.push({
        id: path,
        name: getFileName(path),
        path,
        size: metadata.size,
        extension: getFileExtension(path),
        status: 'pending',
      })
    } catch (error) {
      console.error(`Failed to read file metadata: ${path}`, error)
    }
  }

  return files
}

export function DropZone({onFilesSelected}: DropZoneProps): React.JSX.Element {
  const [isDragging, setIsDragging] = useState<boolean>(false)

  useEffect(() => {
    let unlisten: (() => void) | undefined

    async function setupDragDrop(): Promise<void> {
      const {getCurrentWebview} = await import('@tauri-apps/api/webview')

      unlisten = await getCurrentWebview().onDragDropEvent(async (event) => {
        if (event.payload.type === 'enter') {
          setIsDragging(true)
          return
        }

        if (event.payload.type === 'leave') {
          setIsDragging(false)
          return
        }

        if (event.payload.type !== 'drop') {
          return
        }

        setIsDragging(false)

        const files = await createImageFiles(event.payload.paths)

        onFilesSelected(files)
      })
    }

    void setupDragDrop()

    return () => {
      unlisten?.()
    }
  }, [onFilesSelected])

  async function selectFiles(): Promise<void> {
    const selected = await open({
      multiple: true,
      directory: false,
      filters: [
        {
          name: 'Images',
          extensions: ['jpg', 'jpeg', 'png', 'gif'],
        },
      ],
    })

    if (!selected) {
      return
    }

    const paths = Array.isArray(selected) ? selected : [selected]

    const files = await createImageFiles(paths)

    onFilesSelected(files)
  }

  return (
    <div
      className={[
        'flex min-h-80 w-full max-w-2xl flex-col items-center justify-center rounded-2xl border-2 border-dashed px-8 transition',
        isDragging
          ? 'border-blue-500 bg-blue-50'
          : 'border-zinc-300 bg-white hover:border-zinc-400',
      ].join(' ')}
    >
      <div className='flex flex-col items-center text-center'>
        <div className='mb-5 flex size-14 items-center justify-center rounded-xl bg-zinc-100'>
          <span className='text-2xl'>↑</span>
        </div>

        <h2 className='text-lg font-semibold text-zinc-950'>Drop images here</h2>

        <p className='mt-1 text-sm text-zinc-500'>or select images from your computer</p>

        <button
          type='button'
          className='mt-6 rounded-lg bg-zinc-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800'
          onClick={() => void selectFiles()}
        >
          Select Images
        </button>

        <p className='mt-4 text-xs text-zinc-400'>JPG, JPEG, PNG and GIF</p>
      </div>
    </div>
  )
}
