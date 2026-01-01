import Link from 'next/link'
import { Headphones, Link2 } from 'lucide-react'

const tools = [
  {
    title: 'Dictation Practice',
    description: 'Listen and type phone numbers or place names',
    href: '/toolbox/dictation-practice',
    icon: Headphones,
  },
  {
    title: 'Sharable Cursor Commands',
    description: 'Generate shareable links for Cursor IDE commands',
    href: '/toolbox/sharable-cursor-commands',
    icon: Link2,
  },
]

export default function ToolboxPage() {
  return (
    <div>
      <h1 className='text-2xl font-bold mb-6'>Toolbox</h1>
      <div className='grid gap-4 sm:grid-cols-2'>
        {tools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className='block p-4 rounded-lg border border-border bg-card hover:bg-muted transition-colors'
          >
            <div className='flex items-center gap-3'>
              <tool.icon className='size-5 text-muted-foreground' />
              <div>
                <h2 className='font-medium'>{tool.title}</h2>
                <p className='text-sm text-muted-foreground'>
                  {tool.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
