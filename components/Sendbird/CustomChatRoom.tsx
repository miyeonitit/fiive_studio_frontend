import React, {
  useState,
  useEffect,
  useRef,
  Dispatch,
  SetStateAction,
} from 'react'
import Image from 'next/image'
import { ToastContainer, toast, cssTransition } from 'react-toastify'

import { useChannelContext } from '@sendbird/uikit-react/Channel/context'
import useSendbirdStateContext from '@sendbird/uikit-react/useSendbirdStateContext'
import sendbirdSelectors from '@sendbird/uikit-react/sendbirdSelectors'
import DateSeparator from '@sendbird/uikit-react/ui/DateSeparator'
import ImageRenderer from '@sendbird/uikit-react/ui/ImageRenderer'

import 'animate.css'
import '../../node_modules/react-toastify/dist/ReactToastify.css'
import { config } from '../../utils/HeaderConfig'
import fiiveStudioUseStore from '../../store/FiiveStudio'

import MessageTooltip from './components/MessageTooltip'
import EmojiIcon from './components/EmojiIcon'
import EmojiContainerBox from './components/EmojiContainerBox'
import ResponsiveEmojiContainerBox from './ResponsiveComponents/ResponsiveEmojiContainerBox'
import ResponsiveHandleErrorMessage from './ResponsiveComponents/ResponsiveHandleErrorMessage'

type props = {
  message: object
  userId: string
  emojiContainer: object
}

