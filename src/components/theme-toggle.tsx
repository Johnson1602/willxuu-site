'use client'

import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import posthog from 'posthog-js'

import { Button } from '@/components/ui/button'

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  const handleToggle = () => {
    const newTheme = resolvedTheme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    posthog.capture('toggled_theme', {
      previous_theme: resolvedTheme,
      new_theme: newTheme,
    })
  }

  if (!mounted) {
    return (
      <Button variant='ghost' size='icon' className='relative' disabled>
        <span className='sr-only'>Toggle theme</span>
      </Button>
    )
  }

  return (
    <Button
      variant='ghost'
      size='icon'
      className='relative'
      aria-label='Toggle color theme'
      onClick={handleToggle}
    >
      <Sun className='size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
      <Moon className='absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
      <span className='sr-only'>Toggle theme</span>
    </Button>
  )
}
