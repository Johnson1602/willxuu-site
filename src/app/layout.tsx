import type { Metadata } from 'next'
import { Geist, Geist_Mono, Inter } from 'next/font/google'

import { Analytics } from '@vercel/analytics/react'

import { ThemeProvider } from '@/components/theme-provider'
import { ThemeToggle } from '@/components/theme-toggle'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

import '@/styles/globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

const siteUrl = 'https://willxuu.com'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Weiyi Xu - Frontend Developer',
    template: '%s | Weiyi Xu',
  },
  description:
    'Personal website of Weiyi Xu, a frontend developer at Xiaomi. Building mini tools and sharing code.',
  keywords: [
    'Weiyi Xu',
    'frontend developer',
    'web developer',
    'React',
    'Next.js',
    'Xiaomi',
  ],
  authors: [{ name: 'Weiyi Xu', url: siteUrl }],
  creator: 'Weiyi Xu',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'Weiyi Xu',
    title: 'Weiyi Xu - Frontend Developer',
    description:
      'Personal website of Weiyi Xu, a frontend developer at Xiaomi. Building mini tools and sharing code.',
  },
  twitter: {
    card: 'summary',
    title: 'Weiyi Xu - Frontend Developer',
    description:
      'Personal website of Weiyi Xu, a frontend developer at Xiaomi. Building mini tools and sharing code.',
    creator: '@willxuu_',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Weiyi Xu',
  url: siteUrl,
  jobTitle: 'Frontend Developer',
  worksFor: {
    '@type': 'Organization',
    name: 'Xiaomi',
    url: 'https://www.mi.com/global/',
  },
  sameAs: ['https://github.com/Johnson1602', 'https://x.com/willxuu_'],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' className={inter.variable} suppressHydrationWarning>
      <head>
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
        suppressHydrationWarning
      >
        <ThemeProvider>
          <Header />
          <div className='fixed top-14 right-6 z-50'>
            <ThemeToggle />
          </div>
          <main className='mx-auto px-6 flex-1 w-full flex flex-col'>
            {children}
          </main>
          <Footer />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