const CustomChatRoom = (props: props) => {
  // 반응형 미디어쿼리 스타일 지정을 위한 브라우저 넓이 측정 전역 state
  const offsetX = fiiveStudioUseStore((state: any) => state.offsetX)

  const { currentGroupChannel, allMessages } = useChannelContext()
  const globalStore = useSendbirdStateContext()
  const deleteFileMessage = sendbirdSelectors.getDeleteMessage(globalStore)

  const messageInfomation = props.message?.message
  const sender = messageInfomation?.sender

  const [indexOfMessage, setIndexOfMessage] = useState(-1)

  const [reactedEmojis, setReactedEmojis] = useState(
    messageInfomation.reactions ? messageInfomation.reactions : []
  )

  const [userRole, setUserRole] = useState(
    sender?.role === 'operator' ? sender.role : 'learner'
  )

  const [allMessagesLength, setAllMessagesLength] = useState(allMessages.length)

  // 더보기 버튼과 메뉴 노출 boolean state
  const [isHoverMoreMenu, setIsHoverMoreMenu] = useState(false)
  const [isMoreMiniMenu, setIsMoreMiniMenu] = useState(false)
  const [isMiniMenuTop, setIsMiniMenuTop] = useState(false)

  // sender의 muted, blocked 여부 boolean state
  const findMutedUser = currentGroupChannel.members.find(
    (user: any) => user.userId === sender.userId
  )
  const [isMutedUser, setIsMutedUser] = useState(findMutedUser.isMuted)
  const [isBlockUser, setIsBlockUser] = useState(sender?.isBlockedByMe)

  // 이모티콘 툴팁 노출 boolean state
  const [isReactionTopTooltip, setIsReactionTopTooltip] = useState(false)
  const [isReactionBottomTooltip, setIsReactionBottomTooltip] = useState(false)

  // 이모티콘 선택 박스 노출 boolean state
  const [isReactionTopBox, setIsReactionTopBox] = useState(false)
  const [isReactionBottomBox, setIsReactionBottomBox] = useState(false)

  // 메시지 삭제 툴팁 노출 boolean state
  const [isMessageDeleteTooltip, setIsMessageDeleteTooltip] = useState(false)

  // Date Separator 노출 boolean state
  const [isDateSeparator, setIsDateSeparator] = useState(false)

  // 수정할 메시지 text value와 메시지가 수정 중에 있는지 여부 boolean state
  const [editMessageValue, setEditMessageValue] = useState('')
  const [isEditedMessage, setIsEditedMessage] = useState(false)

  // 반응형(tablet, mobile size)일 때, error message를 다시 보내거나 삭제할 수 있는 반응형 모달 on,off boolean state
  const [isResponsiveErrorMsgModal, setIsResponsiveErrorMsgModal] =
    useState(false)

  const miniMenuRef = useRef<HTMLButtonElement>(null)
  const responsiveMoreMenuRef = useRef<HTMLButtonElement>(null)
  const editInputRef = useRef<HTMLTextAreaElement>(null)
  const reactionTopRef = useRef<HTMLDivElement>(null)
  const reactionBottomRef = useRef<HTMLDivElement>(null)

  const ApiStudio = process.env.NEXT_PUBLIC_API_BASE_URL
  const apiToken = process.env.NEXT_PUBLIC_SENDBIRD_API_TOKEN
  const currentChannelUrl = process.env.NEXT_PUBLIC_SENDBIRD_TEST_CHANNEL_ID

  const fadeUp = cssTransition({
    enter: 'animate__animated animate__customFadeInUp',
    exit: 'animate__animated animate__fadeOut',
  })

  const formatDateTime = (date: number) => {
    const dateTime = new Date(date)

    const year = dateTime.getFullYear()
    const month = `0${dateTime.getMonth() + 1}`.slice(-2)
    const day = `0${dateTime.getDate()}`.slice(-2)

    return `${year}년 ${month}월 ${day}일`
  }

  const formatMessageTime = (date: number) => {
    const dateTime = new Date(date)

    const hours = Number(`0${dateTime.getHours()}`.slice(-2))
    const minutes = `0${dateTime.getMinutes()}`.slice(-2)

    if (hours < 12) {
      return `오전 ${hours < 10 ? '0' + hours.toString() : hours}:${minutes}`
    } else {
      return `오후 ${
        hours - 12 < 10 ? '0' + (hours - 12).toString() : hours
      }:${minutes}`
    }
  }

  const compareMessageDate = (date: number) => {
    const dateTime = new Date(date)

    const day = `0${dateTime.getDate()}`.slice(-2)

    return day
  }

  const clickEditedMessage = () => {
    setIsEditedMessage(true)
    setIsMoreMiniMenu(false)
  }

  const deleteMessage = () => {
    const deleteMessge = sendbirdSelectors.getDeleteMessage(globalStore)

    deleteMessge(currentGroupChannel, messageInfomation)
      .then((message) => {})
      .catch((error) => {
        console.log(error, 'error')
        alert('다시 시도해 주세요.')
      })
  }

  const resendMessage = () => {
    const resendUserMessage =
      sendbirdSelectors.getResendUserMessage(globalStore)

    resendUserMessage(currentGroupChannel, messageInfomation)
      .then((message) => {})
      .catch((error) => {
        console.log(error, 'error')
        alert('다시 시도해 주세요.')
      })
  }

  const blockUser = (senderId: string) => {
    fetch(`${ApiStudio}/users/${props.userId}/block`, {
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
            <Image
              src='/Sendbird/toast_success_icon.svg'
              width={16}
              height={16}
              alt='toastSuccessIcon'
            />
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
            <Image
              src='/Sendbird/toast_warning_icon.svg'
              width={16}
              height={16}
              alt='toastWarningIcon'
            />
            <span className='toast_error_text'>
              네트워크 문제로 차단하지 못했어요.
            </span>
          </div>,
          { transition: fadeUp }
        )
      })
  }

  const unblockUser = (senderId: string) => {
    fetch(`${ApiStudio}/users/${props.userId}/block/${senderId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json; charset=utf8',
        Accept: 'application/json',
        'Api-Token': apiToken,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('성공:', data)
        toast.success(
          <div className='toast_success_box'>
            <Image
              src='/Sendbird/toast_success_icon.svg'
              width={16}
              height={16}
              alt='toastSuccessIcon'
            />
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
            <Image
              src='/Sendbird/toast_warning_icon.svg'
              width={16}
              height={16}
              alt='toastWarningIcon'
            />
            <span className='toast_error_text'>
              네트워크 문제로 차단 해제 못했어요.
            </span>
          </div>,
          { transition: fadeUp }
        )
      })
  }

  const muteUser = (senderId: string) => {
    fetch(`${ApiStudio}/group_channels/${currentChannelUrl}/mute`, {
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
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('성공:', data)
        toast.success(
          <div className='toast_success_box'>
            <Image
              src='/Sendbird/toast_success_icon.svg'
              width={16}
              height={16}
              alt='toastSuccessIcon'
            />
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
            <Image
              src='/Sendbird/toast_warning_icon.svg'
              width={16}
              height={16}
              alt='toastWarningIcon'
            />
            <span className='toast_error_text'>
              네트워크 문제로 채팅 일시정지를 못했어요.
            </span>
          </div>,
          { transition: fadeUp }
        )
      })
  }

  const unmuteUser = (senderId: string) => {
    fetch(`${ApiStudio}/group_channels/${currentChannelUrl}/mute/${senderId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json; charset=utf8',
        Accept: 'application/json',
        'Api-Token': apiToken,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('성공:', data)
        toast.success(
          <div className='toast_success_box'>
            <Image
              src='/Sendbird/toast_success_icon.svg'
              width={16}
              height={16}
              alt='toastSuccessIcon'
            />
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
            <Image
              src='/Sendbird/toast_warning_icon.svg'
              width={16}
              height={16}
              alt='toastWarningIcon'
            />
            <span className='toast_error_text'>
              네트워크 문제로 채팅 일시정지 해제를 못했어요.
            </span>
          </div>,
          { transition: fadeUp }
        )
      })
  }

  const editMessage = () => {
    if (editMessageValue === '' || editMessageValue.length < 1) {
      toast.error(
        <div className='toast_error_box'>
          <Image
            src='/Sendbird/toast_warning_icon.svg'
            width={16}
            height={16}
            alt='toastWarningIcon'
          />
          <span className='toast_error_text'>
            수정할 메시지를 입력해 주세요.
          </span>
        </div>,
        { transition: fadeUp }
      )
      return
    }

    fetch(
      `${ApiStudio}/group_channels/${currentChannelUrl}/messages/${messageInfomation.messageId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json; charset=utf8',
          Accept: 'application/json',
          'Api-Token': apiToken,
        },
        body: JSON.stringify({
          message_type: 'MESG',
          message: editMessageValue,
        }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log('성공:', data)
      })
      .catch((error) => {
        console.error('실패:', error)
        toast.error(
          <div className='toast_error_box'>
            <Image
              src='/Sendbird/toast_warning_icon.svg'
              width={16}
              height={16}
              alt='toastWarningIcon'
            />
            <span className='toast_error_text'>
              네트워크 문제로 메시지 수정을 못했어요.
            </span>
          </div>,
          { transition: fadeUp }
        )
      })
  }

  const controlEditedInputHeightsize = () => {
    const message = editInputRef.current

    if (message) {
      message.style.height = 'auto'
      message.style.height = message.scrollHeight + 'px'
    }
  }

  const clickMiniMenu = () => {
    // 더보기 미니 메뉴 on/off state
    setIsMoreMiniMenu(!isMoreMiniMenu)

    // 메시지가 맨밑에 있을 경우와 맨밑에서 두 번째 메시지일 경우, 미니 메뉴가 더보기 버튼 위에 뜨도록 해주는 스타일링 state
    if (
      currentGroupChannel.lastMessage.messageId ===
        messageInfomation.messageId ||
      allMessages[allMessages.length - 2].messageId ===
        messageInfomation.messageId
    ) {
      setIsMiniMenuTop(true)
    }
  }

  // 더보기 미니 메뉴 outside click
  const clickModalOutside = (e) => {
    if (isMoreMiniMenu && !miniMenuRef.current.contains(e.target)) {
      setIsMoreMiniMenu(false)
    }

    if (isHoverMoreMenu && !responsiveMoreMenuRef.current.contains(e.target)) {
      setIsHoverMoreMenu(false)
    }

    // 반응형 emoji modal (ResponsiveEmojiContainerBox)에서는 작동하지 않게 if문 처리
    if (offsetX >= 1023) {
      if (isReactionTopBox && !reactionTopRef.current.contains(e.target)) {
        setIsReactionTopBox(false)
      }

      if (
        isReactionBottomBox &&
        !reactionBottomRef.current.contains(e.target)
      ) {
        setIsReactionBottomBox(false)
      }
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', clickModalOutside)

    return () => {
      document.removeEventListener('mousedown', clickModalOutside)
    }
  }, [isMoreMiniMenu, isReactionTopBox, isReactionBottomBox, isHoverMoreMenu])

  // allMessagesLength가 증가할 때마다 (로드되는 message가 많아질 때마다) Date Separator의 노출 여부 설정
  useEffect(() => {
    // allMessages에서 현재 message에 해당하는 원소값 찾기
    const currentMessageInAllMessages = allMessages.find(
      (message: any) => message.messageId === messageInfomation.messageId
    )

    // allMessages에서 현재 message의 바로 이전 message의 인덱스를 구하기
    const previousIndex = allMessages.indexOf(currentMessageInAllMessages) - 1

    // 이전 message와 현재 message의 날짜를 비교하여, 현재 message 영역에 Date Separator의 노출 여부 결정
    // 해당 chat room에서 message를 보낸 최초 날짜가 아닐 때
    if (previousIndex > 0) {
      if (
        compareMessageDate(allMessages[previousIndex].createdAt) !==
        compareMessageDate(messageInfomation.createdAt)
      ) {
        setIsDateSeparator(true)
      }
    }
  }, [allMessagesLength])

  // console.log(sender, 'sender')
  // console.log(messageInfomation, 'info')
  // console.log(emojiContainer, 'emojiContainer')
  console.log(offsetX, 'offsetX')
  // console.log(currentGroupChannel, 'currentGroupChannel')

  return (
    <div className='CustomChatRoom'>
      {isDateSeparator && (
        <DateSeparator className='date_separator'>
          {formatDateTime(messageInfomation.createdAt)}
        </DateSeparator>
      )}

      <div
        className={`message_wrapper ${isEditedMessage && 'edit'}`}
        onClick={() =>
          offsetX < 1023 &&
          (messageInfomation.sendingStatus === 'failed'
            ? setIsResponsiveErrorMsgModal(true)
            : setIsHoverMoreMenu(!isHoverMoreMenu))
        }
        onMouseOver={() => offsetX >= 1023 && setIsHoverMoreMenu(true)}
        onMouseOut={() => offsetX >= 1023 && setIsHoverMoreMenu(false)}
      >
        {messageInfomation.type === 'image/png' ? (
          <div className='Message_file'>
            <button
              className='custom-file-message__delete-button'
              onClick={() =>
                deleteFileMessage(currentGroupChannel, messageInfomation)
              }
            >
              delete button
            </button>
            <ImageRenderer
              className='sendbird-quote-message__replied-message__thumbnail-message__image'
              url={messageInfomation.plainUrl}
              width='144px'
              height='108px'
              alt='sendbird-quote-message__replied-message__thumbnail-message__image'
            />
            {/* <img src={messageInfomation.plainUrl} alt='custom-file-message' /> */}
          </div>
        ) : (
          <>
            {offsetX >= 1023 && isReactionTopTooltip && (
              <MessageTooltip
                topHeight='-60'
                rightWidth='18'
                tooltipText={
                  messageInfomation.sendingStatus === 'succeeded'
                    ? '반응 추가하기'
                    : '다시 보내기'
                }
              />
            )}

            {offsetX >= 1023 && isMessageDeleteTooltip && (
              <MessageTooltip
                topHeight='-60'
                rightWidth='5'
                tooltipText='삭제'
              />
            )}

            {!isEditedMessage &&
              isHoverMoreMenu &&
              (messageInfomation.sendingStatus === 'succeeded' ? (
                <div
                  className={`Message_more_menu_box ${
                    isReactionTopBox || (isMoreMiniMenu && 'active')
                  }`}
                  ref={responsiveMoreMenuRef}
                >
                  <div
                    className={`reaction_emoji_button ${
                      isReactionTopBox && 'active'
                    }`}
                    onClick={() => setIsReactionTopBox(!isReactionTopBox)}
                    onMouseOver={() => setIsReactionTopTooltip(true)}
                    onMouseOut={() => setIsReactionTopTooltip(false)}
                  >
                    <Image
                      src='/Sendbird/add_reaction_emoji.svg'
                      width={16}
                      height={16}
                      alt='reactionButton'
                    />
                  </div>
                  <div className={`more_button ${isMoreMiniMenu && 'active'}`}>
                    <Image
                      src='/Sendbird/more_button.svg'
                      onClick={() => clickMiniMenu()}
                      width={16}
                      height={16}
                      alt='moreButton'
                    />
                  </div>
                </div>
              ) : sender.userId === props.userId ? (
                <div className='Message_more_menu_box'>
                  <div
                    className='reaction_emoji_button'
                    onMouseOver={() => setIsReactionTopTooltip(true)}
                    onMouseOut={() => setIsReactionTopTooltip(false)}
                  >
                    <Image
                      src='/Sendbird/retry_button.svg'
                      onClick={() => resendMessage()}
                      width={16}
                      height={16}
                      alt='retryButton'
                    />
                  </div>
                  <div
                    className='more_button'
                    onMouseOver={() => setIsMessageDeleteTooltip(true)}
                    onMouseOut={() => setIsMessageDeleteTooltip(false)}
                  >
                    <Image
                      src='/Sendbird/clear_button.svg'
                      onClick={() => deleteMessage()}
                      width={16}
                      height={16}
                      alt='clearButton'
                    />
                  </div>
                </div>
              ) : (
                <></>
              ))}

            {/* emoji contaioner box */}
            {/* pc 버전일 때는 EmojiContainerBox를, tablet과 mobile 버전일 때는 ResponsiveEmojiContainerBox 모달을 띄움 */}
            {isReactionTopBox &&
              (offsetX > 1023 ? (
                <EmojiContainerBox
                  userId={props.userId}
                  topHeight='-55'
                  rightWidth='12'
                  refName='top'
                  reactedEmojis={reactedEmojis}
                  reactionTopRef={reactionTopRef}
                  emojiContainer={props.emojiContainer}
                  setIsReactionBox={setIsReactionTopBox}
                  messageInfomation={messageInfomation}
                />
              ) : (
                <ResponsiveEmojiContainerBox
                  userId={props.userId}
                  emojiContainer={props.emojiContainer}
                  isReactionBox={isReactionTopBox}
                  setIsReactionBox={setIsReactionTopBox}
                  messageInfomation={messageInfomation}
                  reactedEmojis={reactedEmojis}
                />
              ))}

            {/* 더보기 버튼의 미니 메뉴 */}
            {isMoreMiniMenu &&
              (props.userId === sender.userId ? (
                <div
                  className={`more_mini_menu_wrapper ${
                    isMiniMenuTop && (offsetX < 1023 ? 'responsive_top' : 'top')
                  }`}
                  ref={miniMenuRef}
                >
                  <div className='more_mini_menu'>
                    <div
                      className='list_in_menu'
                      onClick={() => {
                        clickEditedMessage()
                      }}
                    >
                      <Image
                        src='/Sendbird/edit_icon.svg'
                        width={16}
                        height={16}
                        alt='editIcon'
                      />
                      <span>메시지 수정</span>
                    </div>

                    <div
                      className='list_in_menu'
                      onClick={() => deleteMessage()}
                    >
                      <Image
                        src='/Sendbird/delete_button.svg'
                        width={16}
                        height={16}
                        alt='deleteButton'
                      />
                      <span className='delete_message'>메시지 삭제</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className={`more_mini_menu_wrapper ${
                    isMiniMenuTop && (offsetX < 1023 ? 'responsive_top' : 'top')
                  }`}
                  ref={miniMenuRef}
                >
                  <div className='more_mini_menu'>
                    {userRole !== 'learner' &&
                      (isMutedUser ? (
                        <div
                          className='list_in_menu'
                          onClick={() => {
                            unmuteUser(sender.userId)
                          }}
                        >
                          <Image
                            src='/Sendbird/mute_outlined.svg'
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
                            muteUser(sender.userId)
                          }}
                        >
                          <Image
                            src='/Sendbird/mute_outlined.svg'
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
                        onClick={() => unblockUser(sender.userId)}
                      >
                        <Image
                          src='/Sendbird/learner_uncert.svg'
                          width={16}
                          height={16}
                          alt='blockButton'
                        />
                        <span>메시지 차단 해제</span>
                      </div>
                    ) : (
                      <div
                        className='list_in_menu'
                        onClick={() => blockUser(sender.userId)}
                      >
                        <Image
                          src='/Sendbird/learner_uncert.svg'
                          width={16}
                          height={16}
                          alt='blockButton'
                        />
                        <span>메시지 차단</span>
                      </div>
                    )}

                    {userRole !== 'learner' && (
                      <div
                        className='list_in_menu'
                        onClick={() => deleteMessage()}
                      >
                        <Image
                          src='/Sendbird/delete_button.svg'
                          width={16}
                          height={16}
                          alt='deleteButton'
                        />
                        <span className='delete_message'>메시지 삭제</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}

            <div className='Message_text'>
              <div className='user_infomation_box'>
                <div className='user_profile_image_box'>
                  <Image
                    className='defaultProfileImage'
                    src={
                      sender.plainProfileUrl
                        ? sender.plainProfileUrl
                        : '/Sendbird/Ellipse 8stateBadge.svg'
                    }
                    width={24}
                    height={24}
                    alt='defaultProfileImage'
                  />
                </div>

                <div
                  className={`user_nickname_box ${
                    sender.role === 'operator' && 'teacher'
                  }`}
                >
                  {sender.userId}
                </div>

                <div className='massage_date_time'>
                  {formatMessageTime(messageInfomation.createdAt)}
                </div>
              </div>

              {isEditedMessage ? (
                <div className='edited_message_box'>
                  <textarea
                    className='edit_message_input'
                    ref={editInputRef}
                    onChange={(e) => setEditMessageValue(e.target.value)}
                    onKeyDown={() => controlEditedInputHeightsize()}
                    placeholder='수정할 메시지 입력하기'
                  />
                  <div className='edited_button_box'>
                    <button
                      className='cancel_edit_button'
                      onClick={() => setIsEditedMessage(false)}
                    >
                      취소
                    </button>
                    <button
                      className='save_edit_button'
                      onClick={() => editMessage()}
                    >
                      저장
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  className={`text_message_box ${
                    (messageInfomation.sendingStatus !== 'succeeded' ||
                      isBlockUser) &&
                    'fail'
                  }`}
                >
                  <span className='message_text_value_box'>
                    {isBlockUser
                      ? '[메시지를 차단했어요]'
                      : messageInfomation.message
                          .split('\n')
                          .map((text: string, idx: number) => (
                            <span className='text_value' key={idx}>
                              {text}
                              <br />
                            </span>
                          ))}
                  </span>
                  {messageInfomation.data !== messageInfomation.message &&
                    messageInfomation.updatedAt !== 0 &&
                    !isBlockUser && (
                      <span className='edited_message_status'>(수정됨)</span>
                    )}
                </div>
              )}

              {messageInfomation.sendingStatus === 'failed' && (
                <div className='message_sending_status'>
                  <Image
                    src='/Sendbird/warning_icon.svg'
                    width={12}
                    height={12}
                    alt='warningIcon'
                  />
                  <span className='warning_text'>
                    메시지를 보내지 못했어요.
                  </span>
                </div>
              )}

              {/* reaction emoji 노출 영역 */}
              {reactedEmojis.length >= 1 && (
                <>
                  <div
                    className={`reaction_emoji_wrapper ${
                      isEditedMessage && 'edit'
                    }`}
                  >
                    {reactedEmojis.map((emoji: any, idx: number) => (
                      <EmojiIcon
                        key={idx + emoji.key}
                        emoji={emoji}
                        userId={props.userId}
                        reactedEmojis={reactedEmojis}
                        emojiContainer={props.emojiContainer}
                        messageInfomation={messageInfomation}
                      />
                    ))}
                    <div
                      className='reactions_item add_emoji'
                      onClick={() =>
                        setIsReactionBottomBox(!isReactionBottomBox)
                      }
                      onMouseOver={() => setIsReactionBottomTooltip(true)}
                      onMouseOut={() => setIsReactionBottomTooltip(false)}
                    >
                      {offsetX >= 1023 && isReactionBottomTooltip && (
                        <MessageTooltip
                          topHeight='-52'
                          rightWidth='-26'
                          width='90'
                          tooltipText='반응 추가하기'
                        />
                      )}

                      <Image
                        src='/Sendbird/add_reaction_emoji_bottom.svg'
                        onClick={() =>
                          setIsReactionBottomBox(!isReactionBottomBox)
                        }
                        width={18}
                        height={18}
                        alt='reactionBottomButton'
                      />
                    </div>
                  </div>

                  {/* pc 버전일 때는 EmojiContainerBox를, tablet과 mobile 버전일 때는 ResponsiveEmojiContainerBox 모달을 띄움 */}
                  {isReactionBottomBox &&
                    (offsetX > 1023 ? (
                      <EmojiContainerBox
                        userId={props.userId}
                        topHeight='12'
                        rightWidth='20'
                        refName='bottom'
                        reactedEmojis={reactedEmojis}
                        reactionBottomRef={reactionBottomRef}
                        emojiContainer={props.emojiContainer}
                        setIsReactionBox={setIsReactionBottomBox}
                        messageInfomation={messageInfomation}
                      />
                    ) : (
                      <ResponsiveEmojiContainerBox
                        userId={props.userId}
                        emojiContainer={props.emojiContainer}
                        isReactionBox={isReactionBottomBox}
                        setIsReactionBox={setIsReactionBottomBox}
                        messageInfomation={messageInfomation}
                        reactedEmojis={reactedEmojis}
                      />
                    ))}
                </>
              )}

              {/* tablet과 mobile 버전일 때는 ResponsiveHandleErrorMessage 모달을 띄움 */}
              {offsetX < 1023 && isResponsiveErrorMsgModal && (
                <ResponsiveHandleErrorMessage
                  messageInfomation={messageInfomation}
                  isResponsiveErrorMsgModal={isResponsiveErrorMsgModal}
                  setIsResponsiveErrorMsgModal={setIsResponsiveErrorMsgModal}
                />
              )}

              <ToastContainer
                position={offsetX > 1023 ? 'bottom-right' : 'bottom-center'}
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
          </>
        )}
      </div>
    </div>
  )
}

export default CustomChatRoom
