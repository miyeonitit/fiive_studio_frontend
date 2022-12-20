import React, {
  useState,
  useEffect,
  useRef,
  Dispatch,
  SetStateAction,
} from 'react'
import Image from 'next/image'

import { useChannelContext } from '@sendbird/uikit-react/Channel/context'

import UserListProfileCard from './components/UserListProfileCard'
import useStore from '../../store/Sendbird'

type props = {
  userId: string
  userRole: string
  isCloseChat: boolean
  setIsCloseChat: Dispatch<SetStateAction<boolean>>
}

const CustomChatHeader = (props: props) => {
  const contextSetIsUserList = useStore((state: any) => state.setIsUserList)

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

  const appId = process.env.NEXT_PUBLIC_SENDBIRD_APP_ID
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
    fetch(
      `https://api-${appId}.sendbird.com/v3/group_channels/${currentChannelUrl}/freeze`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json; charset=utf8',
          Accept: 'application/json',
          'Api-Token': apiToken,
        },
        body: JSON.stringify({
          freeze: !isFreezeChat,
        }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log('성공:', data)
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
        return
      case 'muted':
        fetch(
          `https://api-${appId}.sendbird.com/v3/group_channels/${currentChannelUrl}/mute`,
          {
            method: 'GET',
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
            setUserList(data.muted_list)
            setUserFilter('채팅 정지된 참여자')
            setIsUserFilterMiniMenu(false)
          })
          .catch((error) => {
            console.error('실패:', error)
          })
        return
      case 'blocked':
        fetch(
          `https://api-${appId}.sendbird.com/v3/users/${props.userId}/block`,
          {
            method: 'GET',
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
            setUserList(data.users)
            setUserFilter('차단된 참여자')
            setIsUserFilterMiniMenu(false)
          })
          .catch((error) => {
            console.error('실패:', error)
          })
        return
    }
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

  useEffect(() => {
    if (currentGroupChannel) {
      // currentGroupChannel의 isFrozen 값에 따라 채팅방 freeze 상태 표현
      setIsFreezeChat(currentGroupChannel.isFrozen)

      // 현재 채팅방의 user list
      setUserList(currentGroupChannel.members)
    }
  }, [currentGroupChannel])

  // 라이브 참여자 목록 on, off에 따라 typing input을 숨기기 위한 state
  useEffect(() => {
    contextSetIsUserList(isUserList)
  }, [isUserList])

  return (
    <div className='CustomChatHeader'>
      {!isUserList ? (
        <div className='chat_header_wrapper'>
          <div className='control_chat_size_box'>
            <Image
              src='/move_right.svg'
              onClick={() => props.setIsCloseChat(!props.isCloseChat)}
              width={20}
              height={20}
              alt='chatCloseIcon'
            />
          </div>
          <div className='chat_title_box'>라이브 채팅</div>
          <div className='chat_the_more_box'>
            <Image
              src='/more_button.svg'
              onClick={() => setIsMoreMiniMenu(!isMoreMiniMenu)}
              width={20}
              height={20}
              alt='moreButton'
            />

            {isMoreMiniMenu && (
              <div className='more_mini_menu' ref={miniMenuRef}>
                <div
                  className='list_in_menu'
                  onClick={() => {
                    controlMenuSetting()
                  }}
                >
                  <Image
                    src='/members_icon.svg'
                    width={16}
                    height={16}
                    alt='membersIcon'
                  />
                  <span>라이브 참여자 보기</span>
                </div>
                {isFreezeChat ? (
                  <div
                    className='list_in_menu'
                    onClick={() => {
                      controlFreezeChat()
                    }}
                  >
                    <Image
                      src='/lock_icon.svg'
                      width={16}
                      height={16}
                      alt='lockIcon'
                    />
                    <span>채팅창 녹이기</span>
                  </div>
                ) : (
                  <div
                    className='list_in_menu'
                    onClick={() => {
                      controlFreezeChat()
                    }}
                  >
                    <Image
                      src='/lock_icon.svg'
                      width={16}
                      height={16}
                      alt='lockIcon'
                    />
                    <span>채팅창 얼리기</span>
                  </div>
                )}

                <div
                  className='list_in_menu'
                  // onClick={() => {
                  //   unmuteUser(sender.userId)
                  // }}
                >
                  <Image
                    src='/share_chatting_icon.svg'
                    width={16}
                    height={16}
                    alt='shareIcon'
                  />
                  <span>채팅 내보내기</span>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className='chat_user_list_wrapper'>
          <div className='user_list_header_box'>
            {isUserFilterMiniMenu && (
              <div className='user_filter_mini_menu_box'>
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
            )}

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
                    src='/list_down_icon.svg'
                    width={16}
                    height={16}
                    alt='listDownIcon'
                  />
                ) : (
                  <Image
                    src='/list_up_icon.svg'
                    width={16}
                    height={16}
                    alt='listUpIcon'
                  />
                )}
              </div>
            </div>
            <div className='cancel_button'>
              <Image
                src='/clear_button.svg'
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
