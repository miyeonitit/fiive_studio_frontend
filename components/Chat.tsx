import React, { useState, useEffect } from 'react'
import kr from 'date-fns/locale/ko'
import { CSSProperties } from 'styled-components'

import * as SendBird from 'sendbird'
import SendbirdProvider from '@sendbird/uikit-react/SendbirdProvider'
import { ChannelProvider } from '@sendbird/uikit-react/Channel/context'
import ChannelUI from '@sendbird/uikit-react/Channel/components/ChannelUI'

import AxiosRequest from '../utils/AxiosRequest'
import useStore from '../store/Sendbird'

import CustomChatHeader from './Sendbird/CustomChatHeader'
import CustomChatRoom from './Sendbird/CustomChatRoom'
import CustomMessageInput from './Sendbird/CustomMessageInput'

type props = {
  userId: string
  userRole: string
  currentUrl: string
  isChatOpen: boolean
  setIsChatOpen: React.Dispatch<React.SetStateAction<boolean>>
  emojiContainer: object
  chatHeightStyle: CSSProperties
  sendbirdAccessToken: string
  authTokenValue: string
}

const Chat = (props: props) => {
  const { userId } = props

  // 라이브 참여자 목록 on, off에 따라 typing input을 숨기기 위한 state
  const isUserList = useStore((state: any) => state.isUserList)

  // emojiContainer를 전역적으로 관리하기 위한 state
  const contextAddEmojiContainer = useStore(
    (state: any) => state.addEmojiContainer
  )

  // user access token for Senbird Access
  const [accessToken, setAccessToken] = useState(props?.sendbirdAccessToken)

  const [stringSet] = useState({
    PLACE_HOLDER__WRONG: '분명 무언가 잘못됐어요.',
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

  // create sendbird's user access token
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
      token: props?.authTokenValue,
    })

    const result = await responseData

    return result.token
  }

  useEffect(() => {
    contextAddEmojiContainer(props.emojiContainer)
  }, [])

  // not have sendbird's user access token, create sendbird's user access token
  useEffect(() => {
    if (!props.sendbirdAccessToken) {
      const intiateSession = async () => {
        const token = await issueSessionToken()
        setAccessToken(token)
      }

      intiateSession()
    }
  }, [props.sendbirdAccessToken])

  return (
    <>
      {props.sendbirdAccessToken !== '' &&
        typeof props.currentUrl !== 'undefined' && (
          <SendbirdProvider
            appId={appId}
            userId={props?.userId}
            accessToken={props?.sendbirdAccessToken}
            stringSet={stringSet}
            dateLocale={kr}
          >
            <ChannelProvider
              channelUrl={props?.currentUrl}
              isReactionEnabled={true}
            >
              <ChannelUI
                hasSeparator={true}
                isReactionEnabled={true}
                renderChannelHeader={() => (
                  <CustomChatHeader
                    userId={props?.userId}
                    userRole={props?.userRole}
                    channelUrl={props?.currentUrl}
                    isChatOpen={props?.isChatOpen}
                    setIsChatOpen={props?.setIsChatOpen}
                    chatHeightStyle={props?.chatHeightStyle}
                  />
                )}
                renderMessage={(message: {}) => (
                  <CustomChatRoom
                    message={message}
                    userId={props?.userId}
                    userRole={props?.userRole}
                    channelUrl={props?.currentUrl}
                    emojiContainer={props?.emojiContainer}
                  />
                )}
                renderMessageInput={() =>
                  isUserList ? (
                    <></>
                  ) : (
                    <CustomMessageInput
                      userId={props?.userId}
                      userRole={props?.userRole}
                    />
                  )
                }
                renderCustomSeparator={() => <div></div>}
                // renderTypingIndicator={(props) => <Tester props={props} />}
              ></ChannelUI>
            </ChannelProvider>
          </SendbirdProvider>
        )}
    </>
  )
}

export default Chat
