import {open} from '@tauri-apps/plugin-dialog'
import {useState} from 'react'

import {DropZone} from './features/converter/components/drop-zone'
import {convertToWebP} from './features/converter/services/converter'
import type {ImageFile} from './features/converter/types/converter'
import {formatFileSize} from './features/converter/utils/file'

function App(): React.JSX.Element {
  const [files, setFiles] = useState<ImageFile[]>([])
  const [outputDirectory, setOutputDirectory] = useState<string | null>(null)
  const [quality, setQuality] = useState<number>(80)
  const [isConverting, setIsConverting] = useState<boolean>(false)

  const completedCount = files.filter((file) => file.status === 'completed').length

  const failedCount = files.filter((file) => file.status === 'failed').length

  const convertingCount = files.filter((file) => file.status === 'converting').length

  async function selectOutputDirectory(): Promise<void> {
    const selected = await open({
      directory: true,
      multiple: false,
    })

    if (typeof selected === 'string') {
      setOutputDirectory(selected)
    }
  }

  function addFiles(newFiles: ImageFile[]): void {
    setFiles((currentFiles) => {
      const existingPaths = new Set(currentFiles.map((file) => file.path))

      const uniqueFiles = newFiles.filter((file) => !existingPaths.has(file.path))

      return [...currentFiles, ...uniqueFiles]
    })
  }

  async function startConversion(): Promise<void> {
    if (!outputDirectory || files.length === 0 || isConverting) {
      return
    }

    setIsConverting(true)

    setFiles((currentFiles) =>
      currentFiles.map((file) => ({
        ...file,
        status: 'pending',
        error: undefined,
      })),
    )

    for (const file of files) {
      setFiles((currentFiles) =>
        currentFiles.map((currentFile) =>
          currentFile.id === file.id
            ? {
                ...currentFile,
                status: 'converting',
              }
            : currentFile,
        ),
      )

      try {
        const result = await convertToWebP({
          inputPath: file.path,
          outputDirectory,
          quality,
        })

        setFiles((currentFiles) =>
          currentFiles.map((currentFile) =>
            currentFile.id === file.id
              ? {
                  ...currentFile,
                  status: 'completed',
                  outputPath: result.output_path,
                  outputSize: result.output_size,
                }
              : currentFile,
          ),
        )
      } catch (error) {
        setFiles((currentFiles) =>
          currentFiles.map((currentFile) =>
            currentFile.id === file.id
              ? {
                  ...currentFile,
                  status: 'failed',
                  error: error instanceof Error ? error.message : String(error),
                }
              : currentFile,
          ),
        )
      }
    }

    setIsConverting(false)
  }

  return (
    <main className='flex min-h-screen w-screen flex-col bg-zinc-50'>
      <header className='border-b border-zinc-200 bg-white'>
        <div className='mx-auto flex h-16 w-full max-w-5xl items-center px-6'>
          <h1 className='text-base font-semibold text-zinc-950'>Image to WebP</h1>
        </div>
      </header>

      <section className='flex flex-1 flex-col items-center overflow-y-auto px-6 py-12'>
        <div className='mb-8 text-center'>
          <h2 className='text-3xl font-semibold tracking-tight text-zinc-950'>
            Convert images to WebP
          </h2>

          <p className='mt-2 text-sm text-zinc-500'>Fast, local and completely offline.</p>
        </div>

        <DropZone onFilesSelected={addFiles} />

        <div className='mt-6 flex w-full max-w-2xl items-center gap-3'>
          <button
            type='button'
            className='rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-800 transition hover:bg-zinc-50'
            onClick={() => void selectOutputDirectory()}
          >
            {outputDirectory ? 'Change Output Folder' : 'Select Output Folder'}
          </button>

          {outputDirectory && (
            <p className='min-w-0 truncate text-sm text-zinc-500'>{outputDirectory}</p>
          )}
        </div>

        <div className='mt-4 w-full max-w-2xl rounded-xl border border-zinc-200 bg-white p-4'>
          <div className='flex items-center justify-between'>
            <span className='text-sm font-medium text-zinc-800'>Quality</span>

            <span className='text-sm font-semibold text-zinc-950'>{quality}</span>
          </div>

          <input
            type='range'
            min={0}
            max={100}
            value={quality}
            disabled={isConverting}
            onChange={(event) => {
              setQuality(Number(event.target.value))
            }}
            className='mt-3 w-full'
          />
        </div>

        {files.length > 0 && (
          <div className='mt-8 w-full max-w-2xl overflow-hidden rounded-xl border border-zinc-200 bg-white'>
            <div className='flex items-center justify-between border-b border-zinc-200 px-4 py-3'>
              <div>
                <p className='text-sm font-semibold text-zinc-950'>Selected images</p>

                <p className='mt-0.5 text-xs text-zinc-500'>
                  {completedCount} / {files.length} completed
                  {convertingCount > 0 && ` · ${convertingCount} converting`}
                  {failedCount > 0 && ` · ${failedCount} failed`}
                </p>
              </div>

              <button
                type='button'
                disabled={isConverting}
                className='text-xs font-medium text-zinc-500 transition hover:text-zinc-950 disabled:cursor-not-allowed disabled:opacity-40'
                onClick={() => setFiles([])}
              >
                Clear all
              </button>
            </div>

            <div className='max-h-96 overflow-y-auto p-2'>
              {files.map((file) => (
                <div
                  key={file.id}
                  className='rounded-lg px-3 py-3 hover:bg-zinc-50'
                >
                  <div className='flex items-center justify-between gap-4'>
                    <div className='min-w-0 flex-1'>
                      <p className='truncate text-sm font-medium text-zinc-800'>{file.name}</p>

                      <p className='mt-0.5 text-xs text-zinc-400'>
                        {formatFileSize(file.size)}

                        {file.outputSize !== undefined && ` → ${formatFileSize(file.outputSize)}`}
                      </p>
                    </div>

                    <div className='flex shrink-0 items-center gap-3'>
                      <span className='text-xs font-medium uppercase text-zinc-400'>
                        {file.extension}
                      </span>

                      {file.status === 'pending' && (
                        <span className='text-xs text-zinc-400'>Pending</span>
                      )}

                      {file.status === 'converting' && (
                        <span className='text-xs font-medium text-blue-600'>Converting...</span>
                      )}

                      {file.status === 'completed' && (
                        <span className='text-xs font-medium text-green-600'>Completed</span>
                      )}

                      {file.status === 'failed' && (
                        <span
                          className='text-xs font-medium text-red-600'
                          title={file.error}
                        >
                          Failed
                        </span>
                      )}

                      <button
                        type='button'
                        disabled={isConverting}
                        className='text-xs text-zinc-400 transition hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-40'
                        onClick={() => {
                          setFiles((currentFiles) =>
                            currentFiles.filter((currentFile) => currentFile.id !== file.id),
                          )
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  {file.status === 'completed' && file.outputSize !== undefined && (
                    <p className='mt-2 text-xs text-green-600'>Saved to {file.outputPath}</p>
                  )}

                  {file.status === 'failed' && file.error && (
                    <p className='mt-2 truncate text-xs text-red-500'>{file.error}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          type='button'
          disabled={files.length === 0 || !outputDirectory || isConverting}
          className='mt-6 rounded-lg bg-zinc-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40'
          onClick={() => void startConversion()}
        >
          {isConverting ? `Converting ${completedCount} / ${files.length}` : 'Convert to WebP'}
        </button>
      </section>
    </main>
  )
}

export default App
