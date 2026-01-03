const DIGIT_WORDS: Record<string, string> = {
  '0': 'zero',
  '1': 'one',
  '2': 'two',
  '3': 'three',
  '4': 'four',
  '5': 'five',
  '6': 'six',
  '7': 'seven',
  '8': 'eight',
  '9': 'nine',
}

export function buildDigitSSML(digits: string): string {
  const spokenDigits = digits
    .split('')
    .map((d) => `${DIGIT_WORDS[d] || d}<break time="300ms"/>`)
    .join('')

  return `<speak>${spokenDigits}</speak>`
}

export function buildPlaceSSML(place: string): string {
  const spelled = place
    .toUpperCase()
    .split('')
    .map(
      (char) =>
        `<say-as interpret-as="characters">${char}</say-as><break time="200ms"/>`
    )
    .join('')

  return `<speak>${place}<break time="500ms"/>${spelled}</speak>`
}
