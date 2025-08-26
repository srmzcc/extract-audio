import { twMerge } from 'tailwind-merge'

interface ButtonProps {
  children?: React.ReactNode
  style?: React.CSSProperties
  className?: string
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  disabled?: boolean
}

export function Button({
  children,
  style,
  className,
  onClick,
  disabled = false
}: ButtonProps) {
  return (
    <button
      style={style}
      className={
        twMerge(
          `relative
          inline-flex
          justify-center
          items-center
          
          bg-transparent
          border-transparent
          outline-none
          touch-manipulation
          cursor-pointer
          transform-gpu
          select-none
          before:absolute
          before:inset-0
          active:before:shadow-none
          before:-z-1

          font-mono
          font-[700]
          text-white
          text-[14px]
          tracking-[0.8px]

          w-auto
          h-auto
          px-[20px]
          py-0
          rounded-[5px]
          before:rounded-[5px]

          before:bg-[#9E9E9E]
          before:shadow-[0_4px_0_#7E7E7E]
          border-b-[4px]
          active:translate-y-[4px]
          hover:brightness-[1.1]
          
          disabled:before:shadow-none
          disabled:text-[#52656D]
          disabled:before:bg-[#37464F]
          disabled:translate-y-[4px]
          disabled:brightness-[1]
          disabled:cursor-auto`,
          className
        )
      }
      onClick={onClick}
      disabled={disabled}
    >
      <span className='uppercase truncate -mb-[2px]'>
        {children}
      </span>
    </button>
  )
}
