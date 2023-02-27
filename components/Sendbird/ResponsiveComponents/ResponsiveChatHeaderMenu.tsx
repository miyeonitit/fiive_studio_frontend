import React, { useState, useEffect, Dispatch, SetStateAction } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { getCookie, setCookie } from 'cookies-next'
import { ToastContainer, toast, cssTransition } from 'react-toastify'

import 'animate.css'
import '../../../node_modules/react-toastify/dist/ReactToastify.css'

import fiiveStudioUseStore from '../../../store/FiiveStudio'

type props = {
  isMoreMiniMenu: boolean
  setIsMoreMiniMenu: Dispatch<SetStateAction<boolean>>
  controlMenuSetting: () => void
  isFreezeChat: boolean
  controlFreezeChat: () => void
  userRole: string
}

const ResponsiveChatHeaderMenu = (props: props) => {
  const router = useRouter()

  // modal을 닫을 때, 애니메이션 효과와 setTimeout을 하기 위한 boolean state
  const [isCloseModal, setIsCloseModal] = useState(false)

  // user auth token for API
  const authToken = fiiveStudioUseStore((state: any) => state.authToken)

  const headerModalRef =
    React.useRef() as React.MutableRefObject<HTMLDivElement>

  const studioUrl = process.env.NEXT_PUBLIC_TEST_STUDIO_URL

  const fadeUp = cssTransition({
    enter: 'animate__animated animate__customFadeInUp',
    exit: 'animate__animated animate__fadeOut',
  })

  // status가 true: toast 성공 <> false : toast 에러
  const controlToastPopup = (status: boolean, contentText: string) => {
    if (status) {
      toast.success(
        <div className='toast_success_box'>
          <Image
            src='/pages/Sendbird/toast_success_icon.svg'
            width={16}
            height={16}
            alt='toastSuccessIcon'
          />
          <span className='toast_success_text'>{contentText}</span>
        </div>,
        { transition: fadeUp }
      )
    } else {
      toast.error(
        <div className='toast_error_box'>
          <Image
            src='/pages/Sendbird/toast_warning_icon.svg'
            width={16}
            height={16}
            alt='toastWarningIcon'
          />
          <span className='toast_error_text'>{contentText}</span>
        </div>,
        { transition: fadeUp }
      )
    }
  }

  const openChatMonitor = () => {
    // 만약 cookie에 auth-token 값이 없거나 일치하지 않다면, authToken을 setCookie
    if (getCookie('auth-token') !== authToken) {
      setCookie('auth-token', authToken)
    }

    // 채팅방 팝업 새창 url을 클립보드에 복사
    const chatUrl =
      studioUrl +
      '/chat-monitor?classId=' +
      router.query.classId +
      '&sessionIdx=' +
      router.query.sessionIdx +
      '&token=' +
      authToken

    window.navigator.clipboard.writeText(chatUrl)

    props.setIsMoreMiniMenu(false)
    closeModal()
    controlToastPopup(true, '채팅방 URL을 복사했어요.')
  }

  const closeModal = () => {
    setIsCloseModal(true)

    // 400초가 지나면 modal close 처리
    let timer = setTimeout(() => {
      props.setIsMoreMiniMenu(false)
    }, 400)

    // setTimeout의 cleanUp 처리
    clearSetTimeOut(timer)
  }

  const clearSetTimeOut = (countTimer: any) => {
    return () => {
      clearTimeout(countTimer)
    }
  }

  const controlModalCloseAnimation = (status: string) => {
    closeModal()

    switch (status) {
      case 'liveUserList':
        props.controlMenuSetting()
        break

      case 'chatFreeze':
        props.controlFreezeChat()
        break
    }
  }

  const clickModalOutside = (e) => {
    if (props.isMoreMiniMenu && !headerModalRef.current.contains(e.target)) {
      closeModal()
    }
  }

  // 반응형 모달 outside click
  useEffect(() => {
    document.addEventListener('mousedown', clickModalOutside)

    return () => {
      document.removeEventListener('mousedown', clickModalOutside)
    }
  }, [props.isMoreMiniMenu])

  return (
    <div className='ResponsiveChatHeaderMenu'>
      <div
        className={
          !isCloseModal
            ? 'chat_header_menu_modal_wrapper'
            : 'chat_header_menu_modal_wrapper non_active'
        }
        ref={headerModalRef}
      >
        <div className='responsive_modal_title'>
          <div className='add_reaction_title_text'>채팅 관리</div>
          <div className='close_modal_image_box' onClick={() => closeModal()}>
            <Image
              src='/pages/Sendbird/responsive_close_button.svg'
              width={20}
              height={20}
              alt='closeButton'
            />
          </div>
        </div>

        <div className='responsive_modal_container'>
          <div
            className='modal_line_menu'
            onClick={() => controlModalCloseAnimation('liveUserList')}
          >
            <div className='user_list_button_image_box'>
              <Image
                src='/pages/Sendbird/members_icon.svg'
                width={18}
                height={18}
                alt='retryButton'
              />
            </div>
            <div className='user_list_button_text_box'>라이브 참여자 보기</div>
          </div>

          {props.userRole !== 'learner' && (
            <>
              <div
                className='modal_line_menu'
                onClick={() => controlModalCloseAnimation('chatFreeze')}
              >
                <div className='freeze_button_image_box'>
                  <Image
                    src='/pages/Sendbird/lock_icon.svg'
                    width={18}
                    height={18}
                    alt='deleteButton'
                  />
                </div>
                {props.isFreezeChat ? (
                  <div className='freeze_button_text_box'>채팅창 녹이기</div>
                ) : (
                  <div className='freeze_button_text_box'>채팅창 얼리기</div>
                )}
              </div>

              <div
                className='modal_line_menu'
                onClick={() => openChatMonitor()}
              >
                <div className='share_chat_button_image_box'>
                  <Image
                    src='/pages/Sendbird/share_chatting_icon.svg'
                    width={18}
                    height={18}
                    alt='deleteButton'
                  />
                </div>
                <div className='share_chat_button_text_box'>채팅 내보내기</div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ResponsiveChatHeaderMenu
