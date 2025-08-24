import { useRef, useState } from 'react'
import { Input, ALL_FORMATS, BlobSource } from 'mediabunny'

import { Button } from './components/button'
import { Thumbnails } from './components/thumbnails'
import { Metadata } from './components/metadata'
import { AudioPlayer } from './components/audio-player'

export function App() {
  const [file, setFile] = useState<File>()
  const [input, setInput] = useState<Input<BlobSource>>()

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const audio = file.type.includes('audio')
    const video = file.type.includes('video')
    if (!audio && !video) return

    setFile(file)

    const input = new Input({
      formats: ALL_FORMATS,
      source: new BlobSource(file)
    })

    setInput(input)
  }
  
  return (
    <div className='w-screen h-screen flex justify-center items-center font-mono bg-[#161616]'>
      {/* component start */}
      <div className='w-[320px] h-[740px] flex flex-col justify-start bg-[#212121] py-12'>
        <Button
          onClick={() => fileInputRef.current?.click()}
          className='w-full h-[40px] before:bg-[#334b8f] before:shadow-[0_4px_0_#1e3883]'
        >
          Select media file
        </Button><input
          ref={fileInputRef}
          type='file'
          accept='video/*,video/x-matroska,audio/*'
          className='hidden'
          onChange={handleChange}
        />

        <Thumbnails input={input} />

        <Metadata file={file} input={input} />
        
        <AudioPlayer input={input} />
      </div>
      {/* component end */}
    </div>
  )
}
