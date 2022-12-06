import React, { useState, useEffect } from 'react'
import Image from 'next/image'

import { useChannelContext } from '@sendbird/uikit-react/Channel/context'
import useSendbirdStateContext from '@sendbird/uikit-react/useSendbirdStateContext'
import sendbirdSelectors from '@sendbird/uikit-react/sendbirdSelectors'

import ChatDateSeparator from '@sendbird/uikit-react/ui/DateSeparator'
import ImageRenderer from '@sendbird/uikit-react/ui/ImageRenderer'

import { config } from '../../utils/HeaderConfig'
import useStore from '../../store/Sendbird'
import MessageTooltip from './components/MessageTooltip'

import defaultProfileImage from '../../public/pages/fiive/Ellipse 8stateBadge.svg'
import reactionTopButton from '../../public/pages/fiive/add_reaction_emoji.svg'
import reactionBottomButton from '../../public/pages/fiive/add_reaction_emoji_bottom.svg'
import moreButton from '../../public/pages/fiive/more_button.svg'
import retryButton from '../../public/pages/fiive/retry_button.svg'
import clearButton from '../../public/pages/fiive/clear_button.svg'
import warningIcon from '../../public/pages/fiive/warning_icon.svg'

const CustomChatRoom = ({ message, appId, userId, emojiContainer }) => {
  // 채팅방의 각 message 의 정보를 담는 object state
  const [messageInfomation, setMessageInfomation] = useState(message.message)

  const addMessageInfomation = useStore(
    (state: any) => state.addMessageInfomation
  )

  // 더보기 메뉴 노출 boolean state
  const [isHoverMoreMenu, setIsHoverMoreMenu] = useState(false)

  // 이모티콘 툴팁 노출 boolean state
  const [isReactionTopTooltip, setIsReactionTopTooltip] = useState(false)
  const [isReactionBottomTooltip, setIsReactionBottomTooltip] = useState(false)

  // 메시지 삭제 툴팁 노출 boolean state
  const [isMessageDeleteTooltip, setIsMessageDeleteTooltip] = useState(false)

  const { currentGroupChannel, scrollToMessage } = useChannelContext()
  const globalStore = useSendbirdStateContext()

  const sender = messageInfomation.sender
  const reactedEmojis = messageInfomation.reactions

  const formatMessageTime = (date: number) => {
    const dateTime = new Date(date)

    const hours = Number(`0${dateTime.getHours()}`.slice(-2))
    const minutes = `0${dateTime.getMinutes()}`.slice(-2)

    if (hours < 12) {
      return `오전 ${hours < 10 ? '0' + hours.toString() : hours}:${minutes}`
    } else {
      return `오후 ${
        hours - 12 < 10 ? '0' + (hours - 12).toString() : hours
      }:${minutes}`
    }
  }

  const compareMessageDate = (date: number) => {
    const dateTime = new Date(date)

    const day = `0${dateTime.getDate()}`.slice(-2)

    return day
  }

  const clickEmojiReaction = (react: {}, stringKey: string) => {
    let reactionEvent = ''
    const emojiKey: string = stringKey

    // Remove or Add an emoji to a message as userId
    if (react?.userIds.includes(userId)) {
      reactionEvent = currentGroupChannel.deleteReaction(
        messageInfomation,
        emojiKey
      )
    } else {
      reactionEvent = currentGroupChannel.addReaction(
        messageInfomation,
        emojiKey
      )
    }

    messageInfomation.applyReactionEvent(reactionEvent)
  }

  const findEmojiImageUrl = (react) => {
    const reaction = emojiContainer.find((emoji) => emoji.key === react.key)

    return reaction.url
  }

  const testAddEmoji = () => {
    const apiToken = process.env.NEXT_PUBLIC_SENDBIRD_API_TOKEN

    // fetch(`https://api-${appId}.sendbird.com/v3/emoji_categories`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json; charset=utf8',
    //     Accept: 'application/json',
    //     'Api-Token': apiToken,
    //   },
    //   body: JSON.stringify({
    //     emoji_categories: [
    //       {
    //         name: 'tester',
    //         url: 'https://emojikeyboard.io/img/emoji-keyboard-logo.gif?t=1670087172013',
    //       },
    //     ],
    //   }),
    // })
    //   .then((response) => response.json())
    //   .then((data) => {
    //     console.log('성공:', data)
    //   })
    //   .catch((error) => {
    //     console.error('실패:', error)
    //   })

    fetch(`https://api-${appId}.sendbird.com/v3/emojis`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf8',
        Accept: 'application/json',
        'Api-Token': apiToken,
      },
      body: JSON.stringify({
        emoji_category_id: 48,
        emojis: [
          {
            key: 'cat_love',
            url: 'https://emojikeyboard.io/img/img-apple-64/1f63b.png',
          },
        ],
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('성공:', data)
      })
      .catch((error) => {
        console.error('실패:', error)
      })
  }

  const addUserReaction = () => {
    const channel_type = 'group_channels'
    const channel_url = messageInfomation.channelUrl
    const message_id = messageInfomation.messageId
    const apiToken = process.env.NEXT_PUBLIC_SENDBIRD_API_TOKEN

    fetch(
      `https://api-${appId}.sendbird.com/v3/${channel_type}/${channel_url}/messages/${message_id}/reactions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf8',
          Accept: 'application/json',
          'Api-Token': apiToken,
        },
        body: JSON.stringify({
          user_id: userId,
          reaction: 'cat_love',
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

  const deleteMessage = () => {
    const deleteMessge = sendbirdSelectors.getDeleteMessage(globalStore)

    deleteMessge(currentGroupChannel, messageInfomation)
      .then((message) => {})
      .catch((error) => {
        console.log(error, 'error')
        alert('다시 시도해 주세요.')
      })
  }

  const resendMessage = () => {
    const resendUserMessage =
      sendbirdSelectors.getResendUserMessage(globalStore)

    resendUserMessage(currentGroupChannel, messageInfomation)
      .then((message) => {})
      .catch((error) => {
        console.log(error, 'error')
        alert('다시 시도해 주세요.')
      })
  }

  useEffect(() => {
    setMessageInfomation(message.message)
    addMessageInfomation(message.message)
  }, [message.message])

  // console.log(message, 'message')
  // console.log(currentGroupChannel, 'currentGroupChannel')

  return (
    <div
      className='CustomChatRoom'
      onMouseOver={() => setIsHoverMoreMenu(true)}
      onMouseOut={() => setIsHoverMoreMenu(false)}
    >
      {messageInfomation.type === 'image/png' ? (
        <div className='Message_file'>
          <button
            className='custom-file-message__delete-button'
            // onClick={() => deleteFileMessage(currentGroupChannel, message)}
          />
          <ImageRenderer
            className='sendbird-quote-message__replied-message__thumbnail-message__image'
            url={messageInfomation.plainUrl}
            width='144px'
            height='108px'
            alt='sendbird-quote-message__replied-message__thumbnail-message__image'
          />
          {/* <img src={messageInfomation.plainUrl} alt='custom-file-message' /> */}
        </div>
      ) : (
        <>
          {isReactionTopTooltip && (
            <MessageTooltip
              topHeight='-60'
              rightWidth='18'
              tooltipText={
                messageInfomation.sendingStatus === 'succeeded'
                  ? '반응 추가하기'
                  : '다시 보내기'
              }
            />
          )}

          {isMessageDeleteTooltip && (
            <MessageTooltip topHeight='-60' rightWidth='5' tooltipText='삭제' />
          )}

          {isHoverMoreMenu &&
            (messageInfomation.sendingStatus === 'succeeded' ? (
              <div className='Message_more_menu_box'>
                <div
                  className='reaction_emoji_button'
                  onClick={() => testAddEmoji()}
                  onMouseOver={() => setIsReactionTopTooltip(true)}
                  onMouseOut={() => setIsReactionTopTooltip(false)}
                >
                  <Image
                    src={reactionTopButton}
                    width={16}
                    height={16}
                    alt='reactionButton'
                  />
                </div>
                <div className='more_button'>
                  <Image
                    src={moreButton}
                    width={16}
                    height={16}
                    alt='moreButton'
                  />
                </div>
              </div>
            ) : (
              <div className='Message_more_menu_box'>
                <div
                  className='reaction_emoji_button'
                  onMouseOver={() => setIsReactionTopTooltip(true)}
                  onMouseOut={() => setIsReactionTopTooltip(false)}
                >
                  <Image
                    src={retryButton}
                    onClick={() => resendMessage()}
                    width={16}
                    height={16}
                    alt='retryButton'
                  />
                </div>
                <div
                  className='more_button'
                  onMouseOver={() => setIsMessageDeleteTooltip(true)}
                  onMouseOut={() => setIsMessageDeleteTooltip(false)}
                >
                  <Image
                    src={clearButton}
                    onClick={() => deleteMessage()}
                    width={16}
                    height={16}
                    alt='clearButton'
                  />
                </div>
              </div>
            ))}

          <div className='Message_text'>
            <div className='user_infomation_box'>
              <div className='user_profile_image_box'>
                <Image
                  className='defaultProfileImage'
                  src={
                    sender.plainProfileUrl
                      ? sender.plainProfileUrl
                      : defaultProfileImage
                  }
                  width={24}
                  height={24}
                  alt='defaultProfileImage'
                />
              </div>
              <div
                className={`user_nickname_box ${
                  sender.role === 'operator' && 'teacher'
                }`}
              >
                {sender.userId}
              </div>
              <div className='massage_date_time'>
                {formatMessageTime(messageInfomation.createdAt)}
              </div>
            </div>
            <div
              className={`text_message_box ${
                messageInfomation.sendingStatus !== 'succeeded' && 'fail'
              }`}
            >
              {messageInfomation.message}
            </div>

            {messageInfomation.sendingStatus === 'failed' && (
              <div className='message_sending_status'>
                <Image
                  src={warningIcon}
                  width={12}
                  height={12}
                  alt='warningIcon'
                />
                <span className='warning_text'>메시지를 보내지 못했어요.</span>
              </div>
            )}

            {reactedEmojis.length > 0 && (
              <div className='reaction_emoji_box'>
                {reactedEmojis.map((react, idx) => {
                  return (
                    <div className='reactions_item' key={idx + react.key}>
                      <img
                        className='emoji_reaction'
                        src={findEmojiImageUrl(react)}
                        onClick={() => clickEmojiReaction(react, react.key)}
                        alt='emojiReaction'
                      />
                      <span className='reactions_item_inner'>
                        {react.userIds.length}
                      </span>
                    </div>
                  )
                })}

                <div
                  className='reactions_item add_emoji'
                  onClick={() => addUserReaction()}
                  onMouseOver={() => setIsReactionBottomTooltip(true)}
                  onMouseOut={() => setIsReactionBottomTooltip(false)}
                >
                  {isReactionBottomTooltip && (
                    <MessageTooltip
                      topHeight='-52'
                      rightWidth='-26'
                      width='90'
                      tooltipText='반응 추가하기'
                    />
                  )}

                  <Image
                    src={reactionBottomButton}
                    width={18}
                    height={18}
                    alt='reactionBottomButton'
                  />
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default CustomChatRoom
