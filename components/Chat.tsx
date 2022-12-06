import React, { useState, useLayoutEffect } from 'react'
import { GetStaticProps } from 'next'

import { config } from '../utils/HeaderConfig'

import SendbirdProvider from '@sendbird/uikit-react/SendbirdProvider'
import { ChannelProvider } from '@sendbird/uikit-react/Channel/context'
import ChannelUI from '@sendbird/uikit-react/Channel/components/ChannelUI'

import CustomChatRoom from './Sendbird/CustomChatRoom'
import CustomMessageInput from './Sendbird/CustomMessageInput'
import CustomDateSeparator from './Sendbird/CustomDateSeparator'

type props = {
  userId: string
}

const Chat = (props: props) => {
  const { userId } = props

  const [emojiContainer, setEmojiContaioner] = useState([])

  const appId = process.env.NEXT_PUBLIC_SENDBIRD_APP_ID
  const currentChannelUrl = process.env.NEXT_PUBLIC_SENDBIRD_TEST_CHANNEL_ID
  const apiToken = process.env.NEXT_PUBLIC_SENDBIRD_API_TOKEN

  useLayoutEffect(() => {
    fetch(`https://api-${appId}.sendbird.com/v3/emojis`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json; charset=utf8',
        Accept: 'application/json',
        'Api-Token': apiToken,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('성공:', data)
        setEmojiContaioner(data.emojis)
      })
      .catch((error) => {
        console.error('실패:', error)
      })
  }, [])

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
            renderChannelHeader={() => <></>}
            renderMessage={(message: {}) => (
              <CustomChatRoom
                message={message}
                appId={appId}
                userId={userId}
                emojiContainer={emojiContainer}
              />
            )}
            renderMessageInput={() => <CustomMessageInput />}
            renderCustomSeparator={() => <CustomDateSeparator />}
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
