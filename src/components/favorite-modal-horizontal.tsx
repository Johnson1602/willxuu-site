'use client'

import * as React from 'react'
import Image from 'next/image'
import { ExternalLink } from 'lucide-react'

import { type FavoriteItem, categoryLabels } from '@/lib/favorites'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
} from '@/components/ui/dialog'
import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface FavoriteModalHorizontalProps {
  item: FavoriteItem
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function FavoriteModalHorizontal({
  item,
  open,
  onOpenChange,
}: FavoriteModalHorizontalProps) {
  const [selectedImageIndex, setSelectedImageIndex] = React.useState(0)
  const images = item.images ?? [item.coverImage.light]

  // Reset selected image when modal opens
  React.useEffect(() => {
    if (open) {
      setSelectedImageIndex(0)
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        {/* Custom dark spotlight backdrop */}
        <DialogPrimitive.Backdrop
          className={cn(
            'fixed inset-0 z-50',
            'data-[open]:animate-in data-[closed]:animate-out',
            'data-[closed]:fade-out-0 data-[open]:fade-in-0',
            'duration-300',
          )}
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.98) 100%)',
          }}
        />

        {/* Close button - fixed to top-left of screen */}
        <DialogPrimitive.Close
          className={cn(
            'fixed top-6 left-6 z-50',
            'w-10 h-10 rounded-full',
            'flex items-center justify-center',
            'text-white/60 hover:text-white',
            'transition-colors duration-200',
            'outline-none focus:ring-2 focus:ring-white/30',
          )}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <line x1='18' y1='6' x2='6' y2='18' />
            <line x1='6' y1='6' x2='18' y2='18' />
          </svg>
          <span className='sr-only'>Close</span>
        </DialogPrimitive.Close>

        {/* Modal content */}
        <DialogPrimitive.Popup
          className={cn(
            'fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2',
            'w-[94vw] max-w-6xl h-[85vh] max-h-[700px]',
            'data-[open]:animate-in data-[closed]:animate-out',
            'data-[closed]:fade-out-0 data-[open]:fade-in-0',
            'data-[closed]:zoom-out-95 data-[open]:zoom-in-95',
            'duration-300',
            'outline-none',
          )}
        >
          <div className='flex flex-col md:flex-row gap-0 h-full overflow-hidden'>
            {/* Left side - Image gallery (larger) */}
            <div className='flex-[3] flex flex-col gap-4 p-6 h-full overflow-hidden'>
              {/* Main image container */}
              <div className='relative flex-1 min-h-0 flex items-center justify-center'>
                <Image
                  src={images[selectedImageIndex]}
                  alt={item.name}
                  width={800}
                  height={800}
                  className='max-w-full max-h-full w-auto h-auto rounded-xl shadow-2xl object-contain'
                  priority
                />
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className='flex justify-center gap-2 shrink-0'>
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={cn(
                        'relative w-16 h-16 rounded-lg overflow-hidden transition-all duration-200',
                        'ring-2 ring-offset-2 ring-offset-black',
                        selectedImageIndex === index
                          ? 'ring-white opacity-100'
                          : 'ring-transparent opacity-50 hover:opacity-75',
                      )}
                    >
                      <Image
                        src={image}
                        alt={`${item.name} thumbnail ${index + 1}`}
                        fill
                        className='object-cover'
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right side - Content (narrower) */}
            <div className='flex-[1.2] flex flex-col justify-start p-8 pt-12'>
              {/* Category */}
              <span className='text-xs font-medium uppercase tracking-widest text-white/50 mb-2'>
                {categoryLabels[item.category]}
              </span>

              {/* Title */}
              <DialogTitle className='text-2xl font-bold text-white mb-4'>
                {item.name}
              </DialogTitle>

              {/* Description */}
              <DialogDescription className='text-sm text-white/70 leading-relaxed mb-6'>
                {item.longDescription ?? item.description}
              </DialogDescription>

              {/* Link button */}
              {item.link && (
                <a
                  href={item.link}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='inline-flex'
                >
                  <Button
                    variant='outline'
                    className='bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white'
                  >
                    Visit Website
                    <ExternalLink className='ml-2 h-4 w-4' />
                  </Button>
                </a>
              )}
            </div>
          </div>
        </DialogPrimitive.Popup>
      </DialogPortal>
    </Dialog>
  )
}
