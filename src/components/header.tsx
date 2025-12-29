import Link from 'next/link'

export function Header() {
  return (
    <header className='sticky top-0 left-0 right-0 z-50 py-4 text-sm'>
      <nav className='max-w-3xl mx-auto px-6 flex items-center gap-6'>
        <Link
          href='/'
          className='text-muted-foreground hover:text-foreground transition-colors'
        >
          Home
        </Link>
        <Link
          href='/toolbox'
          className='text-muted-foreground hover:text-foreground transition-colors'
        >
          Toolbox
        </Link>
      </nav>
    </header>
  )
}
