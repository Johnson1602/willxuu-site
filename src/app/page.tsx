'use client'

import { ArrowUpRight } from 'lucide-react'
import posthog from 'posthog-js'
import styles from './page.module.css'

export default function Page() {
  const handleExternalLinkClick = (linkName: string, url: string) => {
    posthog.capture('clicked_external_link', {
      link_name: linkName,
      link_url: url,
    })
  }

  return (
    <div className='min-h-[calc(100vh-4rem)] flex flex-col justify-center'>
      <div className='flex flex-col font-medium mb-28 gap-y-2 md:gap-y-4'>
        <p>
          Hi, I&apos;m Weiyi <span className={styles.waveHand}>👋</span>
        </p>
        <p>
          I&apos;m a frontend developer at{' '}
          <a
            href='https://www.mi.com/global/'
            target='_blank'
            className='inline-flex items-center underline'
            onClick={() =>
              handleExternalLinkClick('Xiaomi', 'https://www.mi.com/global/')
            }
          >
            Xiaomi <ArrowUpRight size={16} />
          </a>
        </p>
        <p>This site is still a work in progress</p>
        <p>
          You can find my code on{' '}
          <a
            href='https://github.com/Johnson1602'
            target='_blank'
            className='inline-flex items-center underline'
            onClick={() =>
              handleExternalLinkClick(
                'GitHub',
                'https://github.com/Johnson1602'
              )
            }
          >
            GitHub <ArrowUpRight size={16} />
          </a>{' '}
          and my thoughts on{' '}
          <a
            href='https://x.com/willxuu_'
            target='_blank'
            className='inline-flex items-center underline'
            onClick={() =>
              handleExternalLinkClick('X', 'https://x.com/willxuu_')
            }
          >
            X <ArrowUpRight size={16} />
          </a>
        </p>
      </div>
    </div>
  )
}
