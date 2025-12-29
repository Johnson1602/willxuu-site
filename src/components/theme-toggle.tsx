'use client'

import { useEffect, useState } from 'react'
import { Monitor, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import posthog from 'posthog-js'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme)
    posthog.capture('toggled_theme', {
      previous_theme: theme,
      new_theme: newTheme,
    })
  }

  if (!mounted) {
    return (
      <div className='flex items-center gap-1 rounded-full border p-1'>
        <div className='size-8' />
        <div className='size-8' />
        <div className='size-8' />
      </div>
    )
  }

  return (
    <div className='flex items-center gap-1 rounded-full border p-1'>
      <Button
        variant='ghost'
        size='icon'
        className={cn('size-8 rounded-full', {
          'bg-accent hover:bg-accent!': theme === 'light',
        })}
        aria-label='Light theme'
        onClick={() => handleThemeChange('light')}
      >
        <Sun className='size-4' />
      </Button>
      <Button
        variant='ghost'
        size='icon'
        className={cn('size-8 rounded-full', {
          'bg-accent hover:bg-accent!': theme === 'system',
        })}
        aria-label='System theme'
        onClick={() => handleThemeChange('system')}
      >
        <Monitor className='size-4' />
      </Button>
      <Button
        variant='ghost'
        size='icon'
        className={cn('size-8 rounded-full', {
          'bg-accent hover:bg-accent!': theme === 'dark',
        })}
        aria-label='Dark theme'
        onClick={() => handleThemeChange('dark')}
      >
        <Moon className='size-4' />
      </Button>
    </div>
  )
}
