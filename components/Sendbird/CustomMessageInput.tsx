import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import axios from 'axios'
import { ToastContainer, toast, cssTransition } from 'react-toastify'

import 'animate.css'
import '../../node_modules/react-toastify/dist/ReactToastify.css'

import sendbirdSelectors from '@sendbird/uikit-react/sendbirdSelectors'
import useSendbirdStateContext from '@sendbird/uikit-react/useSendbirdStateContext'
import { useChannelContext } from '@sendbird/uikit-react/Channel/context'
import TypingIndicator from '@sendbird/uikit-react/Channel/components/TypingIndicator'

import {
  UserMessageCreateParams,
  UserMessageUpdateParams,
  FileMessageCreateParams,
} from '@sendbird/chat/message'

const CustomMessageInput = ({ userId, userRole }) => {
  const { currentGroupChannel } = useChannelContext()
  const globalStore = useSendbirdStateContext()

  const [messageText, setMessageText] = useState('')

  const [isUserTyping, setIsUserTyping] = useState(false)
  const [typingUsersName, setTypingUsersName] = useState([])

  const ApiStudio = process.env.NEXT_PUBLIC_API_BASE_URL
  const apiToken = process.env.NEXT_PUBLIC_SENDBIRD_API_TOKEN
  const currentChannelUrl = process.env.NEXT_PUBLIC_SENDBIRD_TEST_CHANNEL_ID

  const messageInputWrapperRef = useRef<HTMLDivElement>(null)
  const messageInputRef = useRef<HTMLTextAreaElement>(null)

  const params: UserMessageCreateParams = {
    message: messageText,
    customType: messageText,
    data: messageText,
  }

  const fadeUp = cssTransition({
    enter: 'animate__animated animate__customFadeInUp',
    exit: 'animate__animated animate__fadeOut',
  })

  const controlDisabledInputPlaceholder = () => {
    if (currentGroupChannel.myMutedState === 'muted') {
      return '10분 간 메시지를 보낼 수 없어요.'
    }

    if (currentGroupChannel.isFrozen && userRole === 'learner') {
      return '선생님만 메시지를 보낼 수 있어요'
    }

    return '메시지 보내기'
  }

  const controlPressEnter = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSendMessage()
    }
  }

  const controlInputHeightsize = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    const textArea = messageInputRef.current

    if (textArea) {
      textArea.style.height = 'auto'
      textArea.style.height = textArea.scrollHeight + 'px'
    }
  }

  const handleSendMessage = () => {
    const messageInput = messageInputRef.current

    /* 본인이 뮤트를 당했다면 send를 할 수 없는 로직 */
    if (currentGroupChannel.myMutedState === 'muted') {
      // input 초기화
      if (messageInput) {
        messageInputRef.current.value = ''
        setMessageText('')
      }

      toast.error(
        <div className='toast_error_box'>
          <Image
            src='/Sendbird/toast_warning_icon.svg'
            width={16}
            height={16}
            alt='toastWarningIcon'
          />
          <span className='toast_error_text'>
            커뮤니티 가이드 위반으로 채팅을 일시정지 했어요.
          </span>
        </div>,
        { transition: fadeUp }
      )

      return
    }

    if (messageText === '' || messageText.length === 0) {
      return
    } else {
      const sendUserMessage = sendbirdSelectors.getSendUserMessage(globalStore)

      sendUserMessage(currentGroupChannel, params)
        .onPending((message) => {})
        .onFailed((error, message) => {
          console.log(error, message, 'error')
          toast.error(
            <div className='toast_error_box'>
              <Image
                src='/Sendbird/toast_warning_icon.svg'
                width={16}
                height={16}
                alt='toastWarningIcon'
              />
              <span className='toast_error_text'>
                네트워크 문제로 메세지를 보내지 못했어요.
              </span>
            </div>,
            { transition: fadeUp }
          )
        })
        .onSucceeded((message) => {
          const textArea = messageInputRef.current

          if (textArea) {
            textArea.style.height = 28 + 'px'
          }

          messageInputRef.current.value = ''
          setMessageText('')
        })
    }
  }

  // Typing Indicator 도입시 주석 해제
  // useEffect(() => {
  //   const body = {
  //     user_ids: userId,
  //   }

  //   if (messageText.length > 0) {
  //     axios
  //       .post(
  //         `${ApiStudio}/sendbird/group_channels/${currentChannelUrl}/typing`,
  //         body
  //       )
  //       .then((data) => {
  //         const getTypingUsers = currentGroupChannel.getTypingUsers()
  //         const getTypingUsersName = getTypingUsers.map(
  //           (user: any) => user.userId
  //         )
  //         setTypingUsersName(getTypingUsersName)
  //       })
  //       .catch((error) => {
  //         console.error('실패:', error)
  //       })
  //   } else {
  //     axios
  //       .delete(
  //         `${ApiStudio}/sendbird/group_channels/${currentChannelUrl}/typing`,
  //         body
  //       )
  //       .then((data) => {
  //         setIsUserTyping(false)
  //         setTypingUsersName([])
  //       })
  //       .catch((error) => {
  //         console.error('실패:', error)
  //       })
  //   }
  // }, [messageText])

  return (
    <div className='CustomMessageInput'>
      {/* freezeing chat status bottom bar */}
      {currentGroupChannel.isFrozen && (
        <div className='chat_frozen_status_wrapper'>
          <Image
            src='/Sendbird/lock_white_icon.svg'
            width={18}
            height={18}
            alt='lockIcon'
          />
          <span className='chat_frozen_status'>잠시 채팅방을 얼렸어요</span>
        </div>
      )}
      {/* muted chat status bottom bar */}
      {currentGroupChannel.myMutedState === 'muted' && (
        <div className='chat_muted_status_wrapper'>
          <Image
            src='/Sendbird/toast_warning_icon.svg'
            width={16}
            height={16}
            alt='toastWarningIcon'
          />
          <span className='chat_muted_status'>
            커뮤니티 가이드 위반으로 채팅을 일시정지 했어요.
          </span>
        </div>
      )}
      {/* chat input div */}
      <div
        className={`message_input_box ${messageText !== '' && 'active'} ${
          ((currentGroupChannel.isFrozen && userRole === 'learner') ||
            currentGroupChannel.myMutedState === 'muted') &&
          'nonactive'
        }`}
        ref={messageInputWrapperRef}
      >
        <textarea
          className={`message_input ${
            ((currentGroupChannel.isFrozen && userRole === 'learner') ||
              currentGroupChannel.myMutedState === 'muted') &&
            'nonactive'
          }`}
          ref={messageInputRef}
          rows={1}
          onChange={(e) => {
            setMessageText(e.target.value)
          }}
          onKeyPress={(e) => controlPressEnter(e)}
          onKeyDown={(e) => controlInputHeightsize(e)}
          disabled={
            (currentGroupChannel.isFrozen && userRole === 'learner') ||
            currentGroupChannel.myMutedState === 'muted'
              ? true
              : false
          }
          autoFocus={false}
          type='text'
          placeholder={controlDisabledInputPlaceholder()}
        />
        <Image
          className='sendMessageIcon'
          src={
            messageText !== ''
              ? '/Sendbird/active_send_message_icon.svg'
              : '/Sendbird/non_active_send_message_icon.svg'
          }
          onClick={() => handleSendMessage()}
          width={24}
          height={24}
          alt='sendMessageIcon'
        />
      </div>

      {/* <TypingIndicator members={currentGroupChannel?.getTypingUsers()} /> */}

      {/* <div>{typingUsersName.length > 0 && typingUsersName + 'is typing'}</div> */}

      <ToastContainer
        position='bottom-right'
        autoClose={2000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='colored'
        transition={fadeUp}
      />
    </div>
  )
}

export default CustomMessageInput
