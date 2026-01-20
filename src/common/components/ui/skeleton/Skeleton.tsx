import clsx from 'clsx'

interface SkeletonProps {
  variant?: 'text' | 'title' | 'avatar' | 'thumbnail' | 'button'
  width?: string | number
  height?: string | number
  className?: string
}

export default function Skeleton({
  variant = 'text',
  width,
  height,
  className,
}: SkeletonProps) {
  const style: React.CSSProperties = {}

  if (width) {
    style.width = typeof width === 'number' ? `${width}px` : width
  }

  if (height) {
    style.height = typeof height === 'number' ? `${height}px` : height
  }

  return (
    <div
      className={clsx('skeleton', `skeleton--${variant}`, className)}
      style={style}
    />
  )
}
