import { useEffect, useState } from 'react'
import type { AppContext } from 'next/app'
import Head from 'next/head'
import Script from 'next/script'
import cookies from 'next-cookies'
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

  // 1. save class id
  const setClassId = fiiveStudioUseStore((state: any) => state.setClassId)

  // 2. ivs infomation 정보를 저장하는 state
  const setIvsData = classRoomUseStore((state: any) => state.setIvsData)

  // 3. class infomation 정보를 저장하는 state
  const setClassData = classRoomUseStore((state: any) => state.setClassData)

  // 4. sendbird chat infomation 정보를 저장하는 state
  const setChatData = classRoomUseStore((state: any) => state.setChatData)

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

    // auth-token cookie가 존재하지 않다면 fiive login page로 이동
    const classId = router.query.classId

    if (classId && !getCookie('auth-token')) {
      window.open('https://alpha.fiive.me/login', '_self')
    }

    // 1. save classId
    setClassId(pageProps?.class_id)

    // 2. save ivs Data in classroom
    setIvsData(pageProps?.classroom?.ivs?.channel)

    // 3. save class Data in classroom
    setClassData(pageProps?.classroom?.class)

    // 4. save chat Data
    setChatData(pageProps?.classroom?.sendbird)
  }, [pageProps])

  // 현재 시간 기준으로 0초가 될 때, 5초의 주기마다 갱신
  useEffect(() => {
    setInterval(() => {
      const timeSeconds = new Date().getSeconds()

      if (timeSeconds < 5) {
        setNowTime(new Date())
      }
    }, 5000)
  }, [nowTime])

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

          {getLayout(<Component {...pageProps} />)}
        </MeetingProvider>
      </ThemeProvider>
    </>
  )
}

MyApp.getInitialProps = async ({ Component, ctx }: AppContext) => {
  let pageProps = {}

  // _app.tsx 뿐만 아니라 하위 컴포넌트에서도 getInitialProps를 실행
  // 하위 컴포넌트에 getInitialProps가 있다면 추가 (각 개별 컴포넌트에서 사용할 값 추가)
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx)
  }

  // 1. get user's auth token from fiive cookie
  const authoriztion = cookies(ctx)
  const auth_token = authoriztion['auth-token']

  // 2. get page url path
  const query = ctx.asPath?.split('?')[1]
  const queryArr = query?.split('&')

  // 3. declare class_id, session_id for classroom API
  let class_id
  let session_idx

  // 4. save class_id, session_id value for classroom API
  queryArr?.forEach((value, idx) => {
    // url params key: queryProperty[0], url params value: queryProperty[1]
    const queryProperty = value.split('=')

    switch (queryProperty[0]) {
      case 'classId':
        class_id = queryProperty[1]
        break
      case 'sessionIdx':
        session_idx = queryProperty[1]
        break
    }
  })

  let classroom
  let sendbirdAccessToken

  if (!ctx?.asPath?.startsWith('/chat-monitor')) {
    // 5. get user's classroom infomation API
    const classroomRequestUrl = `/classroom/${class_id}/session/${session_idx}`

    classroom = await AxiosRequest({
      url: classroomRequestUrl,
      method: 'GET',
      body: '',
      token: authoriztion['auth-token'],
    })

    // 6. create user's sendbird access token
    // Set default session token expiration period to 1 minute.
    const DEFAULT_SESSION_TOKEN_PERIOD = 1 * 60 * 1000

    const accessTokenRequestUrl = `/user/token`

    const body = {
      expires_at: Date.now() + DEFAULT_SESSION_TOKEN_PERIOD,
    }

    const responseData = await AxiosRequest({
      url: accessTokenRequestUrl,
      method: 'POST',
      body: body,
      token: authoriztion['auth-token'],
    })

    sendbirdAccessToken = await responseData.token
  }

  pageProps = {
    ...pageProps,
    classroom,
    auth_token,
    class_id,
    sendbirdAccessToken,
  }

  return { pageProps }
}

export default MyApp
