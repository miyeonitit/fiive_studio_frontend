import React, { useState } from 'react'
import axios from 'axios'

import { useChannelContext } from '@sendbird/uikit-react/Channel/context'

import MessageTooltip from '../components/MessageTooltip'

type props = {
  emoji: any
  userId: string
  reactedEmojis: Array<any>
  emojiContainer: any
  messageInfomation: any
}

const EmojiIcon = (props: props) => {
  const { currentGroupChannel } = useChannelContext()

  // 이모티콘 누른 user list 노출 boolean state
  const [isReactedUser, setIsReactedUser] = useState(false)

  const [userListTooltipTop, setUseListTooltipTop] = useState(0)
  const [userListTooltipRight, setUseListTooltipRight] = useState(0)

  const ApiStudio = process.env.NEXT_PUBLIC_API_BASE_URL
  const apiToken = process.env.NEXT_PUBLIC_SENDBIRD_API_TOKEN
  const channel_url = process.env.NEXT_PUBLIC_SENDBIRD_TEST_CHANNEL_ID
  const message_id = props.messageInfomation.messageId

  const findEmojiImageUrl = (emojiIcon: any) => {
    const reaction = props.emojiContainer.find(
      (emoji: any) => emoji.key === emojiIcon.key
    )

    return reaction ? reaction.url : <></>
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
          {props.emoji.userIds.map((user: string, idx: number) =>
            props.emoji.userIds[props.emoji.userIds.length - 1] === user ? (
              <span key={idx}>{user}</span>
            ) : (
              <span key={idx}>{user}, </span>
            )
          )}
        </div>
      )}

      <div
        className={`reactions_item ${
          props.emoji.userIds.includes(props.userId) && 'active'
        }`}
        onClick={() => addUserReaction(props.emoji.key)}
        // onMouseOver={(e) => handleTop(e)}
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
