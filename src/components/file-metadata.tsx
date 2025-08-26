import { useEffect, useState } from 'react'
import type { BlobSource, Input }  from 'mediabunny'

interface FileMetadataProps {
  file?: File
  input?: Input<BlobSource>
}

interface Metadata {
  name: string
  type: string
  size: string
  duration: string
  audio: boolean
}

export function FileMetadata({ file, input }: FileMetadataProps) {
  const [metadata, setMetadata] = useState<Partial<Metadata>>({})

  useEffect(() => {
    if (!file) return

    const { name: rawName, type, size: rawSize } = file
    const name = rawName.replace(/\.[^/.]+$/, '')
    const size = (rawSize / 1_048_576).toFixed(2)

    setMetadata({ name, type, size })

    if (!input) return

    let isCancelled = false

    ;(async () => {
      try {
        const totalSeconds = await input.computeDuration()
        if (isCancelled) return

        const hours = Math.floor(totalSeconds / 3600)
        const minutes = Math.floor((totalSeconds % 3600) / 60)
        const seconds = Math.floor(totalSeconds % 60)

        let duration: string

        if (hours > 0) {
          duration =
            `${hours.toString().padStart(2, '0')}:` +
            `${minutes.toString().padStart(2, '0')}:` +
            `${seconds.toString().padStart(2, '0')}`
        } else {
          duration =
            `${minutes.toString().padStart(2, '0')}:` +
            `${seconds.toString().padStart(2, '0')}`
        }

        const audioTrack = await input.getPrimaryAudioTrack()
        if (isCancelled) return

        const audio = !!audioTrack

        setMetadata(prev => ({ ...prev, duration, audio }))
      } catch (err) {
        if (!isCancelled) {
          console.error('Error extracting metadata:', err)
        }
      }
    })()

    return () => {
      isCancelled = true
    }
  }, [file, input])

  const { name, type, size, duration, audio } = metadata

  return (
    <ul className={`text-[14px] ${file ? 'text-white' : 'text-[#333333] select-none'}`}>
      <li className='truncate'>
        {name ?? 'Your video title will appear here once uploaded'}
      </li>

      <li>
        {type ?? 'video/mp4'}
      </li>

      <li>
        {size ?? '12.34'} MB
      </li>

      <li>
        {duration ?? '59:59'}
      </li>

      <li
        className={
          typeof audio !== 'undefined'
            ? audio
              ? 'text-green-500'
              : 'text-red-500'
            : 'text-[#333333]'
        }
      >
        {audio ? 'audio' : 'no audio'}
      </li>
    </ul>
  )
}
