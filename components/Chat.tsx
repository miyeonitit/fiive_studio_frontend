import React, { useState, useEffect } from 'react'
import kr from 'date-fns/locale/ko'

import * as SendBird from 'sendbird'
import SendbirdProvider from '@sendbird/uikit-react/SendbirdProvider'
import { ChannelProvider } from '@sendbird/uikit-react/Channel/context'
import ChannelUI from '@sendbird/uikit-react/Channel/components/ChannelUI'

import { config } from '../utils/HeaderConfig'
import useStore from '../store/Sendbird'
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
}

const Chat = (props: props) => {
  const { userId } = props

  // 라이브 참여자 목록 on, off에 따라 typing input을 숨기기 위한 state
  const isUserList = useStore((state: any) => state.isUserList)

  // emojiContainer를 전역적으로 관리하기 위한 state
  const contextAddEmojiContainer = useStore(
    (state: any) => state.addEmojiContainer
  )

  const [stringSet] = useState({
    TYPING_INDICATOR__AND: '님, ',
    TYPING_INDICATOR__IS_TYPING: '님이 입력 중이에요.',
    TYPING_INDICATOR__ARE_TYPING: '님이 입력 중이에요.',
    TYPING_INDICATOR__MULTIPLE_TYPING: '여러 명이 입력 중이에요.',
    CHANNEL__MESSAGE_LIST__NOTIFICATION__NEW_MESSAGE: '개의 새로운 메시지',
    CHANNEL__MESSAGE_LIST__NOTIFICATION__ON: '도착',
  })

  const appId = process.env.NEXT_PUBLIC_SENDBIRD_APP_ID

  useEffect(() => {
    contextAddEmojiContainer(props.emojiContainer)
  }, [])

  return (
    <>
      <SendbirdProvider
        appId={appId}
        userId={props.userId}
        // accessToken='3b6ca60ca19e11b8234b29ab07d200868045dd75'
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
                userRole={props.userId}
                channelUrl={props.currentUrl}
                isChatOpen={props.isChatOpen}
                setIsChatOpen={props.setIsChatOpen}
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
