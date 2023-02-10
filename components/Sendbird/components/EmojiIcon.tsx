import React, { useState, useEffect } from 'react'

import { useChannelContext } from '@sendbird/uikit-react/Channel/context'

import AxiosRequest from '../../../utils/AxiosRequest'
import fiiveStudioUseStore from '../../../store/FiiveStudio'

import MessageTooltip from '../components/MessageTooltip'

type props = {
  emoji: any
  userId: string
  reactedEmojis: Array<any>
  emojiContainer: any
  messageInfomation: any
  channelUrl: string
}

const EmojiIcon = (props: props) => {
  const { currentGroupChannel } = useChannelContext()

  // user auth token for API
  const authToken = fiiveStudioUseStore((state: any) => state.authToken)

  // 이모티콘 누른 user list 노출 boolean state
  const [isReactedUser, setIsReactedUser] = useState(false)

  const [userListTooltipTop, setUseListTooltipTop] = useState(0)
  const [userListTooltipRight, setUseListTooltipRight] = useState(0)

  const message_id = props.messageInfomation.messageId

  const findEmojiImageUrl = (emojiIcon: any) => {
    const reaction = props?.emojiContainer.find(
      (emoji: any) => emoji.key === emojiIcon.key
    )

    return reaction ? reaction.url : <></>
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
      const requestUrl = `/sendbird/group_channels/${props?.channelUrl}/messages/${message_id}/reactions`

      const body = {
        user_id: props.userId,
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
    const requestUrl = `/sendbird/group_channels/${props?.channelUrl}/messages/${message_id}/reactions?user_id=${props.userId}&reaction=${emojiKey}`

    const responseData = await AxiosRequest({
      url: requestUrl,
      method: 'DELETE',
      body: '',
      token: authToken,
    })
  }

  const filterUserIdToNickname = (user_id: string) => {
    const findUserNickname = currentGroupChannel.members.find(
      (user: any) => user?.userId === user_id
    )

    return findUserNickname.nickname
  }

  const tooltipAsCursor = async (e, setter) => {
    if (e.target.parentNode.classList[1] === 'cursor') {
      await setter(true)
      // tooltip
      const element = e.target.parentNode.previousSibling
      // textarea
      const parent = e.target.parentNode.getBoundingClientRect()

      let height = e.target.parentNode.previousSibling.offsetHeight
      let parentWidth = e.target.parentNode.offsetWidth

      element.style.cssText = `top:${
        parseInt(parent.y) - (height + 8)
      }px; left:${parseInt(parent.x)}px; width: ${parentWidth}px;`
    }
  }

  const handleTop = (e) => {
    if (e.target.parentNode.classList[0] === 'EmojiIcon') {
      let test = e.target.parentNode.getBoundingClientRect()

      setUseListTooltipTop(parseInt(test.width))
      setUseListTooltipRight(parseInt(test.height))

      setIsReactedUser(true)
    }
  }

  return (
    <div className='EmojiIcon'>
      {isReactedUser && (
        <div className='reacted_user_list_tooltip'>
          {props.emoji.userIds.map((user_id: string, idx: number) =>
            props.emoji.userIds[props.emoji.userIds.length - 1] === user_id ? (
              <span key={idx}>{filterUserIdToNickname(user_id)}</span>
            ) : (
              <span key={idx}>{filterUserIdToNickname(user_id)}, </span>
            )
          )}
        </div>
      )}

      <div
        className={`reactions_item ${
          props.emoji.userIds.includes(props.userId) && 'active'
        }`}
        onClick={() => addUserReaction(props.emoji.key)}
        onMouseOver={() => setIsReactedUser(true)}
        onMouseOut={() => setIsReactedUser(false)}
      >
        <img
          className='emoji_reaction'
          src={findEmojiImageUrl(props.emoji)}
          alt='emojiReaction'
        />
        <span className='reactions_item_inner'>
          {props.emoji.userIds.length}
        </span>
      </div>
    </div>
  )
}

export default EmojiIcon
