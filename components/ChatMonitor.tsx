import { useEffect, useState, useLayoutEffect } from 'react'

import SendbirdProvider from '@sendbird/uikit-react/SendbirdProvider'
import { OpenChannelProvider } from '@sendbird/uikit-react/OpenChannel/context'
import OpenChannelMessageList from '@sendbird/uikit-react/OpenChannel/components/OpenChannelMessageList'
import sendbirdSelectors from '@sendbird/uikit-react/sendbirdSelectors'
import useSendbirdStateContext from '@sendbird/uikit-react/useSendbirdStateContext'
import { OpenChannelHandler } from '@sendbird/chat/openChannel'
import { BaseChannel } from '@sendbird/chat'
import { BaseMessage } from '@sendbird/chat/message'

import useStore from '../store/Sendbird'

import { ChannelProvider } from '@sendbird/uikit-react/Channel/context'
import ChannelUI from '@sendbird/uikit-react/Channel/components/ChannelUI'
import GroupMessageList from '@sendbird/uikit-react/Channel/components/MessageList'
import CustomChatRoom from './Sendbird/CustomChatRoom'

type props = {
  userId: string
}

const MessageList = () => {
  const context = useSendbirdStateContext()
  const sdk = sendbirdSelectors.getSdk(context)

  useLayoutEffect(() => {
    const intvl = window.setInterval(() => {
      if (window.scrollY + window.innerHeight === document.body.scrollHeight) {
        window.clearInterval(intvl)
      } else {
        window.scrollTo(0, document.body.scrollHeight)
      }
    }, 1000)

    if (sdk?.openChannel?.addOpenChannelHandler) {
      const openChannelHandler = new OpenChannelHandler({
        onMessageReceived: (channel: BaseChannel, message: BaseMessage) => {
          // console.log(channel, message);
          window.setTimeout(() => {
            window.scrollTo(0, document.body.scrollHeight)
          }, 100)
        },
      })

      sdk.openChannel.addOpenChannelHandler(
        'OPEN_CHANNEL_HANDLER',
        openChannelHandler
      )
    }

    return () => {
      window.clearInterval(intvl)

      if (sdk?.openChannel?.addOpenChannelHandler) {
        sdk.openChannel.removeChannelHandler('OPEN_CHANNEL_HANDLER')
      }
    }
  })

  return (
    <>
      <OpenChannelMessageList></OpenChannelMessageList>
    </>
  )
}

const ChatMonitor = (props: props) => {
  // emojiContainer를 전역적으로 관리하기 위한 state
  const contextEmojiContainer = useStore((state: any) => state.emojiContainer)

  console.log(contextEmojiContainer, 'contextEmojiContainer')

  const appId = process.env.NEXT_PUBLIC_SENDBIRD_APP_ID
  const currentChannelUrl = process.env.NEXT_PUBLIC_SENDBIRD_TEST_CHANNEL_ID

  return (
    <div className='chat-monitor'>
      <SendbirdProvider appId={appId} userId={props.userId}>
        <ChannelProvider channelUrl={currentChannelUrl}>
          <ChannelUI
            renderChannelHeader={() => <></>}
            renderMessage={(message: {}) => (
              <CustomChatRoom
                message={message}
                userId={props.userId}
                emojiContainer={contextEmojiContainer}
              />
            )}
            renderMessageInput={() => <></>}
            renderCustomSeparator={() => <></>}
          >
            {/* <GroupMessageList /> */}
          </ChannelUI>
        </ChannelProvider>
      </SendbirdProvider>
    </div>
  )
}

export default ChatMonitor
