import React, { useState, useRef } from 'react'
import Image from 'next/image'

import Channel from '@sendbird/uikit-react/ChannelSettings/components/'
import sendbirdSelectors from '@sendbird/uikit-react/sendbirdSelectors'
import useSendbirdStateContext from '@sendbird/uikit-react/useSendbirdStateContext'
import { useChannelContext } from '@sendbird/uikit-react/Channel/context'

import {
  UserMessageCreateParams,
  UserMessageUpdateParams,
  FileMessageCreateParams,
} from '@sendbird/chat/message'

import activeSendIcon from '../../public/pages/fiive/active_send_message_icon.svg'
import nonActiveSendIcon from '../../public/pages/fiive/non_active_send_message_icon.svg'

const CustomMessageInput = () => {
  const [messageText, setMessageText] = useState('')

  const messageInputRef = useRef<any>(null)

  const { currentGroupChannel } = useChannelContext()
  const globalStore = useSendbirdStateContext()

  const params: UserMessageCreateParams = {
    message: messageText,
    customType: messageText,
    data: messageText,
  }

  const handleSendMessage = () => {
    const sendUserMessage = sendbirdSelectors.getSendUserMessage(globalStore)

    sendUserMessage(currentGroupChannel, params)
      .onPending((message) => {})
      .onFailed((error, message) => {
        console.log(error, message, 'error')
        alert('다시 시도해 주세요.')
      })
      .onSucceeded((message) => {
        messageInputRef.current.value = ''
        setMessageText('')
      })
  }

  return (
    <div className='CustomMessageInput'>
      <div className={`message_input_box ${messageText !== '' && 'active'}`}>
        <input
          className='message_input'
          ref={messageInputRef}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyDown={(e) => {
            if (e.code == 'Enter') {
              handleSendMessage()
              return
            }
          }}
          type='text'
          placeholder='댓글을 입력하세요'
        />
        <Image
          className='sendMessageIcon'
          src={messageText !== '' ? activeSendIcon : nonActiveSendIcon}
          onClick={() => handleSendMessage()}
          width={24}
          height={24}
          alt='sendMessageIcon'
        />
      </div>
    </div>
  )
}

export default CustomMessageInput
