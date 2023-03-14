import React, {
  useState,
  useEffect,
  useRef,
  Dispatch,
  SetStateAction,
} from 'react'
import Image from 'next/image'

type props = {
  userFilter: string
  isUserFilterMiniMenu: boolean
  setIsUserFilterMiniMenu: Dispatch<SetStateAction<boolean>>
  handleUserFilterStatus: (status: string) => void
}

const ResponsiveUserFilterMenu = (props: props) => {
  // modal을 닫을 때, 애니메이션 효과와 setTimeout을 하기 위한 boolean state
  const [isCloseModal, setIsCloseModal] = useState(false)

  const userFilterRef = React.useRef() as React.MutableRefObject<HTMLDivElement>

  const closeModal = () => {
    setIsCloseModal(true)

    // 400초가 지나면 modal close 처리
    let timer = setTimeout(() => props.setIsUserFilterMiniMenu(false), 400)

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
    props.handleUserFilterStatus(status)
  }

  const clickModalOutside = (e) => {
    if (
      props.isUserFilterMiniMenu &&
      !userFilterRef.current.contains(e.target)
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
  }, [props.isUserFilterMiniMenu])

  return (
    <div className='ResponsiveUserFilterMenu'>
      <div
        className={
          !isCloseModal
            ? 'user_filter_modal_wrapper'
            : 'user_filter_modal_wrapper non_active'
        }
        ref={userFilterRef}
      >
        <div className='responsive_modal_title'>
          <div className='add_reaction_title_text'>참여자 목록 보기</div>
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
            onClick={() => controlModalCloseAnimation('live')}
          >
            <div className='user_list_button_image_box'>
              <Image
                src={
                  props.userFilter === '라이브 참여자'
                    ? '/pages/Sendbird/active_members_icon.svg'
                    : '/pages/Sendbird/members_icon.svg'
                }
                width={18}
                height={18}
                alt='liveUsersList'
              />
            </div>
            <div
              className={`user_list_button_text_box ${
                props.userFilter === '라이브 참여자' && 'active'
              }`}
            >
              라이브 참여자
            </div>
          </div>

          <div
            className='modal_line_menu'
            onClick={() => controlModalCloseAnimation('muted')}
          >
            <div className='muted_user_list_button_image_box'>
              <Image
                src={
                  props.userFilter === '채팅 정지된 참여자'
                    ? '/pages/Sendbird/active_mute_outlined.svg'
                    : '/pages/Sendbird/mute_outlined.svg'
                }
                width={18}
                height={18}
                alt='mutedUsersList'
              />
            </div>
            <div
              className={`muted_user_list_button_text_box ${
                props.userFilter === '채팅 정지된 참여자' && 'active'
              }`}
            >
              채팅 정지된 참여자
            </div>
          </div>

          <div
            className='modal_line_menu'
            onClick={() => controlModalCloseAnimation('blocked')}
          >
            <div className='blocked_user_list_button_image_box'>
              <Image
                src={
                  props.userFilter === '차단된 참여자'
                    ? '/pages/Sendbird/active_learner_uncert.svg'
                    : '/pages/Sendbird/learner_uncert.svg'
                }
                width={18}
                height={18}
                alt='blockedUsersList'
              />
            </div>
            <div
              className={`blocked_user_list_button_text_box ${
                props.userFilter === '차단된 참여자' && 'active'
              }`}
            >
              차단된 참여자
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResponsiveUserFilterMenu
