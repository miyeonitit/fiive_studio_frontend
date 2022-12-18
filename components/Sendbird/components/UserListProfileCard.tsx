import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { ToastContainer, toast, cssTransition } from 'react-toastify'

import 'animate.css'
import '../../../node_modules/react-toastify/dist/ReactToastify.css'

import { useChannelContext } from '@sendbird/uikit-react/Channel/context'

import MessageTooltip from './MessageTooltip'

import fiiveDefaultImg from '../../../public/pages/fiive/user_list_fiive_default_img.svg'
import onlineStatus from '../../../public/pages/fiive/online_status.svg'
import offlineStatus from '../../../public/pages/fiive/offline_status.svg'
import moreButton from '../../../public/pages/fiive/more_button.svg'
import blockedIcon from '../../../public/pages/fiive/blocked_user_by_me.svg'
import mutedIcon from '../../../public/pages/fiive/muted_user_by_me.svg'
import mutedButton from '../../../public/pages/fiive/mute_outlined.svg'
import blockButton from '../../../public/pages/fiive/learner_uncert.svg'
import toastSuccessIcon from '../../../public/pages/fiive/toast_success_icon.svg'
import toastWarningIcon from '../../../public/pages/fiive/toast_warning_icon.svg'

type props = {
  user: any
  index: number
  userId: string
  userRole: string
  isUserList: boolean
  userFilter: string
  isUserFilterMiniMenu: boolean
  saveIndex: number
  setSaveIndex: React.Dispatch<React.SetStateAction<number>>
  saveComponentIndex: (arg0: number) => void
}

