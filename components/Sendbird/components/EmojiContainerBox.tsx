import React, { useState, Dispatch, SetStateAction } from 'react'

type props = {
  userId: string
  topHeight: string
  rightWidth: string
  emojiContainer: Array<any>
  setIsReactionBox: Dispatch<SetStateAction<boolean>>
  messageInfomation: any
}

const EmojiContainerBox = (props: props) => {
  const boxStyle = {
    top: `${props.topHeight}px`,
    right: `${props.rightWidth}px`,
  }

  const addUserReaction = (emojiKey: string) => {
    const appId = process.env.NEXT_PUBLIC_SENDBIRD_APP_ID
    const apiToken = process.env.NEXT_PUBLIC_SENDBIRD_API_TOKEN
    const channel_url = process.env.NEXT_PUBLIC_SENDBIRD_TEST_CHANNEL_ID
    const message_id = props.messageInfomation.messageId

    fetch(
      `https://api-${appId}.sendbird.com/v3/group_channels/${channel_url}/messages/${message_id}/reactions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf8',
          Accept: 'application/json',
          'Api-Token': apiToken,
        },
        body: JSON.stringify({
          user_id: props.userId,
          reaction: emojiKey,
        }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log('성공:', data)
      })
      .catch((error) => {
        console.error('실패:', error)
      })
  }

  return (
    <div className='EmojiContainerBox'>
      <div className='emojis_container_wrapper' style={boxStyle}>
        <div className='emoji_outer_box'>
          {props.emojiContainer.map((emoji: any) => (
            <div
              className='emoji_inner_box'
              key={emoji.key}
              onClick={() => addUserReaction(emoji.key)}
            >
              <img src={emoji.url} alt={emoji.key} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default EmojiContainerBox
