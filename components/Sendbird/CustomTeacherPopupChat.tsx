import React, { useEffect } from 'react'

import { useChannelContext } from '@sendbird/uikit-react/Channel/context'

import sendBirdUseStore from '../../store/Sendbird'

type props = {
  message: any
  userId: string
}

const CustomTeacherPopupChat = (props: props) => {
  const { allMessages } = useChannelContext()

  // 새로운 메시지가 추가될 때마다 저장하는 메시지 state
  const changeMessageLength = sendBirdUseStore(
    (state: any) => state.changeMessageLength
  )

  const messageInfomation = props.message.message
  const sender = messageInfomation.sender

  useEffect(() => {
    // 새 메시지를 받았음을 알기 위해, allMessagesLength가 증가할 때마다 메시지 수를 전역적으로 저장
    changeMessageLength(allMessages.length)
  }, [props.message])

  return (
    <div className='CustomTeacherPopupChat'>
      <div className='popup_chat_wrapper'>
        <div className='message_box'>
          <div
            className={`user_name_box ${
              sender.role === 'operator' ? 'teacher' : 'learner'
            }`}
          >
            {sender.userId} :{' '}
            <span className='user_text_box'>{messageInfomation.message}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CustomTeacherPopupChat
