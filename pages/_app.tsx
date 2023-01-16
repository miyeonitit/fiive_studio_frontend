import { useEffect } from 'react'
import Script from 'next/script'

import AxiosRequest from '../utils/AxiosRequest'
import classRoomUseStore from '../store/classRoom'

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

  // ivs, sendbird chat infomation 정보를 저장하는 state
  const setIvsData = classRoomUseStore((state: any) => state.setIvsData)
  const setChatData = classRoomUseStore((state: any) => state.setChatData)

  const testIvsValue = process.env.NEXT_PUBLIC_TEST_IVS_CHANNEL_VALUE

  const getIvsAndChatData = async () => {
    const requestUrl = `/classroom/${testIvsValue}/session/0`

    const responseData = await AxiosRequest({
      url: requestUrl,
      method: 'GET',
      body: '',
      token: '',
    })

    setIvsData(responseData.ivs.channel)
    setChatData(responseData.sendbird)
  }

  const reset = () => {
    if (typeof window !== 'undefined') {
      setOffsetX(window.innerWidth)
    }
  }

  useEffect(() => {
    window.addEventListener('resize', reset)

    return () => {
      window.removeEventListener('resize', reset)
    }
  })

  useEffect(() => {
    reset()
    getIvsAndChatData()
  }, [])

  return (
    <>
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
