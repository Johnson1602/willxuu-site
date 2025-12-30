'use client'

import { useMemo, useState } from 'react'
import { Check, Copy, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

const BASE_URL = 'https://cursor.com/link/command'

export default function SharableCursorCommandsPage() {
  const [name, setName] = useState('')
  const [text, setText] = useState('')
  const [copied, setCopied] = useState(false)
  const [copyError, setCopyError] = useState<string | null>(null)

  const generatedUrl = useMemo(() => {
    const params = new URLSearchParams()
    if (name.trim()) params.set('name', name.trim())
    if (text.trim()) params.set('text', text.trim())
    const query = params.toString()
    return query ? `${BASE_URL}?${query}` : BASE_URL
  }, [name, text])

  const canCopy = name.trim().length > 0 && text.trim().length > 0

  const handleCopy = async () => {
    if (!canCopy) {
      setCopyError('Fill in both fields before copying.')
      return
    }
    setCopyError(null)
    setCopied(false)

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(generatedUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 1800)
        return
      }

      if (typeof document !== 'undefined') {
        const textarea = document.createElement('textarea')
        textarea.value = generatedUrl
        textarea.style.position = 'fixed'
        textarea.style.left = '-9999px'
        document.body.appendChild(textarea)
        textarea.select()
        const succeeded = document.execCommand('copy')
        document.body.removeChild(textarea)
        if (succeeded) {
          setCopied(true)
          setTimeout(() => setCopied(false), 1800)
          return
        }
      }

      throw new Error('Clipboard API unavailable')
    } catch (error) {
      console.error('Failed to copy', error)
      setCopyError('Clipboard copy failed. Please copy manually.')
    }
  }

  return (
    <div>
      <Link
        href='/toolbox'
        className='inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6'
      >
        <ArrowLeft className='size-4' />
        Back to Toolbox
      </Link>

      <h1 className='text-2xl font-bold mb-2'>Sharable Cursor Commands</h1>
      <p className='text-muted-foreground mb-8'>
        Provide the command name &amp; content, then copy the ready-to-share
        command link.
      </p>

      <div className='max-w-xl space-y-6'>
        <div className='space-y-2'>
          <label
            className='text-sm font-medium text-muted-foreground'
            htmlFor='command-name'
          >
            Name
          </label>
          <Input
            id='command-name'
            placeholder='greeting'
            value={name}
            onChange={(event) => setName(event.target.value)}
            aria-label='Command name'
          />
        </div>

        <div className='space-y-2'>
          <label
            className='text-sm font-medium text-muted-foreground'
            htmlFor='command-text'
          >
            Text
          </label>
          <Textarea
            id='command-text'
            placeholder='Hello my friend, create your own sharable commands...'
            value={text}
            onChange={(event) => setText(event.target.value)}
            aria-label='Command text'
            rows={6}
            className='min-h-36 max-h-72'
          />
        </div>

        <div className='space-y-3 rounded-lg border border-border bg-card p-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <span className='size-2 rounded-full bg-emerald-500' />
              <p className='text-sm font-medium'>Preview link</p>
            </div>
            <Button
              size='sm'
              variant='outline'
              onClick={handleCopy}
              disabled={!canCopy}
            >
              {copied ? (
                <>
                  <Check className='size-4 text-emerald-500' />
                  Copied
                </>
              ) : (
                <>
                  <Copy className='size-4' />
                  Copy
                </>
              )}
            </Button>
          </div>
          <div className='rounded-md border border-border bg-muted p-3 max-h-72 overflow-auto'>
            <p className='font-mono text-sm break-all'>{generatedUrl}</p>
          </div>
          {copyError && (
            <p className='text-sm text-destructive' role='alert'>
              {copyError}
            </p>
          )}
          <p className='text-sm text-muted-foreground'>
            Please share useful commands and be nice to each other.
          </p>
        </div>
      </div>
    </div>
  )
}
