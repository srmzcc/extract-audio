import { useEffect, useState } from 'react'

interface CarouselProps {
  thumbnails: string[]
  timeout: number
}

export function Carousel({ thumbnails, timeout }: CarouselProps) {
  const [index, setIndex] = useState<number>(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex(prev => (prev + 1) % thumbnails.length)
    }, timeout)

    return () => clearInterval(interval)
  }, [thumbnails])

  return (
    <div className='relative w-full h-full'>
      {thumbnails.map((src, i) => (
        <img
          key={i}
          src={src}
          className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${i === index ? 'opacity-100' : 'opacity-0'}`}
          onDragStart={e => e.preventDefault()}
          alt={'thumbnail-' + i}
        />
      ))}
    </div>
  )
}