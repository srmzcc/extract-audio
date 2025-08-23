import { twMerge } from 'tailwind-merge'

interface CSSVars extends React.CSSProperties {
  "--w"?: string
}

interface ProgressBarProps {
  progress: number
  className?: string
}

export function ProgressBar({ progress, className }: ProgressBarProps) {
  const percentage: number = Math.round(progress * 100)

  return (
    <div
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
      style={{ '--progress-bar-w': `${percentage}%`} as CSSVars}
    >

    </div>
  )
}