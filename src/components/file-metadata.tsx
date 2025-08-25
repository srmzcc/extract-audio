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

    setMetadata({})

    const name = file.name.split('.').slice(0, -1).join('.')
    const type = file.type
    const size = (file.size / 1_048_576).toFixed(2)

    setMetadata(() => ({ name, type, size }))

    if (!input) return

    ;(async () => {
      const _duration = await input.computeDuration()
      const minutes = Math.trunc(_duration / 60)
      const seconds = Math.ceil(_duration % 60)
      const duration = `${minutes}:${seconds}`

      const audioTrack = await input.getPrimaryAudioTrack()
      const audio = !!audioTrack

      setMetadata(prev => ({ ...prev, duration, audio }))
    })()
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
