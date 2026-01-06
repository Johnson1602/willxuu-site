import { TextToSpeechClient } from '@google-cloud/text-to-speech'
import { NextResponse } from 'next/server'

function getClient(): TextToSpeechClient {
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n')
  const projectId = process.env.GOOGLE_PROJECT_ID

  if (!clientEmail || !privateKey || !projectId) {
    throw new Error('Google Cloud TTS credentials not configured')
  }

  return new TextToSpeechClient({
    credentials: {
      client_email: clientEmail,
      private_key: privateKey,
    },
    projectId,
  })
}

export async function POST(request: Request) {
  try {
    const { ssml, speed = 1.0 } = await request.json()

    if (!ssml || typeof ssml !== 'string') {
      return NextResponse.json({ error: 'SSML is required' }, { status: 400 })
    }

    // Clamp speed to valid range (0.25 to 4.0)
    const clampedSpeed = Math.max(0.25, Math.min(4.0, speed))

    const client = getClient()

    const [response] = await client.synthesizeSpeech({
      input: { ssml },
      voice: {
        languageCode: 'en-US',
        name: 'en-US-Neural2-F',
      },
      audioConfig: {
        audioEncoding: 'MP3',
        speakingRate: clampedSpeed,
      },
    })

    if (!response.audioContent) {
      return NextResponse.json(
        { error: 'No audio content returned' },
        { status: 500 }
      )
    }

    const audioBuffer = Buffer.from(response.audioContent as Uint8Array)

    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.byteLength.toString(),
      },
    })
  } catch (error) {
    console.error('Google TTS error:', error)
    return NextResponse.json(
      { error: 'Failed to generate speech' },
      { status: 500 }
    )
  }
}
