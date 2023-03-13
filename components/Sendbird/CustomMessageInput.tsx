import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { ToastContainer, toast, cssTransition } from 'react-toastify'

import 'animate.css'
import '../../node_modules/react-toastify/dist/ReactToastify.css'

import sendbirdSelectors from '@sendbird/uikit-react/sendbirdSelectors'
import useSendbirdStateContext from '@sendbird/uikit-react/useSendbirdStateContext'
import { useChannelContext } from '@sendbird/uikit-react/Channel/context'

import { UserMessageCreateParams } from '@sendbird/chat/message'

type props = {
  userId: string
  userRole: string
}

const CustomMessageInput = (props: props) => {
  const { currentGroupChannel } = useChannelContext()
  const globalStore = useSendbirdStateContext()

  const [messageText, setMessageText] = useState('')

  const messageInputWrapperRef =
    React.useRef() as React.MutableRefObject<HTMLDivElement>
  const messageInputRef =
    React.useRef() as React.MutableRefObject<HTMLTextAreaElement>

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

    if (currentGroupChannel.isFrozen && props.userRole === 'learner') {
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
            src='/pages/Sendbird/toast_warning_icon.svg'
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
        .onPending((message: any) => {})
        .onFailed((error: any, message: any) => {
          toast.error(
            <div className='toast_error_box'>
              <Image
                src='/pages/Sendbird/toast_warning_icon.svg'
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
        .onSucceeded((message: any) => {
          const textArea = messageInputRef.current

          if (textArea) {
            textArea.style.height = 28 + 'px'
          }

          messageInputRef.current.value = ''
          setMessageText('')
        })
    }
  }

  // Sendbird chat이 Freeze 되었을 때 input 비활성화 스타일링 및 textarea value 제거
  useEffect(() => {
    if (currentGroupChannel.isFrozen) {
      messageInputRef.current.value = ''
    }
  }, [currentGroupChannel.isFrozen])

  return (
    <div className='CustomMessageInput'>
      {/* freezeing chat status bottom bar */}
      {currentGroupChannel.isFrozen && (
        <div className='chat_frozen_status_wrapper'>
          <Image
            src='/pages/Sendbird/lock_white_icon.svg'
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
            src='/pages/Sendbird/toast_warning_icon.svg'
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
          ((currentGroupChannel.isFrozen && props.userRole === 'learner') ||
            currentGroupChannel.myMutedState === 'muted') &&
          'nonactive'
        }`}
        ref={messageInputWrapperRef}
      >
        <textarea
          className={`message_input ${
            ((currentGroupChannel.isFrozen && props.userRole === 'learner') ||
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
            (currentGroupChannel.isFrozen && props.userRole === 'learner') ||
            currentGroupChannel.myMutedState === 'muted'
              ? true
              : false
          }
          autoFocus={false}
          type='text'
          placeholder={controlDisabledInputPlaceholder()}
        />

        <div className='send_image_box'>
          <Image
            className='sendMessageIcon'
            src={
              messageText !== ''
                ? '/pages/Sendbird/active_send_message_icon.svg'
                : '/pages/Sendbird/non_active_send_message_icon.svg'
            }
            onClick={() => handleSendMessage()}
            width={24}
            height={24}
            alt='sendMessageIcon'
          />
        </div>
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
