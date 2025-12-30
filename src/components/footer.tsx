import { ThemeToggle } from '@/components/theme-toggle'

export function Footer() {
  return (
    <footer className='w-full py-6'>
      <div className='max-w-3xl mx-auto px-6 flex justify-end'>
        <ThemeToggle />
      </div>
    </footer>
  )
}
