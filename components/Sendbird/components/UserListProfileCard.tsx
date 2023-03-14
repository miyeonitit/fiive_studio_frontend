import React, { useState, useEffect, useRef } from 'react'
import { MouseEvent } from 'react'
import Image from 'next/image'
import { ToastContainer, toast, cssTransition } from 'react-toastify'

import { useChannelContext } from '@sendbird/uikit-react/Channel/context'

import 'animate.css'
import '../../../node_modules/react-toastify/dist/ReactToastify.css'

import AxiosRequest from '../../../utils/AxiosRequest'
import fiiveStudioUseStore from '../../../store/FiiveStudio'

import MessageTooltip from './MessageTooltip'

type props = {
  user: any
  index: number
  userLength: number
  userId: string
  userRole: string
  channelUrl: string
  isUserList: boolean
  userFilter: string
  isUserFilterMiniMenu: boolean
  saveIndex: number
  setSaveIndex: React.Dispatch<React.SetStateAction<number>>
  saveComponentIndex: (arg0: number) => void
  currentGroupChannel: object
}

const UserListProfileCard = (props: props) => {
  // user auth token for API
  const authToken = fiiveStudioUseStore((state: any) => state.authToken)

  // 더보기 버튼과 메뉴 노출 boolean state
  const [isHoverMoreMenu, setIsHoverMoreMenu] = useState(false)
  const [isMoreMiniMenu, setIsMoreMiniMenu] = useState(false)

  // sender의 차단 여부 boolean state
  const [isBlockUser, setIsBlockUser] = useState(false)
  const [isMutedUser, setIsMutedUser] = useState(false)

  // blocked, muted 된 user 아이콘 설명 툴팁 boolean state
  const [isMutedUserTooltip, setIsMutedUserTooltip] = useState(false)
  const [isBlockedUserTooltip, setIsBlockedUserTooltip] = useState(false)

  const miniMenuRef = React.useRef() as React.MutableRefObject<HTMLDivElement>

  const redirectFiive = process.env.NEXT_PUBLIC_FIIVE_URL

  const fadeUp = cssTransition({
    enter: 'animate__animated animate__customFadeInUp',
    exit: 'animate__animated animate__fadeOut',
  })

  const handleMoreMenuButton = () => {
    setIsMoreMiniMenu(!isMoreMiniMenu)
    props.saveComponentIndex(props.index)
  }

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

  const blockUser = async (senderId: string, senderNickName: string) => {
    const requestUrl = `/sendbird/users/${props.userId}/block`

    const body = {
      target_id: senderId,
    }

    const responseData = await AxiosRequest({
      url: requestUrl,
      method: 'POST',
      body: body,
      token: authToken,
    })

    if (responseData.name !== 'AxiosError') {
      controlToastPopup(true, `${senderNickName} 님을 차단했어요.`)
      setIsBlockUser(true)
      setIsMoreMiniMenu(false)
    } else {
      controlToastPopup(false, '네트워크 문제로 차단하지 못했어요.')
    }
  }

  const unblockUser = async (senderId: string, senderNickName: string) => {
    const requestUrl = `/sendbird/users/${props.userId}/block/${senderId}`

    const responseData = await AxiosRequest({
      url: requestUrl,
      method: 'DELETE',
      body: '',
      token: authToken,
    })

    if (responseData.name !== 'AxiosError') {
      controlToastPopup(true, `${senderNickName} 님을 차단 해제했어요.`)
      setIsBlockUser(false)
      setIsMoreMiniMenu(false)
    } else {
      controlToastPopup(false, '네트워크 문제로 차단 해제 못했어요.')
    }
  }

  const muteUser = async (senderId: string, senderNickName: string) => {
    const requestUrl = `/sendbird/group_channels/${props.channelUrl}/mute`

    const body = {
      user_id: senderId,
      seconds: 600,
    }

    const responseData = await AxiosRequest({
      url: requestUrl,
      method: 'POST',
      body: body,
      token: authToken,
    })

    if (responseData.name !== 'AxiosError') {
      controlToastPopup(true, `${senderNickName} 님을 채팅 일시정지 했어요.`)
      setIsMutedUser(true)
      setIsMoreMiniMenu(false)
    } else {
      controlToastPopup(false, '네트워크 문제로 채팅 일시정지를 못했어요.')
    }
  }

  const unmuteUser = async (senderId: string, senderNickName: string) => {
    const requestUrl = `/sendbird/group_channels/${props.channelUrl}/mute/${senderId}`

    const responseData = await AxiosRequest({
      url: requestUrl,
      method: 'DELETE',
      body: '',
      token: authToken,
    })

    if (responseData.name !== 'AxiosError') {
      controlToastPopup(
        true,
        `${senderNickName} 님의 채팅 일시정지를 해제했어요.`
      )
      setIsMutedUser(false)
      setIsMoreMiniMenu(false)
    } else {
      controlToastPopup(false, '네트워크 문제로 채팅 일시정지 해제를 못했어요.')
    }
  }

  // 더보기 미니 메뉴 outside click
  const clickModalOutside = (e: MouseEvent<HTMLElement>) => {
    const event = e.target as HTMLDivElement

    if (isMoreMiniMenu && !miniMenuRef.current.contains(event)) {
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
        break

      case '채팅 정지된 참여자':
        // 전체 채팅방 유저중에 현재 user id와 같은 유저 id를 골라내기
        const findMutedUser = props.currentGroupChannel.members.find(
          (user: any) => user.userId === props.user.user_id
        )

        // 전체 채팅방 유저 중 해당 id를 가진 유저의 인덱스 알아내기
        const indexOfMutedUser =
          props.currentGroupChannel.members.indexOf(findMutedUser)

        // 해당 group channel에 속하지 않은 user가 뮤트된 user 목록(채팅 정지된 참여자)에 있을 경우를 위한 undefined error 방지
        if (indexOfMutedUser > 0) {
          // 해당 유저가 muted 되었는지 여부 확인
          const isUserMuted =
            props.currentGroupChannel.members[indexOfMutedUser].isMuted

          setIsMutedUser(isUserMuted)
        }

        break

      case '차단된 참여자':
        // 전체 채팅방 유저중에 현재 user id와 같은 유저 id를 골라내기
        const findBlockedUser = props.currentGroupChannel.members.find(
          (user: any) => user.userId === props.user.user_id
        )

        // 전체 채팅방 유저 중 해당 id를 가진 유저의 인덱스 알아내기
        const indexOfFindedUser =
          props.currentGroupChannel.members.indexOf(findBlockedUser)

        // 해당 group channel에 속하지 않은 user가 차단된 user 목록(차단된 참여자)에 있을 경우를 위한 undefined error 방지
        if (indexOfFindedUser > 0) {
          // 해당 유저가 blocked 되었는지 여부 확인
          const isUserBlocked =
            props.currentGroupChannel.members[indexOfFindedUser].isBlockedByMe

          setIsBlockUser(isUserBlocked)
        }

        break
    }
  }, [props.userFilter, props.isUserFilterMiniMenu])

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
                props.user?.plainProfileUrl
                  ? props.user?.plainProfileUrl
                  : '/pages/Sendbird/user_list_fiive_default_img.svg'
              }
              width={32}
              height={32}
              alt='fiiveDefaultImg'
            />
          </div>
          <div className='user_infomation_box'>
            <div className='user_infomations'>
              <div className='user_nickname_box'>
                {props.user?.nickname ? props.user?.nickname : 'learner'}
              </div>
              <div className='user_online_status_box'>
                <Image
                  src={
                    props.user?.is_online ||
                    props.user?.connectionStatus === 'online'
                      ? '/pages/Sendbird/online_status.svg'
                      : '/pages/Sendbird/offline_status.svg'
                  }
                  width={6}
                  height={6}
                  alt='connection_status'
                />
              </div>

              {props.userRole !== 'learner' && (
                <div className='user_name_box'>
                  {props.user?.metaData?.name}
                </div>
              )}

              {isBlockUser && (
                <div className='user_blocked_status_box'>
                  <Image
                    src='/pages/Sendbird/blocked_user_by_me.svg'
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
                    src='/pages/Sendbird/muted_user_by_me.svg'
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
              {props.user?.metaData?.role === 'learner' ||
              props.user?.metadata?.role === 'learner'
                ? '수강생'
                : '선생님'}
            </div>
          </div>
        </div>

        {/* 마우스 hover에 따라 나타나는 더보기 버튼 */}
        {isHoverMoreMenu && (
          <div className={`more_menu_box ${isMoreMiniMenu && 'active'}`}>
            <Image
              src='/pages/Sendbird/more_button.svg'
              onClick={() => handleMoreMenuButton()}
              width={16}
              height={16}
              alt='moreButton'
            />
          </div>
        )}

        {/* 더보기 버튼 클릭시 뜨는 미니 메뉴 */}
        {isMoreMiniMenu && (
          <div
            className={`more_mini_menu_wrapper ${
              props.index >= 1 &&
              (props.userLength - 1 === props.index ||
                props.userLength - 2 === props.index) &&
              (props.userRole === 'learner' ? 'learner_top' : 'operator_top')
            }`}
            ref={miniMenuRef}
          >
            <div className='more_mini_menu'>
              {props.userRole !== 'learner' &&
                (isMutedUser ? (
                  <div
                    className='list_in_menu'
                    onClick={() => {
                      unmuteUser(
                        props.userFilter === '라이브 참여자'
                          ? props.user?.userId
                          : props.user?.user_id,
                        props.user?.nickname
                      )
                    }}
                  >
                    <Image
                      src='/pages/Sendbird/mute_outlined.svg'
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
                      muteUser(
                        props.userFilter === '라이브 참여자'
                          ? props.user?.userId
                          : props.user?.user_id,
                        props.user?.nickname
                      )
                    }}
                  >
                    <Image
                      src='/pages/Sendbird/mute_outlined.svg'
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
                  onClick={() =>
                    unblockUser(
                      props.userFilter === '라이브 참여자'
                        ? props.user?.userId
                        : props.user?.user_id,
                      props.user?.nickname
                    )
                  }
                >
                  <Image
                    src='/pages/Sendbird/learner_uncert.svg'
                    width={16}
                    height={16}
                    alt='blockButton'
                  />
                  <span>메시지 차단 해제</span>
                </div>
              ) : (
                <div
                  className='list_in_menu'
                  onClick={() =>
                    blockUser(
                      props.userFilter === '라이브 참여자'
                        ? props.user?.userId
                        : props.user?.user_id,
                      props.user?.nickname
                    )
                  }
                >
                  <Image
                    src='/pages/Sendbird/learner_uncert.svg'
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
