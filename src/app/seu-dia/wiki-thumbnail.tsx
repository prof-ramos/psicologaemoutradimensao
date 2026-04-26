'use client'

import Image from 'next/image'
import { useState } from 'react'

interface WikiThumbnailProps {
  src: string
  className?: string
  sizes?: string
  width?: number
  height?: number
  fill?: boolean
}

export function WikiThumbnail({
  src,
  className,
  sizes,
  width,
  height,
  fill,
}: WikiThumbnailProps) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div
        className="flex h-full w-full items-center justify-center border-2 border-border shadow-shadow bg-muted p-3 font-heading text-[10px] font-black uppercase tracking-wider text-muted-foreground"
        aria-hidden="true"
      >
        Sem imagem
      </div>
    )
  }

  return (
    <Image
      src={src}
      alt=""
      aria-hidden="true"
      fill={fill}
      width={width}
      height={height}
      sizes={sizes}
      className={className}
      onError={() => setFailed(true)}
    />
  )
}
