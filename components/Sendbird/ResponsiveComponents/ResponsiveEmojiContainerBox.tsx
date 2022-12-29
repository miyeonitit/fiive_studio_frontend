import React, {
  useState,
  useEffect,
  useRef,
  Dispatch,
  SetStateAction,
} from 'react'
import Image from 'next/image'

type props = {
  userId: string
  emojiContainer: Array<any>
  isReactionBox: boolean
  setIsReactionBox: Dispatch<SetStateAction<boolean>>
  messageInfomation: any
  reactedEmojis: Array<any>
}

const ResponsiveEmojiContainerBox = (props: props) => {
  // modal을 닫을 때, 애니메이션 효과와 setTimeout을 하기 위한 boolean state
  const [isCloseModal, setIsCloseModal] = useState(false)

  const emojiModalRef = useRef<HTMLDivElement>(null)

  const appId = process.env.NEXT_PUBLIC_SENDBIRD_APP_ID
  const apiToken = process.env.NEXT_PUBLIC_SENDBIRD_API_TOKEN
  const channel_url = process.env.NEXT_PUBLIC_SENDBIRD_TEST_CHANNEL_ID
  const message_id = props.messageInfomation.messageId

  const addUserReaction = (emojiKey: string) => {
    // 해당 메시지에 유저가 선택한 리액션 이모지가 이미 있을 경우, 이모지 제거
    const findAlreadyReactedEmoji = props.reactedEmojis.find(
      (emoji: any) => emoji.key === emojiKey
    )

    // 해당 메시지에 유저가 선택한 리액션 이모지가 이미 있을 경우
    if (
      findAlreadyReactedEmoji &&
      findAlreadyReactedEmoji.userIds.includes(props.userId)
    ) {
      removeUserReaction(findAlreadyReactedEmoji.key)
      return
    }
    // 해당 메시지에 유저가 선택한 리액션 이모지가 없을 경우
    else {
      fetch(
        `https://api-${appId}.sendbird.com/v3/group_channels/${channel_url}/messages/${message_id}/reactions`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json; charset=utf8',
            Accept: 'application/json',
            'Api-Token': apiToken,
          },
          body: JSON.stringify({
            user_id: props.userId,
            reaction: emojiKey,
          }),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          console.log('성공:', data)
        })
        .catch((error) => {
          console.error('실패:', error)
        })
    }
  }

  const removeUserReaction = (emojiKey: string) => {
    fetch(
      `https://api-${appId}.sendbird.com/v3/group_channels/${channel_url}/messages/${message_id}/reactions?user_id=${props.userId}&reaction=${emojiKey}`,
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
      })
      .catch((error) => {
        console.error('실패:', error)
      })
  }

  const closeModal = () => {
    setIsCloseModal(true)

    // 400초가 지나면 modal close 처리
    let timer = setTimeout(() => props.setIsReactionBox(false), 400)

    // setTimeout의 cleanUp 처리
    clearSetTimeOut(timer)
  }

  const clearSetTimeOut = (countTimer: any) => {
    return () => {
      clearTimeout(countTimer)
    }
  }

  const clickModalOutside = (e) => {
    if (props.isReactionBox && !emojiModalRef.current.contains(e.target)) {
      closeModal()
    }
  }

  // 반응형 모달 outside click
  useEffect(() => {
    document.addEventListener('mousedown', clickModalOutside)

    return () => {
      document.removeEventListener('mousedown', clickModalOutside)
    }
  }, [props.isReactionBox])

  return (
    <div className='ResponsiveEmojiContainerBox'>
      {/* non_active 일 때 close modal animation 실행 */}
      <div
        className={
          !isCloseModal
            ? 'emojis_container_wrapper'
            : 'emojis_container_wrapper non_active'
        }
        ref={emojiModalRef}
      >
        <div className='responsive_modal_title'>
          <div className='add_reaction_title_text'>반응 추가하기</div>
          <div className='close_modal_image_box' onClick={() => closeModal()}>
            <Image
              src='/Sendbird/responsive_close_button.svg'
              width={20}
              height={20}
              alt='closeButton'
            />
          </div>
        </div>

        <div className='responsive_modal_container'>
          <div className='emoji_outer_box'>
            {props.emojiContainer.map((emoji: any) => (
              <div
                className='emoji_inner_box'
                key={emoji.key}
                onClick={() => addUserReaction(emoji.key)}
              >
                <img src={emoji.url} alt={emoji.key} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResponsiveEmojiContainerBox
