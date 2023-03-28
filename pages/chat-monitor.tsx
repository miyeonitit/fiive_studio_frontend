// import Layout from "../../components/FiiveLearnerLayout";
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { getCookie, setCookie } from 'cookies-next'
import { ToastContainer, toast, cssTransition } from 'react-toastify'

import 'animate.css'
import 'react-toastify/dist/ReactToastify.css'

import { NextPageWithLayout } from '../types/NextPageWithLayout'

import AxiosRequest from '../utils/AxiosRequest'

type ivsType = {
  channel: { arn: string; authorized: boolean; playbackUrl: string }
}

type sendbirdChatType = {
  name: string
  channel_url: string
  members: Array<object>
}

type props = {
  classroom: { ivs: ivsType; sendbird: sendbirdChatType }
  authTokenValue: string
  sendbirdAccessToken: string
}

const ChatMonitor = dynamic(() => import('../components/ChatMonitor'), {
  ssr: false,
  loading: () => <div>Loading...</div>,
})

const ChatMonitorPage: NextPageWithLayout = (props: props) => {
  const router = useRouter()

  // 1. auth-token을 query에서 받아와서 setState로 저장
  const authToken = router.query.token

  // 2-1. user infomation을 저장하기 위한 state
  const [userInfomation, setUserInfomation] = useState({})

  // 2-2. sendbird 채팅방의 channel url을 저장하기 위한 state
  const [currentChannelUrl, setCurrentChannelUrl] = useState('')

  // 2-3. user's sendbird access token을 저장하기 위한 state
  const [accessToken, setAccessToken] = useState('')

  const fadeUp = cssTransition({
    enter: 'animate__animated animate__customFadeInUp',
    exit: 'animate__animated animate__fadeOut',
  })

  const getClassRoomData = async (authToken: string | string[]) => {
    const classId = router.query.classId
    const sessionIdx = router.query.sessionIdx

    // 2-1. get user's classroom infomation API
    const requestUrl = `/classroom/${classId}/session/${sessionIdx}`

    const responseData = await AxiosRequest({
      url: requestUrl,
      method: 'GET',
      body: '',
      token: authToken,
    })

    setCurrentChannelUrl(responseData?.sendbird?.channel_url)
  }

  const getSendbirdUserToken = async (authToken: string | string[]) => {
    const DEFAULT_SESSION_TOKEN_PERIOD = 1 * 60 * 1000

    const requestUrl = `/user/token`

    const body = {
      expires_at: Date.now() + DEFAULT_SESSION_TOKEN_PERIOD,
    }

    const responseData = await AxiosRequest({
      url: requestUrl,
      method: 'POST',
      body: body,
      token: authToken,
    })

    const sendbirdAccessToken = await responseData.token
    setAccessToken(sendbirdAccessToken)
  }

  const getUserInfomation = async (authToken: string | string[]) => {
    const requestUrl = `/auth`

    const responseData = await AxiosRequest({
      url: requestUrl,
      method: 'GET',
      body: '',
      token: authToken,
    })

    if (responseData.name !== 'AxiosError') {
      setUserInfomation(responseData)
    } else {
      toast.error(
        <div className='toast_error_box'>
          <Image
            src='/pages/Sendbird/toast_warning_icon.svg'
            width={16}
            height={16}
            alt='toastWarningIcon'
          />
          <span className='toast_error_text'>
            수강 권한을 다시 확인해 주세요!
          </span>
        </div>,
        { transition: fadeUp }
      )
    }
  }

  // 1. params query로 전해진 auth-token 검증
  useEffect(() => {
    // url 중 params query로 token이 전해지지 않았다면, 다시 url 복사 버튼 클릭 유도
    if (authToken) {
      // 토큰값이 저장되지 않았다면, 다시 params query로 정해진 token을 setState로 저장
      setCookie('auth-token', authToken)

      // 2-1. get user's classroom infomation API
      getClassRoomData(authToken)

      // 2-2. get user's id
      getUserInfomation(authToken)

      // 2-3. create user's sendbird access token
      getSendbirdUserToken(authToken)
    }
  }, [authToken])

  return (
    <div className='fiive chat-monitor page'>
      {typeof userInfomation !== 'undefined' &&
        typeof currentChannelUrl !== 'undefined' &&
        Object.keys(userInfomation).length > 0 &&
        Object.keys(currentChannelUrl).length > 0 &&
        accessToken && (
          <ChatMonitor
            userId={userInfomation?.userId}
            channelUrl={currentChannelUrl}
            sendbirdAccessToken={accessToken}
          ></ChatMonitor>
        )}

      <ToastContainer
        position='top-center'
        autoClose={2000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='colored'
        transition={fadeUp}
      />
    </div>
  )
}

// ChatMonitorPage.getLayout = (page: ReactElement) => {
//   return <Layout>{page}</Layout>;
// };

export default ChatMonitorPage
