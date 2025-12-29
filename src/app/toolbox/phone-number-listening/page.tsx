'use client'

import { useState, useRef } from 'react'
import { Check, X, ArrowLeft, Volume2, Minus, Plus, RotateCcw } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

function generatePhoneNumber(): string {
  const digits = Array.from({ length: 10 }, () =>
    Math.floor(Math.random() * 10).toString()
  )
  return digits.join('')
}

const BASE_RATE = 0.7

function speakPhoneNumber(phoneNumber: string, speedMultiplier: number) {
  // Cancel any ongoing speech
  speechSynthesis.cancel()

  // Add spaces between digits for clearer pronunciation
  const spacedDigits = phoneNumber.split('').join(' ')

  const utterance = new SpeechSynthesisUtterance(spacedDigits)
  utterance.rate = BASE_RATE * speedMultiplier
  utterance.lang = 'en-US'
  speechSynthesis.speak(utterance)
}

function formatPhoneNumber(num: string): string {
  return num.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3')
}

// Non-breaking space to maintain height
const EMPTY_PLACEHOLDER = '\u00A0'

type GameState = 'idle' | 'playing' | 'revealed'

export default function PhoneNumberListeningPage() {
  const [generatedNumber, setGeneratedNumber] = useState<string | null>(null)
  const [userInput, setUserInput] = useState('')
  const [gameState, setGameState] = useState<GameState>('idle')
  const [speed, setSpeed] = useState(1.0)
  const inputRef = useRef<HTMLInputElement>(null)

  const digitsOnly = userInput.replace(/\D/g, '')
  const isCorrect = digitsOnly === generatedNumber

  const handleStart = () => {
    const number = generatePhoneNumber()
    setGeneratedNumber(number)
    setUserInput('')
    setGameState('playing')
    inputRef.current?.focus()
    // 1 second delay before reading
    setTimeout(() => {
      speakPhoneNumber(number, speed)
    }, 1000)
  }

  const handleReplay = () => {
    if (generatedNumber) {
      speakPhoneNumber(generatedNumber, speed)
      inputRef.current?.focus()
    }
  }

  const handleSpeedDown = () => {
    setSpeed((s) => Math.max(0.1, Math.round((s - 0.1) * 10) / 10))
  }

  const handleSpeedUp = () => {
    setSpeed((s) => Math.min(2.0, Math.round((s + 0.1) * 10) / 10))
  }

  const handleSpeedReset = () => {
    setSpeed(1.0)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '')
    setUserInput(value)

    // Auto-reveal when 10 digits entered
    if (generatedNumber && value.length === 10 && gameState === 'playing') {
      setGameState('revealed')
    }
  }

  // Determine what to show in the number display area
  const getNumberDisplay = () => {
    if (gameState === 'revealed') {
      return formatPhoneNumber(generatedNumber!)
    }
    return EMPTY_PLACEHOLDER
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

      <h1 className='text-2xl font-bold mb-2'>Phone Number Listening</h1>
      <p className='text-muted-foreground mb-8'>
        Click Start to hear a phone number, then type what you heard.
      </p>

      <div className='space-y-6'>
        {/* New Number / Replay buttons + Speed controls */}
        <div className='flex items-center gap-2'>
          <Button onClick={handleStart}>New Number</Button>

          {(gameState === 'playing' || gameState === 'revealed') && (
            <Button variant='outline' onClick={handleReplay}>
              <Volume2 className='size-4' />
              Replay
            </Button>
          )}

          {/* Speed controls - right aligned */}
          <div className='ml-auto flex items-center gap-2'>
            <Button
              variant='outline'
              size='icon'
              onClick={handleSpeedDown}
              disabled={speed <= 0.1}
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

        {/* Number display + Input on the same line */}
        <div className='flex items-center gap-4'>
          {/* Input with result icon (left side) */}
          <div className='flex items-center gap-3'>
            <Input
              ref={inputRef}
              type='text'
              inputMode='numeric'
              placeholder='Type what you heard...'
              value={userInput}
              onChange={handleInputChange}
              maxLength={10}
              className='font-mono tracking-wider w-64'
              autoCorrect='off'
              autoComplete='off'
            />
            {gameState === 'revealed' && (
              <>
                {isCorrect ? (
                  <Check className='size-6 text-green-500' />
                ) : (
                  <X className='size-6 text-red-500' />
                )}
              </>
            )}
          </div>

          {/* Number display area (right side) */}
          <div className='text-lg font-mono tracking-wider min-w-[160px]'>
            {getNumberDisplay()}
          </div>
        </div>
      </div>
    </div>
  )
}
