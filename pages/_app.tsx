import { useEffect } from 'react'
import Head from 'next/head'
import Script from 'next/script'

import '@sendbird/uikit-react/dist/index.css'
import {
  lightTheme,
  MeetingProvider,
} from 'amazon-chime-sdk-component-library-react'
import { ThemeProvider } from 'styled-components'

import '../styles/app.scss'
import '../styles/globals.css'
import type { AppPropsWithLayout } from '../types/AppPropsWithLayout'
import fiiveStudioUseStore from '../store/FiiveStudio'

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page)

  // 반응형 미디어쿼리 스타일 지정을 위한 브라우저 넓이 측정 전역 state
  const setOffsetX = fiiveStudioUseStore((state: any) => state.setOffsetX)

  const reset = () => {
    if (typeof window !== 'undefined') {
      setOffsetX(window.innerWidth)
    }
  }

  useEffect(() => {
    window.addEventListener('resize', reset)

    // local에서는 devleopment
    console.log(process.env.NODE_ENV, 'process.env.NODE_ENV')

    return () => {
      window.removeEventListener('resize', reset)
    }
  })

  return (
    <>
      <Head>
        <title>fiive studio</title>
        <meta name='viewport' content='viewport-fit=cover' />
      </Head>

      <ThemeProvider theme={lightTheme}>
        <MeetingProvider>
          <Script
            src='https://player.live-video.net/1.11.0/amazon-ivs-player.min.js'
            strategy='beforeInteractive'
          />

          {getLayout(<Component {...pageProps} />)}
        </MeetingProvider>
      </ThemeProvider>
    </>
  )
}

export default MyApp
