import { useEffect, useState } from 'react'

import { ProgressBar } from './progress-bar'
import {
  BufferTarget,
  Conversion,
  Output,
  WavOutputFormat,
  type BlobSource,
  type Input
} from 'mediabunny'

interface ConverterProps {
  input?: Input<BlobSource>
  setConvertedFile: React.Dispatch<React.SetStateAction<Blob | undefined>>
}

export function Converter({ input, setConvertedFile }: ConverterProps) {
  const [progress, setProgress] = useState<number>(0)
  
  useEffect(() => {
    if (!input) return

    let isCancelled = false
    let conversion: Conversion | null = null

    setProgress(0)

    ;(async () => {
      const audioTrack = await input.getPrimaryAudioTrack()
      if (!audioTrack) return // add feedback

      const output = new Output({
        format: new WavOutputFormat(),
        target: new BufferTarget()
      })

      conversion = await Conversion.init({ input, output })
      conversion.onProgress = progress => {
        if (!isCancelled) {
          setProgress(progress)
        }
      }

      try {
        await conversion.execute()
        if (isCancelled) return

        const audioBuffer = output.target.buffer
        if (!audioBuffer) return

        const audioBlob = new Blob([audioBuffer], { type: 'audio/wav' })
        setConvertedFile(audioBlob)
      } catch (err) {
        if (!isCancelled) {
          console.error('Conversion error:', err)
        }
      }
    })()

    return () => {
      isCancelled = true

      if (!!conversion) {
        conversion.cancel().catch(err => {
          console.warn('Error cancelling conversion:', err)
        })
      }
    }
  }, [input])

  return (
    <ProgressBar progress={progress} />
  )
}