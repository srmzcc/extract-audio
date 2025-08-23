import { useRef, useState } from 'react'
import { Input, ALL_FORMATS, BlobSource, WavOutputFormat, Output, BufferTarget, Conversion } from 'mediabunny'

import { Button } from './components/button'
import { VideoMetadata } from './components/video-metadata'
import { VideoThumbnails } from './components/video-thumbnails'
import { AudioPlayer } from './components/audio-player'
import { ProgressBar } from './components/progress-bar'

export function App() {
  const [videoFile, setVideoFile] = useState<File>()
  const [videoInput, setVideoInput] = useState<Input<BlobSource>>()
  const [progress, setProgress] = useState<number>(0)
  const [audioUrl, setAudioUrl] = useState<string>()

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setVideoFile(file)

    const input = new Input({
      formats: ALL_FORMATS,
      source: new BlobSource(file)
    })

    setVideoInput(input)

    ;(async () => {
      const output = new Output({
        format: new WavOutputFormat(),
        target: new BufferTarget()
      })

      const conversion = await Conversion.init({ input, output })
      conversion.onProgress = progress => setProgress(progress)
      await conversion.execute()

      const audioBuffer = output.target.buffer
      if (!audioBuffer) return

      const audioBlob = new Blob([audioBuffer], { type: 'audio/mp3' })
      const url = URL.createObjectURL(audioBlob)

      setAudioUrl(url)
    })()
  }
  
  return (
    <div className='w-screen h-screen flex justify-center items-center font-mono bg-[#161616]'>
      {/* component start */}
      <div className='w-[320px] h-[740px] flex flex-col justify-start bg-[#212121] py-12'>
        <div className='w-full aspect-video mb-5 overflow-hidden'>
          <VideoThumbnails input={videoInput} count={5} />
        </div>

        <div className='w-full flex flex-col justify-start px-5 space-y-7'>
          <VideoMetadata file={videoFile} input={videoInput} />

          <Button
            className='w-full h-[40px] before:bg-[#334b8f] before:shadow-[0_4px_0_#1e3883]'
            onClick={() => fileInputRef.current?.click()}
          >
            Select media file
          </Button>

          <div className='w-full flex flex-col justify-start space-y-2'>
            <AudioPlayer src={audioUrl} />

            <ProgressBar progress={progress} />
          </div>

          <input
            ref={fileInputRef}
            type='file'
            accept='video/*,video/x-matroska'
            className='hidden'
            onChange={handleChange}
          />
        </div>
      </div>
      {/* component end */}
    </div>
  )
}
