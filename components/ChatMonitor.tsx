import { useEffect, useState } from 'react'
import kr from 'date-fns/locale/ko'
import { v4 as uuidv4 } from 'uuid'

import * as SendBird from 'sendbird'
import SendbirdProvider from '@sendbird/uikit-react/SendbirdProvider'
import sendbirdSelectors from '@sendbird/uikit-react/sendbirdSelectors'
import useSendbirdStateContext from '@sendbird/uikit-react/useSendbirdStateContext'
import { OpenChannelHandler } from '@sendbird/chat/openChannel'
import {
  GroupChannel,
  GroupChannelHandler,
  SendbirdGroupChat,
} from '@sendbird/chat/groupChannel'

import { BaseChannel } from '@sendbird/chat'
import { BaseMessage } from '@sendbird/chat/message'

import { ChannelProvider } from '@sendbird/uikit-react/Channel/context'
import ChannelUI from '@sendbird/uikit-react/Channel/components/ChannelUI'
import CustomTeacherPopupChat from './Sendbird/CustomTeacherPopupChat'

import sendBirdUseStore from '../store/Sendbird'

type props = {
  userId: string
}

const MessageList = () => {
  const context = useSendbirdStateContext()
  const sdk = sendbirdSelectors.getSdk(context)

  const appId = process.env.NEXT_PUBLIC_SENDBIRD_APP_ID

  var sb = new SendBird({ appId: appId })

  // 새로운 메시지가 추가될 때마다 저장하는 메시지 state
  const messageLength = sendBirdUseStore((state: any) => state.messageLength)

  useEffect(() => {
    const intvl = window.setInterval(() => {
      if (window.scrollY + window.innerHeight === document.body.scrollHeight) {
        window.clearInterval(intvl)
      } else {
        window.scrollTo(0, document.body.scrollHeight)
      }
    }, 1000)

    // if (messageLength !== 0) {
    //   window.setTimeout(() => {
    //     window.scrollTo(0, document.body.scrollHeight)
    //   }, 100)
    // }

    if (sb.addChannelHandler) {
      const groupChannelHandler: GroupChannelHandler = new GroupChannelHandler({
        onMessageReceived: (channel: BaseChannel, message: BaseMessage) => {
          window.setTimeout(() => {
            window.scrollTo(0, document.body.scrollHeight)
          }, 100)
        },
      })

      sb.addChannelHandler('GROUP_CHANNEL_HANDLER', groupChannelHandler)
    }

    return () => {
      window.clearInterval(intvl)

      if (sb.addChannelHandler) {
        sb.removeChannelHandler('GROUP_CHANNEL_HANDLER')
      }
    }

    // if (sdk?.openChannel?.addOpenChannelHandler) {
    //   const openChannelHandler = new OpenChannelHandler({
    //     onMessageReceived: (channel: BaseChannel, message: BaseMessage) => {
    //       window.setTimeout(() => {
    //         window.scrollTo(0, document.body.scrollHeight)
    //       }, 100)
    //     },
    //   })

    //   sdk.openChannel.addOpenChannelHandler(
    //     'OPEN_CHANNEL_HANDLER',
    //     openChannelHandler
    //   )
    // }

    // return () => {
    //   window.clearInterval(intvl)

    //   if (sdk?.openChannel?.addOpenChannelHandler) {
    //     sdk.openChannel.removeChannelHandler('OPEN_CHANNEL_HANDLER')
    //   }
    // }
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

  const appId = process.env.NEXT_PUBLIC_SENDBIRD_APP_ID
  const currentChannelUrl = process.env.NEXT_PUBLIC_SENDBIRD_TEST_CHANNEL_ID

  return (
    <div className='chat-monitor'>
      <SendbirdProvider
        appId={appId}
        userId={props.userId}
        stringSet={stringSet}
        dateLocale={kr}
      >
        <ChannelProvider channelUrl={currentChannelUrl}>
          <MessageList></MessageList>
        </ChannelProvider>
      </SendbirdProvider>
    </div>
  )
}

export default ChatMonitor
