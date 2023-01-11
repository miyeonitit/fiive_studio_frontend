import React, {
  useState,
  useEffect,
  useRef,
  Dispatch,
  SetStateAction,
} from 'react'
import Image from 'next/image'
import axios from 'axios'

import { useChannelContext } from '@sendbird/uikit-react/Channel/context'

import sendBirdUseStore from '../../store/Sendbird'
import fiiveStudioUseStore from '../../store/FiiveStudio'

import UserListProfileCard from './components/UserListProfileCard'
import ResponsiveChatHeaderMenu from './ResponsiveComponents/ResponsiveChatHeaderMenu'
import ResponsiveUserFilterMenu from './ResponsiveComponents/ResponsiveUserFilterMenu'

type props = {
  userId: string
  userRole: string
  isChatOpen: boolean
  setIsChatOpen: Dispatch<SetStateAction<boolean>>
}

const CustomChatHeader = (props: props) => {
  // 반응형 미디어쿼리 스타일 지정을 위한 브라우저 넓이 측정 전역 state
  const offsetX = fiiveStudioUseStore((state: any) => state.offsetX)

  // sendbird Chat close 동작을 위한 toggle boolean state
  const setIsChatOpen = fiiveStudioUseStore((state: any) => state.setIsChatOpen)

  // 반응형 전용 모달이 활성화 된 상태인지 확인하는 boolean state
  const setIsOpenResponsiveModal = fiiveStudioUseStore(
    (state: any) => state.setIsOpenResponsiveModal
  )

  // 반응형 사이즈에서 header의 라이브 참여자 목록을 볼 때, UI height 버그를 처리하기 위해 확인하는 boolean state
  const setIsOpenResponsiveLiveMember = fiiveStudioUseStore(
    (state: any) => state.setIsOpenResponsiveLiveMember
  )

  // 유저 리스트 전역 state
  const contextSetIsUserList = sendBirdUseStore(
    (state: any) => state.setIsUserList
  )

  const { currentGroupChannel } = useChannelContext()

  // 더보기 메뉴 노출 boolean state
  const [isMoreMiniMenu, setIsMoreMiniMenu] = useState(false)

  // 유저 리스트 (라이브 참여자) 노출 boolean state
  const [isUserList, setIsUserList] = useState(false)
  const [userList, setUserList] = useState([])

  // 채팅방 freeze 여부 boolean state
  const [isFreezeChat, setIsFreezeChat] = useState(currentGroupChannel.isFrozen)

  // 특정 카드 컴포넌트의 index를 저장하기 위한 state
  const [saveIndex, setSaveIndex] = useState(-1)

  // 유저 리스트 업(라이브 참여자, 채팅 정지된 참여자, 차단된 참여자)을 위한 미니 메뉴 state
  const [isUserFilterMiniMenu, setIsUserFilterMiniMenu] = useState(false)

  // 라이브 참여자: live, 채팅 정지된 참여자: muted, 차단된 참여자: blocked
  const [userFilter, setUserFilter] = useState('라이브 참여자')

  const miniMenuRef = useRef<HTMLButtonElement>(null)
  const userFilterRef = useRef<HTMLDivElement>(null)

  const ApiStudio = process.env.NEXT_PUBLIC_API_BASE_URL
  const apiToken = process.env.NEXT_PUBLIC_SENDBIRD_API_TOKEN
  const currentChannelUrl = process.env.NEXT_PUBLIC_SENDBIRD_TEST_CHANNEL_ID

  const saveComponentIndex = (index: number) => {
    setSaveIndex(index)
  }

  const controlMenuSetting = () => {
    setIsUserList(true)
    setIsMoreMiniMenu(false)
    setUserFilter('라이브 참여자')
    handleUserFilterStatus('live')
  }

  const controlFreezeChat = () => {
    const body = {
      freeze: !isFreezeChat,
    }

    axios
      .put(
        `${ApiStudio}/sendbird/group_channels/${currentChannelUrl}/freeze`,
        body
      )
      .then((response) => {
        console.log('성공:', response)
        setIsFreezeChat(!isFreezeChat)
        setIsMoreMiniMenu(false)
      })
      .catch((error) => {
        console.error('실패:', error)
      })
  }

  const handleUserFilterStatus = (status: string) => {
    switch (status) {
      case 'live':
        setUserList(currentGroupChannel.members)
        setUserFilter('라이브 참여자')
        setIsUserFilterMiniMenu(false)
        break

      case 'muted':
        axios
          .get(`${ApiStudio}/sendbird/group_channels/${currentChannelUrl}/mute`)
          .then((response) => {
            const data = response.data

            setUserList(data.muted_list)
            setUserFilter('채팅 정지된 참여자')
            setIsUserFilterMiniMenu(false)
          })
          .catch((error) => {
            console.error('실패:', error)
          })
        break

      case 'blocked':
        axios
          .get(`${ApiStudio}/sendbird/users/${props.userId}/block`)
          .then((response) => {
            const data = response.data

            setUserList(data.users)
            setUserFilter('차단된 참여자')
            setIsUserFilterMiniMenu(false)
          })
          .catch((error) => {
            console.error('실패:', error)
          })
        break
    }
  }

  const openChatMonitor = () => {
    window.open('/chat-monitor', 'chat-monitor', 'width=300,height=500px')
  }

  // 더보기 미니 메뉴 outside click
  const clickModalOutside = (e) => {
    // 반응형 header menu modal (ResponsiveChatHeaderMenu)에서는 작동하지 않게 if문 처리
    if (offsetX >= 1023) {
      if (isMoreMiniMenu && !miniMenuRef.current.contains(e.target)) {
        setIsMoreMiniMenu(false)
      }

      if (isUserFilterMiniMenu && !userFilterRef.current.contains(e.target)) {
        setIsUserFilterMiniMenu(false)
      }
    }
  }

  // 더보기 미니 메뉴 outside click 처리와 responsive modal의 강제 스타일링 처리
  useEffect(() => {
    if (offsetX >= 1023) {
      document.addEventListener('mousedown', clickModalOutside)

      return () => {
        document.removeEventListener('mousedown', clickModalOutside)
      }
    } else {
      // 반응형 사이즈일 때, responsive modal이 열리면 z-index 강제 처리를 위한 로직
      setIsOpenResponsiveModal(isMoreMiniMenu || isUserFilterMiniMenu)
    }
  }, [isMoreMiniMenu, isUserFilterMiniMenu])

  useEffect(() => {
    if (currentGroupChannel) {
      // currentGroupChannel의 isFrozen 값에 따라 채팅방 freeze 상태 표현
      setIsFreezeChat(currentGroupChannel.isFrozen)

      // 현재 채팅방의 user list
      setUserList(currentGroupChannel.members)
    }
  }, [currentGroupChannel])

  // 라이브 참여자 목록 on, off에 따라 typing input을 숨기기 위한 state
  // 반응형 사이즈에서 header의 라이브 참여자 목록을 볼 때, UI height 버그를 처리하기 위해 확인하는 로직
  useEffect(() => {
    contextSetIsUserList(isUserList)
    setIsOpenResponsiveLiveMember(isUserList)
  }, [isUserList])

  return (
    <div className='CustomChatHeader'>
      {!isUserList ? (
        <div className='chat_header_wrapper'>
          <div className='chat_title_box'>실시간 채팅</div>
          <div className='chat_the_menu_box'>
            <div className='more_button_box'>
              <Image
                src='/Sendbird/more_button.svg'
                onClick={() => setIsMoreMiniMenu(!isMoreMiniMenu)}
                width={20}
                height={20}
                alt='moreButton'
              />
            </div>

            <div className='close_button_box'>
              <Image
                src='/Sendbird/responsive_close_button.svg'
                onClick={() => {
                  props.setIsChatOpen(!props.isChatOpen)
                  setIsChatOpen(false)
                }}
                width={20}
                height={20}
                alt='closeButton'
              />
            </div>

            {isMoreMiniMenu &&
              (offsetX > 1023 ? (
                <div className='more_mini_menu' ref={miniMenuRef}>
                  <div
                    className='list_in_menu'
                    onClick={() => {
                      controlMenuSetting()
                    }}
                  >
                    <Image
                      src='/Sendbird/members_icon.svg'
                      width={16}
                      height={16}
                      alt='membersIcon'
                    />
                    <span>라이브 참여자 보기</span>
                  </div>

                  {props.userRole === 'teacher' && (
                    <>
                      <div
                        className='list_in_menu'
                        onClick={() => {
                          controlFreezeChat()
                        }}
                      >
                        <Image
                          src='/Sendbird/lock_icon.svg'
                          width={16}
                          height={16}
                          alt='lockIcon'
                        />
                        {isFreezeChat ? (
                          <span>채팅창 녹이기</span>
                        ) : (
                          <span>채팅창 얼리기</span>
                        )}
                      </div>

                      <div
                        className='list_in_menu'
                        onClick={() => openChatMonitor()}
                      >
                        <Image
                          src='/Sendbird/share_chatting_icon.svg'
                          width={16}
                          height={16}
                          alt='shareIcon'
                        />
                        <span>채팅 내보내기</span>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <ResponsiveChatHeaderMenu
                  isMoreMiniMenu={isMoreMiniMenu}
                  setIsMoreMiniMenu={setIsMoreMiniMenu}
                  controlMenuSetting={controlMenuSetting}
                  isFreezeChat={isFreezeChat}
                  controlFreezeChat={controlFreezeChat}
                  userRole={props.userRole}
                />
              ))}
          </div>
        </div>
      ) : (
        <div className='chat_user_list_wrapper'>
          <div className='user_list_header_box'>
            {isUserFilterMiniMenu &&
              (offsetX > 1023 ? (
                <div className='user_filter_mini_menu_box' ref={userFilterRef}>
                  <div
                    className={`list_in_menu ${
                      userFilter === '라이브 참여자' && 'active'
                    }`}
                    onClick={() => {
                      handleUserFilterStatus('live')
                    }}
                  >
                    <span>라이브 참여자</span>
                  </div>
                  <div
                    className={`list_in_menu ${
                      userFilter === '채팅 정지된 참여자' && 'active'
                    }`}
                    onClick={() => {
                      handleUserFilterStatus('muted')
                    }}
                  >
                    <span>채팅 정지된 참여자</span>
                  </div>
                  <div
                    className={`list_in_menu ${
                      userFilter === '차단된 참여자' && 'active'
                    }`}
                    onClick={() => {
                      handleUserFilterStatus('blocked')
                    }}
                  >
                    <span>차단된 참여자</span>
                  </div>
                </div>
              ) : (
                <ResponsiveUserFilterMenu
                  userFilter={userFilter}
                  isUserFilterMiniMenu={isUserFilterMiniMenu}
                  setIsUserFilterMiniMenu={setIsUserFilterMiniMenu}
                  handleUserFilterStatus={handleUserFilterStatus}
                />
              ))}

            <div
              className='user_list_title'
              onClick={() => setIsUserFilterMiniMenu(!isUserFilterMiniMenu)}
            >
              <div className='user_filter_text'>{userFilter}</div>
              <div className='all_user_number'>
                {userList.length ? userList.length : 0}
              </div>
              <div className='list_filter_img_box'>
                {isUserFilterMiniMenu ? (
                  <Image
                    src='/Sendbird/list_down_icon.svg'
                    width={16}
                    height={16}
                    alt='listDownIcon'
                  />
                ) : (
                  <Image
                    src='/Sendbird/list_up_icon.svg'
                    width={16}
                    height={16}
                    alt='listUpIcon'
                  />
                )}
              </div>
            </div>
            <div className='cancel_button'>
              <Image
                src='/Sendbird/clear_button.svg'
                onClick={() => {
                  setIsUserList(false)
                }}
                width={20}
                height={20}
                alt='clearIcon'
              />
            </div>
          </div>

          <div className='user_list_wrapper'>
            {userList &&
              userList.map((user: any, idx: number) => (
                <UserListProfileCard
                  user={user}
                  key={idx}
                  index={idx}
                  userId={props.userId}
                  userRole={props.userRole}
                  isUserList={isUserList}
                  userFilter={userFilter}
                  isUserFilterMiniMenu={isUserFilterMiniMenu}
                  saveIndex={saveIndex}
                  setSaveIndex={setSaveIndex}
                  saveComponentIndex={saveComponentIndex}
                />
              ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default CustomChatHeader
