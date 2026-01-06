import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dictation Practice',
  description:
    'Practice listening and typing phone numbers or place names. Improve your dictation skills with adjustable speech speed.',
  openGraph: {
    title: 'Dictation Practice | Weiyi Xu',
    description:
      'Practice listening and typing phone numbers or place names. Improve your dictation skills with adjustable speech speed.',
  },
  twitter: {
    title: 'Dictation Practice | Weiyi Xu',
    description:
      'Practice listening and typing phone numbers or place names. Improve your dictation skills with adjustable speech speed.',
  },
  alternates: {
    canonical: '/toolbox/dictation-practice',
  },
}

export default function DictationPracticeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
