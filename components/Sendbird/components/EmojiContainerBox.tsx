import React, { useState, Dispatch, SetStateAction, Ref } from 'react'
import axios from 'axios'

type props = {
  userId: string
  topHeight: string
  rightWidth: string
  emojiContainer: any
  setIsReactionBox: Dispatch<SetStateAction<boolean>>
  messageInfomation: any
  refName: string
  reactionTopRef?: React.RefObject<HTMLDivElement>
  reactionBottomRef?: React.RefObject<HTMLDivElement>
  reactedEmojis: Array<any>
}

const EmojiContainerBox = (props: props) => {
  const ApiStudio = process.env.NEXT_PUBLIC_API_BASE_URL
  const apiToken = process.env.NEXT_PUBLIC_SENDBIRD_API_TOKEN
  const channel_url = process.env.NEXT_PUBLIC_SENDBIRD_TEST_CHANNEL_ID
  const message_id = props.messageInfomation.messageId

  const boxStyle = {
    top: `${props.topHeight}px`,
    right: `${props.rightWidth}px`,
  }

  const addUserReaction = (emojiKey: string) => {
    // 해당 메시지에 유저가 선택한 리액션 이모지가 이미 있을 경우, 이모지 제거
    const findAlreadyReactedEmoji = props.reactedEmojis.find(
      (emoji: any) => emoji.key === emojiKey
    )

    // 해당 메시지에 유저가 선택한 리액션 이모지가 이미 있을 경우
    if (
      findAlreadyReactedEmoji &&
      findAlreadyReactedEmoji.userIds.includes(props.userId)
    ) {
      removeUserReaction(findAlreadyReactedEmoji.key)
      return
    }
    // 해당 메시지에 유저가 선택한 리액션 이모지가 없을 경우
    else {
      const body = {
        user_id: props.userId,
        reaction: emojiKey,
      }

      axios
        .post(
          `${ApiStudio}/sendbird/group_channels/${channel_url}/messages/${message_id}/reactions`,
          body
        )
        .then((data) => {})
        .catch((error) => {
          console.error('실패:', error)
        })
    }
  }

  const removeUserReaction = (emojiKey: string) => {
    axios
      .delete(
        `${ApiStudio}/sendbird/group_channels/${channel_url}/messages/${message_id}/reactions?user_id=${props.userId}&reaction=${emojiKey}`
      )
      .then((data) => {})
      .catch((error) => {
        console.error('실패:', error)
      })
  }

  return (
    <div
      className='EmojiContainerBox'
      ref={
        props.refName === 'top' ? props.reactionTopRef : props.reactionBottomRef
      }
    >
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
