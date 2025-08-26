import { useRef, useState } from 'react'
import { Input, ALL_FORMATS, BlobSource } from 'mediabunny'

import { Button } from './button'
import { VideoThumbnails } from './video-thumbnails'
import { FileMetadata } from './file-metadata'
import { AudioPlayer } from './audio-player'
import { Converter } from './converter'

export function Sidebar() {
  const [file, setFile] = useState<File>()
  const [input, setInput] = useState<Input<BlobSource>>()

  const [convertedFile, setConvertedFile] = useState<Blob>()

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const audio = file.type.includes('audio')
    const video = file.type.includes('video')
    if (!audio && !video) return // add feedback

    setFile(file)

    const input = new Input({
      formats: ALL_FORMATS,
      source: new BlobSource(file)
    })

    setInput(input)
  }

  return (
    <div className='w-[320px] h-[740px] flex flex-col justify-start bg-[#212121] py-12'>
      <Button
        onClick={() => fileInputRef.current?.click()}
        className='w-full h-[44px] before:bg-[#334b8f] before:shadow-[0_4px_0_#1e3883]'
      >
        Select media file
      </Button><input
        ref={fileInputRef}
        type='file'
        accept='video/*,video/x-matroska,audio/*'
        className='hidden'
        onChange={handleChange}
      />

      <VideoThumbnails input={input} />

      <FileMetadata file={file} input={input} />
      
      <AudioPlayer file={file} input={input} />
      
      <Converter input={input} setConvertedFile={setConvertedFile} />
    </div>
  )
}