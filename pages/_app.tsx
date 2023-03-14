import { useEffect, useLayoutEffect, useState } from 'react'
import Head from 'next/head'
import Script from 'next/script'
import { useRouter } from 'next/router'
import { getCookie } from 'cookies-next'
import type { AppPropsWithLayout } from '../types/AppPropsWithLayout'

import '@sendbird/uikit-react/dist/index.css'
import {
  lightTheme,
  MeetingProvider,
} from 'amazon-chime-sdk-component-library-react'
import { ThemeProvider } from 'styled-components'

import '../styles/app.scss'
import '../styles/globals.css'

import AxiosRequest from '../utils/AxiosRequest'
import classRoomUseStore from '../store/classRoom'
import fiiveStudioUseStore from '../store/FiiveStudio'

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const router = useRouter()

  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page)

  // update now local time
  const nowTime = fiiveStudioUseStore((state: any) => state.nowTime)
  const setNowTime = fiiveStudioUseStore((state: any) => state.setNowTime)

  // 반응형 미디어쿼리 스타일 지정을 위한 브라우저 넓이 측정 전역 state
  const setOffsetX = fiiveStudioUseStore((state: any) => state.setOffsetX)

  const setAuthToken = fiiveStudioUseStore((state: any) => state.setAuthToken)

  // ivs infomation 정보를 저장하는 state
  const setIvsData = classRoomUseStore((state: any) => state.setIvsData)

  // class infomation 정보를 저장하는 state
  const setClassData = classRoomUseStore((state: any) => state.setClassData)

  // sendbird chat infomation 정보를 저장하는 state
  const setChatData = classRoomUseStore((state: any) => state.setChatData)

  const [classroom, setClassroom] = useState({})
  const [sendbirdAccessToken, setSendbirdAccessToken] = useState('')

  const authTokenValue = getCookie('auth-token')

  // 1. get user's classroom infomation API
  const getClassRoomInfomation = async (authTokenValue: string) => {
    const classId = router.query.classId
    const sessionIdx = router.query.sessionIdx

    const requestUrl = `/classroom/${classId}/session/${sessionIdx}`

    const responseData = await AxiosRequest({
      url: requestUrl,
      method: 'GET',
      body: '',
      token: authTokenValue,
    })

    if (responseData.name !== 'AxiosError') {
      // save all Infomation (ivs + class + chat)
      setClassroom(responseData)

      // save ivs Data in classroom
      setIvsData(responseData?.ivs?.channel)

      // save class Data in classroom
      setClassData(responseData?.class)

      // save chat Data
      setChatData(responseData?.sendbird)
    }
  }

  // 2. create user's Sendbird access token
  const getSendbirdAccessToken = async (authTokenValue: string) => {
    // Set default session token expiration period to 1 minute.
    const DEFAULT_SESSION_TOKEN_PERIOD = 1 * 60 * 1000

    const requestUrl = `/user/token`

    const body = {
      expires_at: Date.now() + DEFAULT_SESSION_TOKEN_PERIOD,
    }

    const responseData = await AxiosRequest({
      url: requestUrl,
      method: 'POST',
      body: body,
      token: authTokenValue,
    })

    const tokenValue = await responseData.token
    setSendbirdAccessToken(tokenValue)
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

  // 현재 시간 기준으로 0초가 될 때, 5초의 주기마다 갱신
  useEffect(() => {
    setInterval(() => {
      const timeSeconds = new Date().getSeconds()

      if (timeSeconds < 5) {
        setNowTime(new Date())
      }
    }, 5000)
  }, [nowTime])

  useLayoutEffect(() => {
    reset()

    if (authTokenValue && Object.keys(router.query).length > 0) {
      setAuthToken(authTokenValue)

      // 1. get user's classroom infomation API
      getClassRoomInfomation(authTokenValue)

      // 2. create user's Sendbird access token
      getSendbirdAccessToken(authTokenValue)
    }
  }, [router])

  return (
    <>
      <Head>
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0'
        />
      </Head>

      <ThemeProvider theme={lightTheme}>
        <MeetingProvider>
          <Script
            src='https://player.live-video.net/1.11.0/amazon-ivs-player.min.js'
            strategy='beforeInteractive'
          />

          {getLayout(
            <Component
              {...pageProps}
              classroom={classroom}
              authTokenValue={authTokenValue}
              sendbirdAccessToken={sendbirdAccessToken}
            />
          )}
        </MeetingProvider>
      </ThemeProvider>
    </>
  )
}

export default MyApp
