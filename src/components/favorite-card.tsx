'use client'

import Image from 'next/image'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

import { cn } from '@/lib/utils'
import { type FavoriteItem, categoryLabels } from '@/lib/favorites'

interface FavoriteCardProps {
  item: FavoriteItem
}

function ThemedImage({
  lightSrc,
  darkSrc,
  alt,
  className,
}: {
  lightSrc: string
  darkSrc: string
  alt: string
  className?: string
}) {
  const { resolvedTheme } = useTheme()
  const [ready, setReady] = useState(false)
  const [theme, setTheme] = useState(resolvedTheme)

  useEffect(() => {
    if (!resolvedTheme) return

    if (!ready) {
      setTheme(resolvedTheme)
      requestAnimationFrame(() => setReady(true))
    } else {
      requestAnimationFrame(() => setTheme(resolvedTheme))
    }
  }, [resolvedTheme, ready])

  const isDark = theme === 'dark'

  return (
    <>
      <Image
        src={lightSrc}
        alt={alt}
        fill
        className={cn(
          'object-cover',
          ready
            ? cn(
                'transition-opacity duration-500 ease-out',
                isDark ? 'opacity-0' : 'opacity-100',
              )
            : 'opacity-100 dark:opacity-0',
          className,
        )}
      />
      <Image
        src={darkSrc}
        alt={alt}
        fill
        className={cn(
          'object-cover',
          ready
            ? cn(
                'transition-opacity duration-500 ease-out',
                isDark ? 'opacity-100' : 'opacity-0',
              )
            : 'opacity-0 dark:opacity-100',
          className,
        )}
      />
    </>
  )
}

export function FavoriteCard({ item }: FavoriteCardProps) {
  return (
    <div className='group relative overflow-hidden rounded-2xl aspect-3/4 shadow-md transition-shadow duration-500 ease-out hover:shadow-xl'>
      <ThemedImage
        lightSrc={item.coverImage.light}
        darkSrc={item.coverImage.dark}
        alt={item.name}
      />

      {/* Gradient overlay */}
      <div className='absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent' />

      {/* Content - moves up on hover */}
      <div className='absolute inset-x-0 bottom-0 p-5 flex flex-col gap-2 translate-y-10 group-hover:translate-y-0 transition-transform duration-500 ease-out'>
        {/* Category */}
        <span className='text-[10px] font-medium uppercase tracking-widest text-white/60'>
          {categoryLabels[item.category]}
        </span>

        {/* Title */}
        <h3 className='font-semibold text-white text-lg'>{item.name}</h3>

        {/* Description - fades in on hover */}
        <p className='text-sm text-white/70 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out'>
          {item.description}
        </p>
      </div>
    </div>
  )
}
