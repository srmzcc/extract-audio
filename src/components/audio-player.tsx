import { useEffect, useRef, useState } from 'react'
import type { BlobSource, Input } from 'mediabunny'

import { Button } from './button'

interface AudioPlayerProps {
  file?: File
  input?: Input<BlobSource>
}

export function AudioPlayer({ file, input }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isDisabled, setIsDisabled] = useState(true)

  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (!file || !audioRef.current) {
      setIsDisabled(true)
      return
    }

    if (!!input) {
      ;(async () => {
        const audioTrack = await input.getPrimaryAudioTrack()
        if (!audioTrack) {
          setIsDisabled(true)
          return
        }
      })()
    }

    setIsDisabled(false)

    const url = URL.createObjectURL(file)
    audioRef.current.src = url
    audioRef.current.currentTime = 0
    audioRef.current.pause()

    setIsPlaying(false)

    return () => {
      URL.revokeObjectURL(url)
    }
  }, [file, input])

  const togglePlay = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play().catch(err =>
        console.warn('Autoplay failed:', err)
      )
    }

    setIsPlaying(!isPlaying)
  }

  return (
    <>
      <Button
        onClick={togglePlay}
        className='w-full h-[44px] before:bg-[#334b8f] before:shadow-[0_4px_0_#1e3883]'
        disabled={isDisabled}
      >
        {isPlaying ? (
          <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'>
            <path
              fill='currentColor'
              d='M2 6c0-1.886 0-2.828.586-3.414S4.114 2 6 2s2.828 0 3.414.586S10 4.114 10 6v12c0 1.886 0 2.828-.586 3.414S7.886 22 6 22s-2.828 0-3.414-.586S2 19.886 2 18zm12 0c0-1.886 0-2.828.586-3.414S16.114 2 18 2s2.828 0 3.414.586S22 4.114 22 6v12c0 1.886 0 2.828-.586 3.414S19.886 22 18 22s-2.828 0-3.414-.586S14 19.886 14 18z'
            />
          </svg>
        ) : (
          <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'>
            <path
              fill='currentColor'
              d='M21.409 9.353a2.998 2.998 0 0 1 0 5.294L8.597 21.614C6.534 22.737 4 21.277 4 18.968V5.033c0-2.31 2.534-3.769 4.597-2.648z'
            />
          </svg>
        )}
      </Button>

      <audio ref={audioRef} className='hidden' />
    </>
  )
}
