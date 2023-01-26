import { useEffect, useState } from 'react'
import type { AppContext } from 'next/app'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Script from 'next/script'
import cookies from 'next-cookies'
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
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page)

  // 반응형 미디어쿼리 스타일 지정을 위한 브라우저 넓이 측정 전역 state
  const setOffsetX = fiiveStudioUseStore((state: any) => state.setOffsetX)

  // axios request header token state
  const headerToken = fiiveStudioUseStore((state: any) => state.headerToken)
  const setHeaderToken = fiiveStudioUseStore(
    (state: any) => state.setHeaderToken
  )

  // ivs, sendbird chat infomation 정보를 저장하는 state
  const setIvsData = classRoomUseStore((state: any) => state.setIvsData)
  const setChatData = classRoomUseStore((state: any) => state.setChatData)
  const chatData = classRoomUseStore((state: any) => state.chatData)

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

    // setIvsData(pageProps?.classroom?.ivs?.channel)
    // setChatData(pageProps?.classroom?.sendbird)
  }, [])

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
  let session_id

  // 4. save class_id, session_id value for classroom API
  queryArr?.forEach((value, idx) => {
    // url params key: queryProperty[0], url params value: queryProperty[1]
    const queryProperty = value.split('=')

    switch (queryProperty[0]) {
      case 'classId':
        class_id = queryProperty[1]
        break
      case 'sessionIdx':
        session_id = queryProperty[1]
        break
    }
  })

  // 5. get user's classroom infomation API
  const requestUrl = `/classroom/${class_id}/session/${session_id}`

  const classroom = await AxiosRequest({
    url: requestUrl,
    method: 'GET',
    body: '',
    token: authoriztion['auth-token'],
  })

  pageProps = { ...pageProps, classroom, auth_token }

  return { pageProps }
}

export default MyApp
