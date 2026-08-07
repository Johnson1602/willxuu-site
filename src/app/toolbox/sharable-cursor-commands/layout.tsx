import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sharable Cursor Commands',
  description:
    'Generate shareable links for Cursor IDE commands. Create and share custom commands with your team.',
  openGraph: {
    title: 'Sharable Cursor Commands | Weiyi Xu',
    description:
      'Generate shareable links for Cursor IDE commands. Create and share custom commands with your team.',
  },
  twitter: {
    title: 'Sharable Cursor Commands | Weiyi Xu',
    description:
      'Generate shareable links for Cursor IDE commands. Create and share custom commands with your team.',
  },
  alternates: {
    canonical: '/toolbox/sharable-cursor-commands',
  },
}

export default function SharableCursorCommandsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
