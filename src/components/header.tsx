'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

import { Logo } from '@/components/logo'

export function Header() {
  const pathname = usePathname()

  return (
    <header className='sticky top-0 left-0 right-0 z-50 py-3 text-sm bg-background/80 backdrop-blur-sm'>
      <nav className='max-w-3xl mx-auto px-6 flex items-center gap-6'>
        <Link
          href='/'
          className={cn(
            'hover:text-foreground transition-colors',
            pathname === '/' ? 'text-foreground' : 'text-muted-foreground'
          )}
        >
          <Logo />
        </Link>
        <Link
          href='/toolbox'
          className={cn(
            'hover:text-foreground transition-colors font-medium',
            pathname.startsWith('/toolbox')
              ? 'text-foreground'
              : 'text-muted-foreground'
          )}
        >
          Toolbox
        </Link>
      </nav>
    </header>
  )
}
