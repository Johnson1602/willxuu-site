import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My work at Xiaomi | Weiyi Xu',
  description: 'A collection of my work and highlights from Xiaomi.',
  alternates: {
    canonical: '/career/xiaomi',
  },
  openGraph: {
    title: 'My work at Xiaomi',
    description: 'A collection of my work and highlights from Xiaomi.',
    url: '/career/xiaomi',
  },
}

export default function XiaomiCareerPage() {
  return (
    <article className='mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center py-20'>
      <div className='max-w-2xl'>
        <p className='mb-6 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground'>
          <span
            aria-hidden='true'
            className='size-2 rounded-full bg-[#ff6900] shadow-[0_0_0_5px_rgba(255,105,0,0.12)]'
          />
          Career chapter
        </p>

        <h1 className='text-5xl font-medium tracking-[-0.04em] text-balance sm:text-7xl'>
          My work at Xiaomi
        </h1>

        <p className='mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl'>
          A collection of the work, highlights, and lessons that shaped my time
          at Xiaomi. I&apos;m putting this chapter together—more soon.
        </p>
      </div>
    </article>
  )
}
