import { ArrowUpRight } from 'lucide-react'
import styles from './page.module.css'

export default function Page() {
  return (
    <div className='min-h-screen flex flex-col items-center justify-center'>
      <div className='flex flex-col font-medium max-w-xl gap-y-2 md:gap-y-4 px-6'>
        <p>Hi, I&apos;m Weiyi <span className={styles.waveHand}>👋</span></p>
        <p>
          I&apos;m a frontend developer at{' '}
          <a
            href='https://www.mi.com/global/'
            target='_blank'
            className='inline-flex items-center underline'
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
          >
            GitHub <ArrowUpRight size={16} />
          </a>{' '}
          and my thoughts on{' '}
          <a
            href='https://x.com/willxuu_'
            target='_blank'
            className='inline-flex items-center underline'
          >
            X <ArrowUpRight size={16} />
          </a>
        </p>
      </div>
    </div>
  )
}
