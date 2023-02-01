import { useEffect, useState } from 'react'
import kr from 'date-fns/locale/ko'
import { v4 as uuidv4 } from 'uuid'

import * as SendBird from 'sendbird'
import { BaseChannel } from '@sendbird/chat'
import { BaseMessage } from '@sendbird/chat/message'
import { GroupChannelHandler } from '@sendbird/chat/groupChannel'
import SendbirdProvider from '@sendbird/uikit-react/SendbirdProvider'
import sendbirdSelectors from '@sendbird/uikit-react/sendbirdSelectors'
import useSendbirdStateContext from '@sendbird/uikit-react/useSendbirdStateContext'
import { ChannelProvider } from '@sendbird/uikit-react/Channel/context'
import ChannelUI from '@sendbird/uikit-react/Channel/components/ChannelUI'

import classRoomUseStore from '../store/classRoom'
import fiiveStudioUseStore from '../store/FiiveStudio'

import CustomTeacherPopupChat from './Sendbird/CustomTeacherPopupChat'

type props = {
  userId: string
  channelUrl: string
}

const MessageList = (props: props) => {
  const context = useSendbirdStateContext()
  const sdk = sendbirdSelectors.getSdk(context)

  useEffect(() => {
    const intvl = window.setInterval(() => {
      if (window.scrollY + window.innerHeight === document.body.scrollHeight) {
        window.clearInterval(intvl)
      } else {
        window.scrollTo(0, document.body.scrollHeight)
      }
    }, 1000)

    if (sdk?.groupChannel?.addGroupChannelHandler) {
      const groupChannelHandler = new GroupChannelHandler({
        onMessageReceived: (channel: BaseChannel, message: BaseMessage) => {
          window.setTimeout(() => {
            window.scrollTo(0, document.body.scrollHeight)
          }, 100)
        },
      })

      sdk.groupChannel.addGroupChannelHandler(
        'GROUP_CHANNEL_HANDLER',
        groupChannelHandler
      )
    }

    return () => {
      window.clearInterval(intvl)

      if (sdk?.groupChannel?.addGroupChannelHandler) {
        sdk.groupChannel.removeGroupChannelHandler('GROUP_CHANNEL_HANDLER')
      }
    }
  })

  return (
    <>
      <ChannelUI
        hasSeparator={false}
        isReactionEnabled={false}
        renderChannelHeader={() => <></>}
        renderMessage={(message: {}) => (
          <CustomTeacherPopupChat message={message} userId='learner' />
        )}
        renderMessageInput={() => <></>}
        renderCustomSeparator={() => <div></div>}
      ></ChannelUI>
    </>
  )
}

const ChatMonitor = (props: props) => {
  const [stringSet] = useState({
    TYPING_INDICATOR__AND: '님, ',
    TYPING_INDICATOR__IS_TYPING: '님이 입력 중이에요.',
    TYPING_INDICATOR__ARE_TYPING: '님이 입력 중이에요.',
    TYPING_INDICATOR__MULTIPLE_TYPING: '여러 명이 입력 중이에요.',
    CHANNEL__MESSAGE_LIST__NOTIFICATION__NEW_MESSAGE: '개의 새로운 메시지',
    CHANNEL__MESSAGE_LIST__NOTIFICATION__ON: '도착',
  })

  // ivs, sendbird chat infomation 정보를 저장하는 state
  const chatData = classRoomUseStore((state: any) => state.chatData)

  const appId = process.env.NEXT_PUBLIC_SENDBIRD_APP_ID

  return (
    <div className='chat-monitor'>
      <SendbirdProvider
        appId={appId}
        userId={props.userId}
        stringSet={stringSet}
        dateLocale={kr}
      >
        <ChannelProvider channelUrl={props.channelUrl}>
          <MessageList></MessageList>
        </ChannelProvider>
      </SendbirdProvider>
    </div>
  )
}

export default ChatMonitor
