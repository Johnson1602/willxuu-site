import type { Metadata } from 'next'
import { Geist, Geist_Mono, Inter } from 'next/font/google'

import { Analytics } from '@vercel/analytics/react'

import { ThemeProvider } from '@/components/theme-provider'
import { Header } from '@/components/header'

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

export const metadata: Metadata = {
  title: 'Weiyi Xu',
  description: "Weiyi's personal website",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' className={inter.variable} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider>
          <Header />
          <main className='max-w-3xl mx-auto px-6 pt-16'>{children}</main>
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
