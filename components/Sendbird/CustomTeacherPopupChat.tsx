import React, { useState } from 'react'

const CustomTeacherPopupChat = ({ message, userId }) => {
  const messageInfomation = message.message
  const sender = messageInfomation.sender

  return (
    <div className='CustomTeacherPopupChat'>
      <div className='popup_chat_wrapper'>
        <div className='message_box'>
          <div
            className={`user_name_box ${
              sender.role === 'operator' ? 'teacher' : 'learner'
            }`}
          >
            {sender.userId}
          </div>
          <div className='user_text_box'>{messageInfomation.message}</div>
        </div>
      </div>
    </div>
  )
}

export default CustomTeacherPopupChat
