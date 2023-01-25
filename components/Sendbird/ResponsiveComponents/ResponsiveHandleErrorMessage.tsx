import React, {
  useState,
  useEffect,
  useRef,
  Dispatch,
  SetStateAction,
} from 'react'
import Image from 'next/image'

import { useChannelContext } from '@sendbird/uikit-react/Channel/context'
import sendbirdSelectors from '@sendbird/uikit-react/sendbirdSelectors'
import useSendbirdStateContext from '@sendbird/uikit-react/useSendbirdStateContext'

type props = {
  messageInfomation: object
  isResponsiveErrorMsgModal: boolean
  setIsResponsiveErrorMsgModal: Dispatch<SetStateAction<boolean>>
}

const ResponsiveHandleErrorMessage = (props: props) => {
  const { currentGroupChannel } = useChannelContext()
  const globalStore = useSendbirdStateContext()

  // modal을 닫을 때, 애니메이션 효과와 setTimeout을 하기 위한 boolean state
  const [isCloseModal, setIsCloseModal] = useState(false)

  const errorMsgModalRef = useRef<HTMLDivElement>(null)

  const deleteMessage = () => {
    const deleteMessage = sendbirdSelectors.getDeleteMessage(globalStore)

    deleteMessage(currentGroupChannel, props.messageInfomation)
      .then((message: any) => {})
      .catch((error: any) => {
        console.log(error, 'error')
        alert('다시 시도해 주세요.')
      })
  }

  const resendMessage = () => {
    const resendUserMessage =
      sendbirdSelectors.getResendUserMessage(globalStore)

    resendUserMessage(currentGroupChannel, props.messageInfomation)
      .then((message: any) => {})
      .catch((error: any) => {
        console.log(error, 'error')
        alert('다시 시도해 주세요.')
      })
  }

  const closeModal = () => {
    setIsCloseModal(true)

    // 400초가 지나면 modal close 처리
    let timer = setTimeout(() => props.setIsResponsiveErrorMsgModal(false), 400)

    // setTimeout의 cleanUp 처리
    clearSetTimeOut(timer)
  }

  const clearSetTimeOut = (countTimer: any) => {
    return () => {
      clearTimeout(countTimer)
    }
  }

  const clickModalOutside = (e) => {
    if (
      props.isResponsiveErrorMsgModal &&
      !errorMsgModalRef.current.contains(e.target)
    ) {
      closeModal()
    }
  }

  // 반응형 모달 outside click
  useEffect(() => {
    document.addEventListener('mousedown', clickModalOutside)

    return () => {
      document.removeEventListener('mousedown', clickModalOutside)
    }
  }, [props.isResponsiveErrorMsgModal])

  return (
    <div className='ResponsiveHandleErrorMessage'>
      {/* non_active 일 때 close modal animation 실행 */}
      <div
        className={
          !isCloseModal
            ? 'error_message_modal_wrapper'
            : 'error_message_modal_wrapper non_active'
        }
        ref={errorMsgModalRef}
      >
        <div className='responsive_modal_title'>
          <div className='add_reaction_title_text'>메시지를 다시 보낼까요?</div>
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
          <div className='modal_line_menu' onClick={() => resendMessage()}>
            <div className='retry_button_image_box'>
              <Image
                src='/pages/Sendbird/retry_button.svg'
                width={18}
                height={18}
                alt='retryButton'
              />
            </div>
            <div className='retry_button_text_box'>다시 보내기</div>
          </div>
          <div className='modal_line_menu' onClick={() => deleteMessage()}>
            <div className='delete_button_image_box'>
              <Image
                src='/pages/Sendbird/delete_button.svg'
                width={18}
                height={18}
                alt='deleteButton'
              />
            </div>
            <div className='delete_button_text_box'>삭제</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResponsiveHandleErrorMessage
