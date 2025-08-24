import { twMerge } from 'tailwind-merge'

interface ProgressBarProps {
  progress: number
  className?: string
}

export function ProgressBar({ progress, className }: ProgressBarProps) {
  const percentage: number = Math.round(progress * 100)

  return (
    <span
      className={
        twMerge(
          `relative
          w-full
          h-2
          bg-[#333333]

          before:absolute
          before:inset-0
          before:bg-green-500
          progress-bar`,
          className
        )
      }
      style={{ '--progress-bar-w': percentage + '%' } as React.CSSProperties}
    ></span>
  )
}
