# Dictation Page Loading State Improvements

## Overview
Improve the loading state handling in `/src/app/toolbox/dictation-practice/page.tsx` to provide better user feedback and prevent potential issues.

---

## Changes

### 1. Add Error State with User-Visible Feedback

**What**: Add an `error` state variable and display errors inline (not on the button).

**Implementation**:
- Add `const [error, setError] = useState<string | null>(null)`
- Clear error when starting a new action (`setError(null)` in `handleStart` and `handleReplay`)
- Set error message in catch block of `speakValue`
- Display error message below the buttons (e.g., red text with the error)
- User can simply click the button again to retry

**Location**: Lines 100, 104-116, and after line 283

---

### 2. Distinguish Between Fetching and Playing States

**What**: Replace single `isLoading` boolean with a more granular state to show "Loading audio..." vs "Playing...".

**Implementation**:
- Replace `isLoading` with `loadingState: 'idle' | 'fetching' | 'playing'`
- Update `speakWithGoogleTTS` to accept callbacks or split into fetch + play phases
- Alternative: Keep TTS function as-is but have `speakValue` set different states:
  - Set `'fetching'` before the API call
  - Set `'playing'` after receiving the blob, before `audio.play()`
  - Set `'idle'` when audio ends or on error
- Update button text:
  - `'fetching'` → "Loading..."
  - `'playing'` → "Playing..." (or just show speaker icon animating)

**Location**: Lines 100, 55-87, 104-116, 259-283

---

### 3. Lock Speed Controls During Loading/Playing

**What**: Disable speed adjustment buttons while audio is being fetched or played.

**Implementation**:
- Add `disabled={loadingState !== 'idle'}` to:
  - Speed down button (line 286-293)
  - Speed up button (line 295-302)
  - Speed reset button (line 303-310)
- Optionally add a tooltip or visual hint that speed applies to next playback

**Location**: Lines 286-310

---

### 4. Clean Up Audio URLs to Prevent Memory Leaks

**What**: Ensure blob URLs are revoked even if user navigates away before audio finishes.

**Implementation**:
- Add `audioRef = useRef<HTMLAudioElement | null>(null)` to store current audio
- Add `audioUrlRef = useRef<string | null>(null)` to store current blob URL
- In `speakWithGoogleTTS` (or a wrapper), store references before playing
- Add `useEffect` cleanup:
  ```typescript
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current)
        audioUrlRef.current = null
      }
    }
  }, [])
  ```
- Update the audio creation to use these refs

**Location**: Lines 55-87, 102-103 (new refs), new useEffect after line 116

---

## File Changes Summary

| File | Changes |
|------|---------|
| `src/app/toolbox/dictation-practice/page.tsx` | All changes in this single file |

---

## Implementation Order

1. **Refactor loading state** → Change from boolean to `'idle' | 'fetching' | 'playing'`
2. **Add error state** → Add state variable and error display UI
3. **Update speakValue/TTS function** → Set appropriate states at each phase
4. **Disable speed controls** → Add disabled prop based on loading state
5. **Add audio cleanup** → Add refs and useEffect for cleanup
6. **Test all scenarios**:
   - Normal flow: Start → audio plays → check answer
   - Error flow: Simulate API failure → error shows → retry works
   - Speed controls disabled during playback
   - Navigate away during playback (verify cleanup)
