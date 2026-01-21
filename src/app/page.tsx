'use client'

import Link from 'next/link'
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
    <div className='flex flex-col justify-center flex-1 max-w-3xl mx-auto w-full'>
      <div className='flex flex-col font-medium gap-y-2 md:gap-y-4 mb-16'>
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

        <p>
          I build random{' '}
          <Link href='/toolbox' className='underline'>
            mini tools
          </Link>
        </p>

        <p>
          You can also find my code on{' '}
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