const UserListProfileCard = (props: props) => {
  const { currentGroupChannel } = useChannelContext()

  // 더보기 버튼과 메뉴 노출 boolean state
  const [isHoverMoreMenu, setIsHoverMoreMenu] = useState(false)
  const [isMoreMiniMenu, setIsMoreMiniMenu] = useState(false)

  // sender의 차단 여부 boolean state
  const [isBlockUser, setIsBlockUser] = useState(props.user.isBlockedByMe)
  const [isMutedUser, setIsMutedUser] = useState(props.user.isMuted)

  // blocked, muted 된 user 아이콘 설명 툴팁 boolean state
  const [isMutedUserTooltip, setIsMutedUserTooltip] = useState(false)
  const [isBlockedUserTooltip, setIsBlockedUserTooltip] = useState(false)

  const miniMenuRef = useRef<HTMLButtonElement>(null)

  const appId = process.env.NEXT_PUBLIC_SENDBIRD_APP_ID
  const apiToken = process.env.NEXT_PUBLIC_SENDBIRD_API_TOKEN
  const currentChannelUrl = process.env.NEXT_PUBLIC_SENDBIRD_TEST_CHANNEL_ID

  const fadeUp = cssTransition({
    enter: 'animate__animated animate__customFadeInUp',
    exit: 'animate__animated animate__fadeOut',
  })

  const handleMoreMenuButton = () => {
    setIsMoreMiniMenu(!isMoreMiniMenu)
    props.saveComponentIndex(props.index)
  }

  const muteUser = (senderId: string) => {
    fetch(
      `https://api-${appId}.sendbird.com/v3/group_channels/${currentChannelUrl}/mute`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf8',
          Accept: 'application/json',
          'Api-Token': apiToken,
        },
        body: JSON.stringify({
          user_id: senderId,
          seconds: 600,
        }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log('성공:', data)
        toast.success(
          <div className='toast_success_box'>
            <Image src={toastSuccessIcon} alt='toastSuccessIcon' />
            <span className='toast_success_text'>
              {senderId} 님을 채팅 일시정지 했어요.
            </span>
          </div>,
          { transition: fadeUp }
        )
        setIsMutedUser(true)
        setIsMoreMiniMenu(false)
      })
      .catch((error) => {
        console.error('실패:', error)
        toast.error(
          <div className='toast_error_box'>
            <Image src={toastWarningIcon} alt='toastWarningIcon' />
            <span className='toast_error_text'>
              네트워크 문제로 채팅 일시정지를 못했어요.
            </span>
          </div>,
          { transition: fadeUp }
        )
      })
  }

  const unmuteUser = (senderId: string) => {
    fetch(
      `https://api-${appId}.sendbird.com/v3/group_channels/${currentChannelUrl}/mute/${senderId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json; charset=utf8',
          Accept: 'application/json',
          'Api-Token': apiToken,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log('성공:', data)
        toast.success(
          <div className='toast_success_box'>
            <Image src={toastSuccessIcon} alt='toastSuccessIcon' />
            <span className='toast_success_text'>
              {senderId} 님의 채팅 일시정지를 해제했어요.
            </span>
          </div>,
          { transition: fadeUp }
        )
        setIsMutedUser(false)
        setIsMoreMiniMenu(false)
      })
      .catch((error) => {
        console.error('실패:', error)
        toast.error(
          <div className='toast_error_box'>
            <Image src={toastWarningIcon} alt='toastWarningIcon' />
            <span className='toast_error_text'>
              네트워크 문제로 채팅 일시정지 해제를 못했어요.
            </span>
          </div>,
          { transition: fadeUp }
        )
      })
  }

  const blockUser = (senderId: string) => {
    fetch(`https://api-${appId}.sendbird.com/v3/users/${props.userId}/block`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf8',
        Accept: 'application/json',
        'Api-Token': apiToken,
      },
      body: JSON.stringify({
        target_id: senderId,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('성공:', data)
        toast.success(
          <div className='toast_success_box'>
            <Image src={toastSuccessIcon} alt='toastSuccessIcon' />
            <span className='toast_success_text'>
              {senderId} 님을 차단했어요.
            </span>
          </div>,
          { transition: fadeUp }
        )
        setIsBlockUser(true)
        setIsMoreMiniMenu(false)
      })
      .catch((error) => {
        console.error('실패:', error)
        toast.error(
          <div className='toast_error_box'>
            <Image src={toastWarningIcon} alt='toastWarningIcon' />
            <span className='toast_error_text'>
              네트워크 문제로 차단하지 못했어요.
            </span>
          </div>,
          { transition: fadeUp }
        )
      })
  }

  const unblockUser = (senderId: string) => {
    fetch(
      `https://api-${appId}.sendbird.com/v3/users/${props.userId}/block/${senderId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json; charset=utf8',
          Accept: 'application/json',
          'Api-Token': apiToken,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log('성공:', data)
        toast.success(
          <div className='toast_success_box'>
            <Image src={toastSuccessIcon} alt='toastSuccessIcon' />
            <span className='toast_success_text'>
              {senderId} 님을 차단 해제했어요.
            </span>
          </div>,
          { transition: fadeUp }
        )
        setIsBlockUser(false)
        setIsMoreMiniMenu(false)
      })
      .catch((error) => {
        console.error('실패:', error)
        toast.error(
          <div className='toast_error_box'>
            <Image src={toastWarningIcon} alt='toastWarningIcon' />
            <span className='toast_error_text'>
              네트워크 문제로 차단 해제 못했어요.
            </span>
          </div>,
          { transition: fadeUp }
        )
      })
  }

  // 더보기 미니 메뉴 outside click
  const clickModalOutside = (e) => {
    if (isMoreMiniMenu && !miniMenuRef.current.contains(e.target)) {
      setIsMoreMiniMenu(false)
    }
  }

  // 더보기 미니 메뉴 outside click
  useEffect(() => {
    document.addEventListener('mousedown', clickModalOutside)

    return () => {
      document.removeEventListener('mousedown', clickModalOutside)
    }
  }, [isMoreMiniMenu])

  // 다른 user 영역의 더보기를 클릭했을 경우, 현재 열려있는 더보기 미니메뉴가 닫히면서, 다른 user의 미니메뉴가 열리게 하는 로직
  useEffect(() => {
    setIsMoreMiniMenu(props.saveIndex === props.index)
  }, [props.saveIndex])

  // 현재 라이브 참여자 리스트를 열고 닫을 때마다, user의 더보기 미니메뉴를 닫는 로직
  useEffect(() => {
    setIsMoreMiniMenu(false)
  }, [props.isUserList])

  // user filter를 선택할 때마다 blocked, muted 된 상태값 표현 아이콘을 정상적으로 표현하기 위한 로직
  useEffect(() => {
    switch (props.userFilter) {
      // default
      case '라이브 참여자':
        setIsBlockUser(props.user.isBlockedByMe)
        setIsMutedUser(props.user.isMuted)
        return

      case '채팅 정지된 참여자':
        // 전체 채팅방 유저중에 현재 user id와 같은 유저 id를 골라내기
        const findMutedUser = currentGroupChannel.members.find(
          (user: any) => user.userId === props.user.user_id
        )

        // 전체 채팅방 유저 중 해당 id를 가진 유저의 인덱스 알아내기
        const indexOfMutedUser =
          currentGroupChannel.members.indexOf(findMutedUser)

        // 해당 유저가 muted 되었는지 여부 확인
        const isUserMuted =
          currentGroupChannel.members[indexOfMutedUser].isMuted

        setIsMutedUser(isUserMuted)

      case '차단된 참여자':
        // 전체 채팅방 유저중에 현재 user id와 같은 유저 id를 골라내기
        const findBlockedUser = currentGroupChannel.members.find(
          (user: any) => user.userId === props.user.user_id
        )

        // 전체 채팅방 유저 중 해당 id를 가진 유저의 인덱스 알아내기
        const indexOfFindedUser =
          currentGroupChannel.members.indexOf(findBlockedUser)

        // 해당 유저가 blocked 되었는지 여부 확인
        const isUserBlocked =
          currentGroupChannel.members[indexOfFindedUser].isBlockedByMe

        setIsBlockUser(isUserBlocked)
    }
  }, [props.isUserFilterMiniMenu])

  return (
    <div className='UserListProfileCard'>
      <div
        className='user_list_box'
        onMouseOver={() => setIsHoverMoreMenu(true)}
        onMouseOut={() => setIsHoverMoreMenu(false)}
      >
        <div className='user_infomation_box'>
          <div className='user_profile_box'>
            <Image
              src={
                props.user.plainProfileUrl
                  ? props.user.plainProfileUrl
                  : fiiveDefaultImg
              }
              width={32}
              height={32}
              alt='fiiveDefaultImg'
            />
          </div>
          <div className='user_infomation_box'>
            <div className='user_infomations'>
              <div className='user_nickname_box'>nickname</div>
              <div className='user_online_status_box'>
                <Image
                  src={
                    props.user.connectionStatus === 'online'
                      ? onlineStatus
                      : offlineStatus
                  }
                  width={6}
                  height={6}
                  alt='connection_status'
                />
              </div>

              {props.userRole !== 'learner' && (
                <div className='user_name_box'>name</div>
              )}

              {isBlockUser && (
                <div className='user_blocked_status_box'>
                  <Image
                    src={blockedIcon}
                    onMouseOver={() => setIsBlockedUserTooltip(true)}
                    onMouseOut={() => setIsBlockedUserTooltip(false)}
                    width={14}
                    height={14}
                    alt='blockedIcon'
                  />

                  {isBlockedUserTooltip && (
                    <MessageTooltip
                      topHeight='-47'
                      rightWidth='-38'
                      width='93'
                      tooltipText='메시지 차단 중'
                    />
                  )}
                </div>
              )}
              {isMutedUser && (
                <div className='user_muted_status_box'>
                  <Image
                    src={mutedIcon}
                    onMouseOver={() => setIsMutedUserTooltip(true)}
                    onMouseOut={() => setIsMutedUserTooltip(false)}
                    width={14}
                    height={14}
                    alt='mutedIcon'
                  />

                  {isMutedUserTooltip && (
                    <MessageTooltip
                      topHeight='-47'
                      rightWidth='-42'
                      width='103'
                      tooltipText='채팅 일시정지 중'
                    />
                  )}
                </div>
              )}
            </div>
            <div className='user_role'>
              {props.user.role === 'operator' ? '선생님' : '수강생'}
            </div>
          </div>
        </div>

        {/* 마우스 hover에 따라 나타나는 더보기 버튼 */}
        {isHoverMoreMenu && (
          <div className='more_menu_box'>
            <Image
              src={moreButton}
              onClick={() => handleMoreMenuButton()}
              width={16}
              height={16}
              alt='moreButton'
            />
          </div>
        )}

        {/* 더보기 버튼 클릭시 뜨는 미니 메뉴 */}
        {isMoreMiniMenu && (
          <div className='more_mini_menu_wrapper' ref={miniMenuRef}>
            <div className='more_mini_menu'>
              {props.userRole === 'teacher' &&
                (isMutedUser ? (
                  <div
                    className='list_in_menu'
                    onClick={() => {
                      unmuteUser(props.user.userId)
                    }}
                  >
                    <Image
                      src={mutedButton}
                      width={16}
                      height={16}
                      alt='mutedButton'
                    />
                    <span>채팅 일시정지 해제</span>
                  </div>
                ) : (
                  <div
                    className='list_in_menu'
                    onClick={() => {
                      muteUser(props.user.userId)
                    }}
                  >
                    <Image
                      src={mutedButton}
                      width={16}
                      height={16}
                      alt='mutedButton'
                    />
                    <span>채팅 일시정지 (10분)</span>
                  </div>
                ))}

              {isBlockUser ? (
                <div
                  className='list_in_menu'
                  onClick={() => unblockUser(props.user.userId)}
                >
                  <Image
                    src={blockButton}
                    width={16}
                    height={16}
                    alt='blockButton'
                  />
                  <span>메시지 차단 해제</span>
                </div>
              ) : (
                <div
                  className='list_in_menu'
                  onClick={() => blockUser(props.user.userId)}
                >
                  <Image
                    src={blockButton}
                    width={16}
                    height={16}
                    alt='blockButton'
                  />
                  <span>메시지 차단</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

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

export default UserListProfileCard
