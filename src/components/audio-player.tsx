import { useEffect, useRef, useState } from 'react'
import {
  AudioBufferSink,
  BufferTarget,
  Conversion,
  Output,
  WavOutputFormat,
  type BlobSource,
  type Input
} from 'mediabunny'

import { Button } from './button'
import { ProgressBar } from './progress-bar'

export function AudioPlayer({ input }: { input?: Input<BlobSource> }) {
  const [audio, setAudio] = useState<string>()
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [volume, setVolume] = useState<number>(0.75)
  const [progress, setProgress] = useState<number>(0)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const sliderRef = useRef<HTMLDivElement | null>(null)
  const isDragging = useRef<boolean>(false)

  useEffect(() => {
    if (!input) return

    setAudio(undefined)

    ;(async () => {
      // const audioTrack = await input.getPrimaryAudioTrack()
      // if (!audioTrack) return

      // const sink = new AudioBufferSink(audioTrack)

      // for await (const { buffer, timestamp } of sink.buffers(5, 10)) {
      //   const node = audioContext.createBufferSource()
      //   node.buffer = buffer
      //   node.connect(audioContext.destination)
      //   node.start(timestamp)
      // }
      
      const output = new Output({
        format: new WavOutputFormat(),
        target: new BufferTarget()
      })

      const conversion = await Conversion.init({ input, output })
      conversion.onProgress = progress => setProgress(progress)
      await conversion.execute()

      const audioBuffer = output.target.buffer
      if (!audioBuffer) return

      const audioBlob = new Blob([audioBuffer], { type: 'audio/wav' })
      const url = URL.createObjectURL(audioBlob)

      setAudio(url)
    })()
  }, [input])

  const togglePlay = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }

    setIsPlaying(prev => !prev)
  }

  const updateVolume = (clientX: number) => {
    if (!sliderRef.current) return

    const rect = sliderRef.current.getBoundingClientRect()
    let newVolume = (clientX - rect.left) / rect.width
    
    newVolume = Math.max(0, Math.min(1, newVolume))
    setVolume(newVolume)

    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    isDragging.current = true
    updateVolume(e.clientX)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (isDragging.current) {
      updateVolume(e.clientX)
    }
  }

  const handleMouseUp = () => {
    isDragging.current = false
  }

  return (
    <div className='flex items-center space-x-3 bg-gray-100 rounded-2xl px-4 py-2 shadow-sm w-fit'>
      <Button
        className='w-[30px] h-[30px] aspect-square px-0 before:bg-[#334b8f] before:shadow-[0_4px_0_#1e3883]'
        onClick={togglePlay}
        disabled={!audio}
      >
        {isPlaying
          ? <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'>
              <path fill='currentColor' d='M2 6c0-1.886 0-2.828.586-3.414S4.114 2 6 2s2.828 0 3.414.586S10 4.114 10 6v12c0 1.886 0 2.828-.586 3.414S7.886 22 6 22s-2.828 0-3.414-.586S2 19.886 2 18zm12 0c0-1.886 0-2.828.586-3.414S16.114 2 18 2s2.828 0 3.414.586S22 4.114 22 6v12c0 1.886 0 2.828-.586 3.414S19.886 22 18 22s-2.828 0-3.414-.586S14 19.886 14 18z'/>
            </svg>
          : <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'>
              <path fill='currentColor' d='M21.409 9.353a2.998 2.998 0 0 1 0 5.294L8.597 21.614C6.534 22.737 4 21.277 4 18.968V5.033c0-2.31 2.534-3.769 4.597-2.648z'/>
            </svg>
        }
      </Button>

      <div
        ref={sliderRef}
        className='relative w-24 h-5 bg-gray-300 rounded-full cursor-pointer'
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          className='absolute top-0 left-0 h-full bg-blue-500 rounded-full'
          style={{ width: `${volume * 100}%` }}
        />

        <div
          className='absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-blue-500 rounded-full shadow'
          style={{ left: `${volume * 100}%`, transform: 'translate(-50%, -50%)' }}
        />
      </div>

      <audio
        ref={audioRef}
        src={audio}
        className='hidden'
      />

      <ProgressBar progress={progress} />
    </div>
  )
}
