'use client'

import { useState, useRef, useCallback } from 'react'
import {
  Check,
  X,
  ArrowLeft,
  Volume2,
  Loader2,
  Minus,
  Plus,
  RotateCcw,
} from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { buildDigitSSML, buildPlaceSSML } from '@/lib/ssml'

function generatePhoneNumber(): string {
  const digits = Array.from({ length: 10 }, () =>
    Math.floor(Math.random() * 10).toString()
  )
  return digits.join('')
}

const PLACE_WORDS = [
  'Florence',
  'Nairobi',
  'Seville',
  'Bologna',
  'Brisbane',
  'Orlando',
  'Phoenix',
  'Antwerp',
  'Kampala',
  'Bordeaux',
  'Portland',
  'Marseille',
  'Stockholm',
  'Edmonton',
  'Helsinki',
  'Valencia',
]

function generatePlaceWord(): string {
  return PLACE_WORDS[Math.floor(Math.random() * PLACE_WORDS.length)]
}

type Mode = 'phone' | 'place'
type GameState = 'idle' | 'playing' | 'revealed'

async function speakWithGoogleTTS(
  text: string,
  mode: 'phone' | 'place',
  speed: number = 1.0
): Promise<HTMLAudioElement> {
  const ssml = mode === 'phone' ? buildDigitSSML(text) : buildPlaceSSML(text)

  const response = await fetch('/api/tts-google', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ssml, speed }),
  })

  if (!response.ok) {
    throw new Error('Failed to generate speech')
  }

  const audioBlob = await response.blob()
  const audioUrl = URL.createObjectURL(audioBlob)
  const audio = new Audio(audioUrl)

  return new Promise((resolve, reject) => {
    audio.onended = () => {
      URL.revokeObjectURL(audioUrl)
      resolve(audio)
    }
    audio.onerror = () => {
      URL.revokeObjectURL(audioUrl)
      reject(new Error('Audio playback failed'))
    }
    audio.play()
  })
}

function formatPhoneNumber(num: string): string {
  return num.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3')
}

const EMPTY_PLACEHOLDER = '\u00A0'

