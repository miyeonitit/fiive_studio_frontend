import React from 'react'
import Image from 'next/image'
import format from 'date-fns/format'
import { eo } from 'date-fns/locale'

import { useChannelContext } from '@sendbird/uikit-react/Channel/context'
import useSendbirdStateContext from '@sendbird/uikit-react/useSendbirdStateContext'
import { sendBirdSelectors } from '@sendbird/uikit-react/sendbirdSelectors'

import ChatDateSeparator from '@sendbird/uikit-react/ui/DateSeparator'

import UnreadCount from '@sendbird/uikit-react/Channel/components/UnreadCount'
import TypingIndicator from '@sendbird/uikit-react/Channel/components/TypingIndicator'

import defaultProfileImage from '../../public/pages/fiive/Ellipse 8stateBadge.svg'

const ChatRoom = ({ message, chainTop, chainBottom }) => {
  const { currentGroupChannel, scrollToMessage } = useChannelContext()
  const globalStore = useSendbirdStateContext()

  const messageInfomation = message.message
  const sender = messageInfomation.sender

  console.log(sender, 'sender')

  // const deleteFileMessage = sendBirdSelectors.getDeleteMessage(globalStore)

  const formatMessageTime = (date: number) => {
    const dateTime = new Date(date)

    const hours = Number(`0${dateTime.getHours()}`.slice(-2))
    const minutes = Number(`0${dateTime.getMinutes()}`.slice(-2))

    if (hours < 12) {
      return `오전 ${hours}:${minutes}`
    } else {
      return `오후 ${hours - 12}:${minutes}`
    }
  }

  return (
    <div className='ChatRoom'>
      {messageInfomation.type === 'image/png' ? (
        <div className='Message_file'>
          <button
            className='custom-file-message__delete-button'
            onClick={() => deleteFileMessage(currentGroupChannel, message)}
          />
          <img src={messageInfomation.plainUrl} alt='custom-file-message' />
        </div>
      ) : (
        <div className='Message_text'>
          <div className='user_infomation_box'>
            <div className='user_profile_image_box'>
              <Image
                src={
                  sender.plainProfileUrl
                    ? sender.plainProfileUrl
                    : defaultProfileImage
                }
                width={24}
                height={24}
                className='defaultProfileImage'
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
          <div className='text_message_box'>{messageInfomation.message}</div>
        </div>
      )}
    </div>
  )
}

export default ChatRoom
