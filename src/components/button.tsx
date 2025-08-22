import { twMerge } from 'tailwind-merge'

interface ButtonProps {
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  className?: string
  children: React.ReactNode
}

export function Button({
  onClick,
  className,
  children,
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
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
          text-[16px]
          tracking-[0.8px]

          w-auto
          h-auto
          px-[20px]
          py-[8px]
          rounded-[12px]
          before:rounded-[12px]

          before:bg-[#9E9E9E]
          before:shadow-[0_4px_0_#7E7E7E]
          border-b-[4px]
          active:translate-y-[4px]
          hover:brightness-[1.1]`,
          className
        )
      }
    >
      <span className='uppercase truncate -mb-[2px]'>
        {children}
      </span>
    </button>
  )
}
