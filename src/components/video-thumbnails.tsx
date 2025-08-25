import { useEffect, useState } from 'react'
import {
  CanvasSink,
  type BlobSource,
  type Input
}  from 'mediabunny'

import { Carousel } from './carousel'

interface VideoThumbnailsProps {
  input?: Input<BlobSource>
  count?: number
}

export function VideoThumbnails({ input, count = 5 }: VideoThumbnailsProps) {
  const [thumbnails, setThumbnails] = useState<string[]>([])

  useEffect(() => {
    if (!input) return

    let cancelled = false

    setThumbnails([])

    ;(async () => {
      try {
        const videoTrack = await input.getPrimaryVideoTrack()
        if (!videoTrack) return

        const decodable = await videoTrack.canDecode()
        if (!decodable) return // add feedback

        const startTimestamp = await videoTrack.getFirstTimestamp()
        const endTimestamp = await videoTrack.computeDuration()

        const timestamps = Array.from(
          { length: count },
          (_, i) => startTimestamp + i * (endTimestamp - startTimestamp) / count
        )

        const sink = new CanvasSink(videoTrack, {
          width: 320,
          height: 180,
          fit: 'contain'
        })

        const firstWrappedCanvas = await sink.getCanvas(0)
        if (!!firstWrappedCanvas) { 
          const canvasElement = firstWrappedCanvas.canvas as HTMLCanvasElement
          const url = canvasElement.toDataURL()
          setThumbnails([url])

          timestamps.shift()
        }

        const urls: string[] = []
        for await (const wrappedCanvas of sink.canvasesAtTimestamps(timestamps)) {
          if (cancelled) break

          if (!!wrappedCanvas) { 
            const canvasElement = wrappedCanvas.canvas as HTMLCanvasElement
            const url = canvasElement.toDataURL()
            urls.push(url)
          }
        }

        if (!cancelled) {
          setThumbnails(prev => [...prev, ...urls])
        }
      } catch (err) {
        console.error('Error generating thumbnails:', err)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [input, count])

  return (
    <div className='w-full aspect-video overflow-hidden'>
      {thumbnails.length > 0 ? (
        <div className={`w-full h-full ${thumbnails.length !== count ? 'blur-3xl' : ''}`}>
          <Carousel thumbnails={thumbnails} timeout={1500}/>
        </div>
      ) : (
        <span className='w-full h-full flex justify-center items-center bg-[#333333]'>
          <svg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 24 24'>
            <path fill='#212121' d='M8.51 2h6.98c.232 0 .41 0 .566.015c1.108.109 2.015.775 2.4 1.672H5.544c.385-.897 1.292-1.563 2.4-1.672C8.098 2 8.276 2 8.51 2m-2.2 2.723c-1.39 0-2.53.84-2.91 1.954l-.024.07c.398-.12.813-.2 1.232-.253c1.08-.139 2.446-.139 4.032-.139h6.892c1.586 0 2.951 0 4.032.139c.42.054.834.132 1.232.253l-.023-.07c-.38-1.114-1.52-1.954-2.911-1.954z'/>
            <path fill='#212121' fillRule='evenodd' d='M15.328 7.542H8.672c-3.374 0-5.062 0-6.01.987s-.725 2.511-.278 5.56l.422 2.892c.35 2.391.525 3.587 1.422 4.303c.898.716 2.22.716 4.867.716h5.81c2.646 0 3.97 0 4.867-.716s1.072-1.912 1.422-4.303l.422-2.891c.447-3.05.67-4.574-.278-5.561s-2.636-.987-6.01-.987m-.747 8.252c.559-.346.559-1.242 0-1.588l-3.371-2.09c-.543-.337-1.21.101-1.21.794v4.18c0 .693.667 1.13 1.21.794z' clipRule='evenodd'/>
          </svg>
        </span>
      )}
    </div>
  )
}
