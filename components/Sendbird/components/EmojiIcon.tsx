import React, { useState } from 'react'

import { useChannelContext } from '@sendbird/uikit-react/Channel/context'

import MessageTooltip from '../components/MessageTooltip'

type props = {
  emoji: any
  userId: string
  emojiContainer: []
  messageInfomation: any
}

const EmojiIcon = (props: props) => {
  const { currentGroupChannel } = useChannelContext()

  // 이모티콘 누른 user list 노출 boolean state
  const [isReactedUser, setIsReactedUser] = useState(false)

  const [userListTooltipTop, setUseListTooltipTop] = useState(0)
  const [userListTooltipRight, setUseListTooltipRight] = useState(0)

  const findEmojiImageUrl = (emojiIcon: any) => {
    const reaction = props.emojiContainer.find(
      (emoji: any) => emoji.key === emojiIcon.key
    )

    return reaction ? reaction.url : <></>
  }

  const clickEmojiReaction = (react: {}, stringKey: string) => {
    let reactionEvent = ''
    const emojiKey: string = stringKey

    // Remove or Add an emoji to a message as userId
    if (react?.userIds.includes(props.userId)) {
      reactionEvent = currentGroupChannel.deleteReaction(
        props.messageInfomation,
        emojiKey
      )
    } else {
      reactionEvent = currentGroupChannel.addReaction(
        props.messageInfomation,
        emojiKey
      )
    }

    props.messageInfomation.applyReactionEvent(reactionEvent)
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

      console.log(test, 'test')
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
        // onMouseOver={(e) => handleTop(e)}
        onMouseOver={() => setIsReactedUser(true)}
        onMouseOut={() => setIsReactedUser(false)}
      >
        <img
          className='emoji_reaction'
          src={findEmojiImageUrl(props.emoji)}
          onClick={() => clickEmojiReaction(props.emoji, props.emoji.key)}
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
