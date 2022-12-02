import React, { useState } from 'react'
import { GetStaticProps } from 'next'

import SendbirdProvider from '@sendbird/uikit-react/SendbirdProvider'
import { ChannelProvider } from '@sendbird/uikit-react/Channel/context'
import ChannelUI from '@sendbird/uikit-react/Channel/components/ChannelUI'

import ChatRoom from './Sendbird/ChatRoom'

type props = {
  userId: string
}

const Chat = (props: props) => {
  const { userId } = props

  const appId = process.env.NEXT_PUBLIC_SENDBIRD_APP_ID
  const currentChannelUrl = process.env.NEXT_PUBLIC_SENDBIRD_TEST_CHANNEL_ID

  return (
    <>
      <SendbirdProvider appId={appId} userId={userId}>
        <ChannelProvider
          channelUrl={currentChannelUrl}
          isReactionEnabled={true}
        >
          <ChannelUI
            hasSeparator={true}
            isReactionEnabled={true}
            renderHeader={() => <></>}
            renderMessage={(message) => <ChatRoom message={message} />}
            // renderMessageInput={(props) => <Tester props={props} />}
            // renderTypingIndicator={(props) => <Tester props={props} />}
          />
        </ChannelProvider>
      </SendbirdProvider>
    </>
  )
}

export const getStaticprops: GetStaticProps = async () => {
  return {
    props: {
      SENDBIRD_APP_ID: process.env.NEXT_PUBLIC_SENDBIRD_APP_ID,
      SENDBIRD_CHANNEL_ID: process.env.NEXT_PUBLIC_SENDBIRD_TEST_CHANNEL_ID,
    },
  }
}

export default Chat
