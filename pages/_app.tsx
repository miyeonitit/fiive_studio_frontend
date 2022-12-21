import '../styles/app.scss'
import '../styles/globals.css'
import '@sendbird/uikit-react/dist/index.css'
import Script from 'next/script'
import type { AppPropsWithLayout } from '../types/AppPropsWithLayout'

import { ThemeProvider } from 'styled-components'
import {
  lightTheme,
  MeetingProvider,
} from 'amazon-chime-sdk-component-library-react'

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page)

  return (
    <ThemeProvider theme={lightTheme}>
      <MeetingProvider>
        <Script
          src='https://player.live-video.net/1.11.0/amazon-ivs-player.min.js'
          strategy='beforeInteractive'
        />

        {getLayout(<Component {...pageProps} />)}
      </MeetingProvider>
    </ThemeProvider>
  )
}

export default MyApp
