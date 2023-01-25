import React, { useState, Dispatch, SetStateAction, Ref } from 'react'

import AxiosRequest from '../../../utils/AxiosRequest'
import fiiveStudioUseStore from '../../../store/FiiveStudio'

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
  channelUrl: string
}

const EmojiContainerBox = (props: props) => {
  // user auth token for API
  const authToken = fiiveStudioUseStore((state: any) => state.authToken)

  const message_id = props?.messageInfomation.messageId

  const boxStyle = {
    top: `${props?.topHeight}px`,
    right: `${props?.rightWidth}px`,
  }

  const addUserReaction = async (emojiKey: string) => {
    // 해당 메시지에 유저가 선택한 리액션 이모지가 이미 있을 경우, 이모지 제거
    const findAlreadyReactedEmoji = props?.reactedEmojis.find(
      (emoji: any) => emoji.key === emojiKey
    )

    // 해당 메시지에 유저가 선택한 리액션 이모지가 이미 있을 경우
    if (
      findAlreadyReactedEmoji &&
      findAlreadyReactedEmoji.userIds.includes(props?.userId)
    ) {
      removeUserReaction(findAlreadyReactedEmoji.key)
      return
    }
    // 해당 메시지에 유저가 선택한 리액션 이모지가 없을 경우
    else {
      const requestUrl = `/sendbird/group_channels/${props.channelUrl}/messages/${message_id}/reactions`

      const body = {
        user_id: props?.userId,
        reaction: emojiKey,
      }

      const responseData = await AxiosRequest({
        url: requestUrl,
        method: 'POST',
        body: body,
        token: authToken,
      })
    }
  }

  const removeUserReaction = async (emojiKey: string) => {
    const requestUrl = `/sendbird/group_channels/${props.channelUrl}/messages/${message_id}/reactions?user_id=${props?.userId}&reaction=${emojiKey}`

    const responseData = await AxiosRequest({
      url: requestUrl,
      method: 'DELETE',
      body: '',
      token: authToken,
    })
  }

  return (
    <div
      className='EmojiContainerBox'
      ref={
        props?.refName === 'top'
          ? props?.reactionTopRef
          : props?.reactionBottomRef
      }
    >
      <div className='emojis_container_wrapper' style={boxStyle}>
        <div className='emoji_outer_box'>
          {props?.emojiContainer.map((emoji: any) => (
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
