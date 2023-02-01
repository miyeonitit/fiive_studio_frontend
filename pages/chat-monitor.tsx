// import Layout from "../../components/FiiveLearnerLayout";
import { useEffect, useState } from 'react'
import { NextPageWithLayout } from '../types/NextPageWithLayout'
import dynamic from 'next/dynamic'

import AxiosRequest from '../utils/AxiosRequest'
import fiiveStudioUseStore from '../store/FiiveStudio'

type ivsType = {
  channel: { arn: string; authorized: boolean; playbackUrl: string }
}

type sendbirdChatType = {
  name: string
  channel_url: string
  members: Array<object>
}

type props = {
  emoji_data?: { emojis: Array<object>; id: number; name: string; url: string }
  classroom: { ivs: ivsType; sendbird: sendbirdChatType }
  auth_token: string
}

const ChatMonitor = dynamic(() => import('../components/ChatMonitor'), {
  ssr: false,
  loading: () => <div>Loading...</div>,
})

const ChatMonitorPage: NextPageWithLayout = (props: props) => {
  // user infomation state
  const userInfomation = fiiveStudioUseStore(
    (state: any) => state.userInfomation
  )
  const setUserInfomation = fiiveStudioUseStore(
    (state: any) => state.setUserInfomation
  )

  const getUserInfomation = async () => {
    const requestUrl = `/auth`

    const responseData = await AxiosRequest({
      url: requestUrl,
      method: 'GET',
      body: '',
      token: props.auth_token,
    })

    if (responseData.name !== 'AxiosError') {
      setUserInfomation(responseData)
    } else {
      console.log('수강 권한 없음')
      // [backlog] 유저 식별에 실패하면 수강권한 없다는 페이지로 이동되어야 함!
    }
  }

  useEffect(() => {
    //  get user infomation with user auth_token
    getUserInfomation()
  }, [])

  return (
    <div className='fiive chat-monitor page'>
      <ChatMonitor
        userId={userInfomation?.userId}
        channelUrl={props?.classroom?.sendbird?.channel_url}
      ></ChatMonitor>
    </div>
  )
}

// ChatMonitorPage.getLayout = (page: ReactElement) => {
//   return <Layout>{page}</Layout>;
// };

export default ChatMonitorPage
