# Google Cloud TTS Migration Plan

## Overview

Migrate from ElevenLabs to Google Cloud Text-to-Speech for the dictation practice feature, enabling proper SSML support for reliable character-by-character spelling and speed control.

## Current Issues with ElevenLabs

- No SSML support - cannot use `<say-as interpret-as="characters">` for spelling
- Digits sometimes dropped or rushed through
- Speed adjustment inconsistent
- Workarounds (periods, commas) are unreliable

## Benefits of Google Cloud TTS

- Full SSML support
- Predictable character spelling with `<say-as>`
- Reliable speed control with `<prosody rate>`
- Consistent pauses with `<break>`
- Cost-effective (~$4/1M characters)

---

## Google Cloud TTS Setup Guide

### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click the project dropdown at the top → **New Project**
3. Name it (e.g., `willxuu-site-tts`) → **Create**
4. Wait for the project to be created, then select it

### Step 2: Enable the Text-to-Speech API

1. Go to [Cloud Text-to-Speech API](https://console.cloud.google.com/apis/library/texttospeech.googleapis.com)
2. Make sure your project is selected
3. Click **Enable**

### Step 3: Create a Service Account

1. Go to [IAM & Admin → Service Accounts](https://console.cloud.google.com/iam-admin/service-accounts)
2. Click **Create Service Account**
3. Name: `tts-service-account`
4. Click **Create and Continue**
5. Skip the optional steps → **Done**

### Step 4: Create and Download API Key

1. Click on the service account you just created
2. Go to **Keys** tab
3. Click **Add Key** → **Create new key**
4. Choose **JSON** → **Create**
5. A JSON file will download - keep this secure!

### Step 5: Add Credentials to Vercel

Google Cloud TTS requires service account authentication (not a simple API key). For Vercel deployment, extract the required fields from the JSON:

1. Open the downloaded JSON file
2. Copy these three values:
   - `project_id`
   - `client_email`
   - `private_key`

3. In Vercel: **Project** → **Settings** → **Environment Variables**

   Add these three variables:
   ```
   GOOGLE_PROJECT_ID=your-project-id
   GOOGLE_CLIENT_EMAIL=tts-service@your-project.iam.gserviceaccount.com
   GOOGLE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nMIIE...<full key>...\n-----END PRIVATE KEY-----\n
   ```

   **Note**: For `GOOGLE_PRIVATE_KEY`, paste the entire key including the BEGIN/END lines. Vercel handles the newlines automatically.

4. For local development, add the same to `.env.local`:
   ```
   GOOGLE_PROJECT_ID=your-project-id
   GOOGLE_CLIENT_EMAIL=tts-service@your-project.iam.gserviceaccount.com
   GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   ```

5. You can now delete the downloaded JSON file (don't commit it!)

### Step 6: Install the SDK

```bash
pnpm add @google-cloud/text-to-speech
```

### Step 7: Verify Setup

Test with a simple script or proceed with the implementation below.

---

## Implementation Plan

### Phase 1: Create New TTS API Route

**File**: `src/app/api/tts-google/route.ts`

```typescript
import { TextToSpeechClient } from '@google-cloud/text-to-speech'
import { NextResponse } from 'next/server'

// Initialize client with Vercel-friendly credentials
const client = new TextToSpeechClient({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  projectId: process.env.GOOGLE_PROJECT_ID,
})

export async function POST(request: Request) {
  const { ssml, speed = 1.0 } = await request.json()

  const [response] = await client.synthesizeSpeech({
    input: { ssml },
    voice: {
      languageCode: 'en-US',
      name: 'en-US-Neural2-F', // Female neural voice
    },
    audioConfig: {
      audioEncoding: 'MP3',
      speakingRate: speed, // 0.25 to 4.0
    },
  })

  return new NextResponse(response.audioContent as Buffer, {
    headers: { 'Content-Type': 'audio/mpeg' },
  })
}
```

### Phase 2: Create SSML Builders

**File**: `src/lib/ssml.ts`

```typescript
export function buildDigitSSML(digits: string, speed: number = 1.0): string {
  const digitWords: Record<string, string> = {
    '0': 'zero', '1': 'one', '2': 'two', '3': 'three', '4': 'four',
    '5': 'five', '6': 'six', '7': 'seven', '8': 'eight', '9': 'nine',
  }

  const spokenDigits = digits
    .split('')
    .map(d => `${digitWords[d]}<break time="300ms"/>`)
    .join('')

  return `<speak><prosody rate="${speed}">${spokenDigits}</prosody></speak>`
}

export function buildPlaceSSML(place: string, speed: number = 1.0): string {
  const spelled = place
    .toUpperCase()
    .split('')
    .map(char => `<say-as interpret-as="characters">${char}</say-as><break time="200ms"/>`)
    .join('')

  return `
    <speak>
      <prosody rate="${speed}">
        ${place}
        <break time="500ms"/>
        ${spelled}
      </prosody>
    </speak>
  `
}
```

### Phase 3: Update Frontend

**File**: `src/app/toolbox/dictation-practice/page.tsx`

Update `speakWithElevenLabs` → `speakWithGoogleTTS`:

```typescript
import { buildDigitSSML, buildPlaceSSML } from '@/lib/ssml'

async function speakWithGoogleTTS(
  text: string,
  mode: 'phone' | 'place',
  speed: number = 1.0
): Promise<HTMLAudioElement> {
  const ssml = mode === 'phone'
    ? buildDigitSSML(text, speed)
    : buildPlaceSSML(text, speed)

  const response = await fetch('/api/tts-google', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ssml, speed }),
  })

  if (!response.ok) throw new Error('TTS failed')

  const audioBlob = await response.blob()
  const audioUrl = URL.createObjectURL(audioBlob)
  const audio = new Audio(audioUrl)

  return new Promise((resolve, reject) => {
    audio.onended = () => {
      URL.revokeObjectURL(audioUrl)
      resolve(audio)
    }
    audio.onerror = reject
    audio.play()
  })
}
```

### Phase 4: Simplify speakValue Callback

The new `speakWithGoogleTTS` handles both modes in a single call, so the `speakValue` callback becomes simpler:

```typescript
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
```

### Phase 5: Cleanup

1. Remove or deprecate `/api/tts/route.ts` (ElevenLabs)
2. Remove `ELEVENLABS_API_KEY` from environment if no longer needed
3. Update any other references

---

## File Changes Summary

| Action | File |
|--------|------|
| Create | `src/app/api/tts-google/route.ts` |
| Create | `src/lib/ssml.ts` |
| Modify | `src/app/toolbox/dictation-practice/page.tsx` |
| Modify | `.env.local` (add Google credentials) |
| Modify | `.gitignore` (add credentials file) |
| Delete (optional) | `src/app/api/tts/route.ts` |

---

## Testing Checklist

- [ ] Google Cloud project created and API enabled
- [ ] Service account credentials configured
- [ ] New API route returns audio
- [ ] Phone number digits spoken clearly with pauses
- [ ] Place names spoken, then spelled character-by-character
- [ ] Speed control works (test 0.5x, 1.0x, 1.5x)
- [ ] Error handling works (invalid input, API errors)
- [ ] No audio clipping or dropped characters

---

## Cost Estimate

Google Cloud TTS pricing: ~$4 per 1 million characters

For dictation practice:
- Phone number: 10 digits × ~4 chars/word = ~40 chars
- Place name + spelling: ~30 chars avg

At 100 dictations/day = ~7,000 chars/day = ~$0.03/month

---

## Rollback Plan

If issues arise, the ElevenLabs implementation remains in `/api/tts/route.ts` and can be switched back by changing the fetch URL in the frontend.
