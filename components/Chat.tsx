import React, { useState, useEffect } from 'react'
import kr from 'date-fns/locale/ko'
import { CSSProperties } from 'styled-components'

import * as SendBird from 'sendbird'
import SendbirdProvider from '@sendbird/uikit-react/SendbirdProvider'
import { ChannelProvider } from '@sendbird/uikit-react/Channel/context'
import ChannelUI from '@sendbird/uikit-react/Channel/components/ChannelUI'

import { config } from '../utils/HeaderConfig'
import AxiosRequest from '../utils/AxiosRequest'
import useStore from '../store/Sendbird'
import fiiveStudioUseStore from '../store/FiiveStudio'
import classRoomUseStore from '../store/classRoom'

import CustomChatRoom from './Sendbird/CustomChatRoom'
import CustomMessageInput from './Sendbird/CustomMessageInput'
import CustomDateSeparator from './Sendbird/CustomDateSeparator'
import CustomChatHeader from './Sendbird/CustomChatHeader'

type props = {
  userId: string
  userRole: string
  currentUrl: string
  isChatOpen: boolean
  setIsChatOpen: React.Dispatch<React.SetStateAction<boolean>>
  emojiContainer: object
  chatHeightStyle: CSSProperties
}

const Chat = (props: props) => {
  const { userId } = props

  // 라이브 참여자 목록 on, off에 따라 typing input을 숨기기 위한 state
  const isUserList = useStore((state: any) => state.isUserList)

  // emojiContainer를 전역적으로 관리하기 위한 state
  const contextAddEmojiContainer = useStore(
    (state: any) => state.addEmojiContainer
  )

  // user auth token for API
  const authToken = fiiveStudioUseStore((state: any) => state.authToken)

  // user access token for Senbird Access
  const [accessToken, setAccessToken] = useState(false)

  const [stringSet] = useState({
    TYPING_INDICATOR__AND: '님, ',
    TYPING_INDICATOR__IS_TYPING: '님이 입력 중이에요.',
    TYPING_INDICATOR__ARE_TYPING: '님이 입력 중이에요.',
    TYPING_INDICATOR__MULTIPLE_TYPING: '여러 명이 입력 중이에요.',
    CHANNEL__MESSAGE_LIST__NOTIFICATION__NEW_MESSAGE: '개의 새로운 메시지',
    CHANNEL__MESSAGE_LIST__NOTIFICATION__ON: '도착',
  })

  const appId = process.env.NEXT_PUBLIC_SENDBIRD_APP_ID

  // Set default session token expiration period to 1 minute.
  const DEFAULT_SESSION_TOKEN_PERIOD = 1 * 60 * 1000

  const issueSessionToken = async () => {
    const period = DEFAULT_SESSION_TOKEN_PERIOD

    const requestUrl = `/user/token`

    const body = {
      expires_at: Date.now() + period,
    }

    const responseData = await AxiosRequest({
      url: requestUrl,
      method: 'POST',
      body: body,
      token: authToken,
    })

    const result = await responseData

    return result.token
  }

  useEffect(() => {
    contextAddEmojiContainer(props.emojiContainer)
  }, [])

  useEffect(() => {
    if (!accessToken) {
      const intiateSession = async () => {
        const token = await issueSessionToken()
        setAccessToken(token)
      }
      intiateSession()
    }
  }, [accessToken])

  return (
    <>
      <SendbirdProvider
        appId={appId}
        userId={props.userId}
        accessToken={accessToken}
        stringSet={stringSet}
        dateLocale={kr}
      >
        <ChannelProvider channelUrl={props.currentUrl} isReactionEnabled={true}>
          <ChannelUI
            hasSeparator={true}
            isReactionEnabled={true}
            renderChannelHeader={() => (
              <CustomChatHeader
                userId={props.userId}
                userRole={props.userRole}
                channelUrl={props.currentUrl}
                isChatOpen={props.isChatOpen}
                setIsChatOpen={props.setIsChatOpen}
                chatHeightStyle={props.chatHeightStyle}
              />
            )}
            renderMessage={(message: {}) => (
              <CustomChatRoom
                message={message}
                userId={props.userId}
                channelUrl={props.currentUrl}
                emojiContainer={props.emojiContainer}
              />
            )}
            renderMessageInput={() =>
              isUserList ? (
                <></>
              ) : (
                <CustomMessageInput
                  userId={props.userId}
                  userRole={props.userRole}
                />
              )
            }
            renderCustomSeparator={() => <div></div>}
            // renderTypingIndicator={(props) => <Tester props={props} />}
          ></ChannelUI>
        </ChannelProvider>
      </SendbirdProvider>
    </>
  )
}

export default Chat