export default function PhoneNumberListeningPage() {
  const [mode, setMode] = useState<Mode>('phone')
  const [generatedValue, setGeneratedValue] = useState<string | null>(null)
  const [userInput, setUserInput] = useState('')
  const [gameState, setGameState] = useState<GameState>('idle')
  const [isLoading, setIsLoading] = useState(false)
  const [speed, setSpeed] = useState(1.0)
  const inputRef = useRef<HTMLInputElement>(null)

  const speakValue = useCallback(
    async (value: string, currentMode: Mode, currentSpeed: number) => {
      setIsLoading(true)
      try {
        await speakWithGoogleTTS(value, currentMode, currentSpeed)
      } catch (error) {
        console.error('Speech error:', error)
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  const sanitizeInput = (value: string) => {
    if (mode === 'phone') {
      return value.replace(/\D/g, '').slice(0, 10)
    }
    return value.replace(/[^\p{L}]/gu, '')
  }

  const normalizedGenerated =
    mode === 'phone'
      ? generatedValue ?? ''
      : (generatedValue ?? '').toLowerCase()
  const normalizedUser = mode === 'phone' ? userInput : userInput.toLowerCase()

  const isCorrect =
    gameState === 'revealed' && generatedValue
      ? normalizedUser === normalizedGenerated
      : false

  const placeholder =
    mode === 'phone'
      ? 'Type the 10 digits you heard'
      : 'Type the place name you heard'

  const handleModeChange = (value: string) => {
    const nextMode: Mode = value === 'place' ? 'place' : 'phone'
    setMode(nextMode)
    setGeneratedValue(null)
    setUserInput('')
    setGameState('idle')
  }

  const handleStart = async () => {
    const value = mode === 'phone' ? generatePhoneNumber() : generatePlaceWord()
    setGeneratedValue(value)
    setUserInput('')
    setGameState('playing')
    inputRef.current?.focus()

    // Small delay before speaking
    await new Promise((r) => setTimeout(r, 500))
    speakValue(value, mode, speed)
  }

  const handleReplay = () => {
    if (!generatedValue || isLoading) return
    speakValue(generatedValue, mode, speed)
    inputRef.current?.focus()
  }

  const handleSpeedDown = () => {
    setSpeed((s) => Math.max(0.5, Math.round((s - 0.1) * 10) / 10))
  }

  const handleSpeedUp = () => {
    setSpeed((s) => Math.min(2.0, Math.round((s + 0.1) * 10) / 10))
  }

  const handleSpeedReset = () => {
    setSpeed(1.0)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(sanitizeInput(e.target.value))
  }

  const handleSubmit = () => {
    if (!generatedValue) return
    setGameState('revealed')
  }

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSubmit()
    }
  }

  const getDisplayContent = () => {
    if (gameState !== 'revealed' || !generatedValue) {
      return EMPTY_PLACEHOLDER
    }

    const displayText =
      mode === 'phone' ? formatPhoneNumber(generatedValue) : generatedValue

    return (
      <div className='inline-flex items-center gap-2'>
        {isCorrect ? (
          <Check className='size-6 text-green-500' />
        ) : (
          <X className='size-6 text-red-500' />
        )}
        <span>{displayText}</span>
      </div>
    )
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

      <h1 className='text-2xl font-bold mb-2'>Dictation Practice</h1>
      <p className='text-muted-foreground mb-8'>
        Choose phone numbers or place names, type out what you heard.
      </p>

      <div className='space-y-6'>
        <div className='space-y-2'>
          <div className='flex items-center gap-4'>
            <Label className='text-sm font-medium'>Content type</Label>
            <RadioGroup
              className='flex flex-wrap items-center gap-4'
              value={mode}
              onValueChange={handleModeChange}
            >
              <div className='flex items-center gap-2'>
                <RadioGroupItem value='phone' id='mode-phone' />
                <Label htmlFor='mode-phone' className='text-sm'>
                  Phone number
                </Label>
              </div>
              <div className='flex items-center gap-2'>
                <RadioGroupItem value='place' id='mode-place' />
                <Label htmlFor='mode-place' className='text-sm'>
                  Place name
                </Label>
              </div>
            </RadioGroup>
          </div>
          <p className='text-sm text-muted-foreground'>
            Pick a type, press Enter to check.
          </p>
        </div>

        <div className='flex items-center gap-2'>
          <Button onClick={handleStart} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className='size-4 animate-spin' />
                Loading...
              </>
            ) : (
              'Start'
            )}
          </Button>

          {(gameState === 'playing' || gameState === 'revealed') && (
            <Button
              variant='outline'
              onClick={handleReplay}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className='size-4 animate-spin' />
              ) : (
                <Volume2 className='size-4' />
              )}
              Replay
            </Button>
          )}

          <div className='ml-auto flex items-center gap-2'>
            <Button
              variant='outline'
              size='icon'
              onClick={handleSpeedDown}
              disabled={speed <= 0.5}
            >
              <Minus className='size-4' />
            </Button>
            <span className='font-mono text-sm w-12 text-center'>{speed}x</span>
            <Button
              variant='outline'
              size='icon'
              onClick={handleSpeedUp}
              disabled={speed >= 2.0}
            >
              <Plus className='size-4' />
            </Button>
            <Button
              variant='outline'
              size='icon'
              onClick={handleSpeedReset}
              disabled={speed === 1.0}
            >
              <RotateCcw className='size-4' />
            </Button>
          </div>
        </div>

        <div className='flex items-center gap-4'>
          <div className='flex items-center gap-3'>
            <Input
              ref={inputRef}
              type='text'
              inputMode={mode === 'phone' ? 'numeric' : 'text'}
              placeholder={placeholder}
              value={userInput}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyDown}
              maxLength={mode === 'phone' ? 10 : undefined}
              className='font-mono tracking-wider w-64'
              autoCorrect='off'
              autoComplete='off'
            />
          </div>

          <div className='text-lg font-mono tracking-wider min-w-[200px]'>
            {getDisplayContent()}
          </div>
        </div>
      </div>
    </div>
  )
}
