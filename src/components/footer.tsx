import { ThemeToggle } from '@/components/theme-toggle'

export function Footer() {
  return (
    <footer className='max-w-3xl mx-auto px-6 py-6 w-full'>
      <div className='flex justify-end'>
        <ThemeToggle />
      </div>
    </footer>
  )
}
