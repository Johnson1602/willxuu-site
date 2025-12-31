'use client'

import { cn } from '@/lib/utils'
import { useId, useState } from 'react'
import { usePathname } from 'next/navigation'

interface LogoProps {
  className?: string
}

export function Logo({ className }: LogoProps) {
  const id = useId()
  const pathname = usePathname()
  const isHome = pathname === '/'
  const [isHovered, setIsHovered] = useState(false)

  // On homepage: always closed. On other pages: closed on hover, open otherwise
  const isClosed = isHome || isHovered

  return (
    <svg
      width='32'
      height='32'
      viewBox='0 0 192 192'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={cn('inline-block', className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Left part of W - static */}
      <path d='M48 55H28L62 137H82L48 55Z' fill='currentColor' />
      <path d='M85 55H65L99 137H119L85 55Z' fill='currentColor' />

      {/* Bottom parts of back slashes - static */}
      <g clipPath={`url(#clipBottom1_${id})`}>
        <path d='M104 55H116L82 137H70L104 55Z' fill='currentColor' />
      </g>
      <g clipPath={`url(#clipBottom2_${id})`}>
        <path d='M141 55H153L119 137H107L141 55Z' fill='currentColor' />
      </g>

      {/* Top broken pieces - animated */}
      <g
        style={{
          transform: `translateX(${isClosed ? -13 : 0}px)`,
          transition: 'transform 0.1s ease',
        }}
      >
        <g clipPath={`url(#clipTop1_${id})`}>
          <path
            d='M116.5 55H128.5L94.5 137H82.5L116.5 55Z'
            fill='currentColor'
          />
        </g>
      </g>
      <g
        style={{
          transform: `translateX(${isClosed ? -12 : 0}px)`,
          transition: 'transform 0.1s ease',
        }}
      >
        <g clipPath={`url(#clipTop2_${id})`}>
          <path d='M153 55H165L131 137H119L153 55Z' fill='currentColor' />
        </g>
      </g>

      <defs>
        {/* Bottom clip regions (y: 93 to 137) */}
        <clipPath id={`clipBottom1_${id}`}>
          <rect width='46' height='44' fill='white' x='70' y='93' />
        </clipPath>
        <clipPath id={`clipBottom2_${id}`}>
          <rect width='46' height='44' fill='white' x='107' y='93' />
        </clipPath>

        {/* Top clip regions (y: 55 to 93) */}
        <clipPath id={`clipTop1_${id}`}>
          <rect width='46' height='38' fill='white' x='83' y='55' />
        </clipPath>
        <clipPath id={`clipTop2_${id}`}>
          <rect width='28' height='38' fill='white' x='137' y='55' />
        </clipPath>
      </defs>
    </svg>
  )
}
