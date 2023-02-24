import React, { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import { CSSProperties } from 'styled-components'

import classRoomUseStore from '../store/classRoom'
import fiiveStudioUseStore from '../store/FiiveStudio'
import ChannelService from '../utils/ChannelService'

import MetaReactionEmojiList from './Metadata/MetaReactionEmojiList'

const FiiveLayout = (props: any) => {
  const { children } = props

  // channelTalk open <> close toggle boolean state
  const [isOpenChannelTalk, setIsOpenChannelTalk] = useState(false)

  // metadata emoji list open <> close toggle boolean state
  const [isOpenEmojiList, setIsOpenEmojiList] = useState(false)

  // live 방송 시작 전, 대기 중일 때 popover on/off boolean state
  const [isOffReactionPopOver, setIsOffReactionPopOver] = useState(false)

  // 반응형 미디어쿼리 스타일 지정을 위한 브라우저 넓이 측정 전역 state
  const offsetX = fiiveStudioUseStore((state: any) => state.offsetX)

  // 반응형 전용 모달이 활성화 된 상태인지 확인하는 boolean state
  const isOpenResponsiveModal = fiiveStudioUseStore(
    (state: any) => state.isOpenResponsiveModal
  )

  // sendbird Chat open <> close 동작을 위한 toggle boolean state
  const isChatOpen = fiiveStudioUseStore((state: any) => state.isChatOpen)
  const setIsChatOpen = fiiveStudioUseStore((state: any) => state.setIsChatOpen)

  // waiting: 라이브 전 재생 대기중 <> play: 재생중 <> end: 라이브 종료 <> error : 재생 에러
  const ivsPlayStatus = fiiveStudioUseStore((state: any) => state.ivsPlayStatus)

  // 라이브 중일 때의 정보를 저장하기 위한 stream infomation state
  const streamInfomation = fiiveStudioUseStore(
    (state: any) => state.streamInfomation
  )

  // 라이브 참가자 수를 표현하기 위한 센드버드 number of actived user state
  const numberOfLiveUser = fiiveStudioUseStore(
    (state: any) => state.numberOfLiveUser
  )

  // class infomation 정보를 저장하는 state
  const classData = classRoomUseStore((state: any) => state.classData)

  // now local time
  const nowTime = fiiveStudioUseStore((state: any) => state.nowTime)

  const emojiListRef = React.useRef() as React.MutableRefObject<HTMLDivElement>

  const responsiveZindexStyle: CSSProperties =
    offsetX < 1023 && isOpenResponsiveModal
      ? {
          zIndex: '-1',
        }
      : { zIndex: 'unset' }

  const closeBrowser = () => {
    window.open('about:blank', '_self').close()
  }

  // channelTalk open <> close toggle
  const clickChannelTalk = () => {
    if (!isOpenChannelTalk) {
      ChannelIO('show')
      setIsOpenChannelTalk(true)

      // default direction인 right에서 left로 설정
      const ChannelTalkDirection = document.getElementById('ch-plugin-script')

      ChannelTalkDirection?.classList.remove('rightPosition')
      ChannelTalkDirection?.classList.add('leftPosition')
    } else {
      ChannelIO('hide')
      setIsOpenChannelTalk(false)
    }
  }

  // 더보기 미니 메뉴 outside click
  const clickModalOutside = (e) => {
    // 실시간 채팅, 리액션 버튼은 outside click 제외
    if (
      e.target.classList[0] === 'chat_icon' ||
      e.target.classList[0] === 'reaction_icon' ||
      e.target.classList[0] === 'live_reaction_box' ||
      e.target.parentNode.classList[0] === 'live_reaction_box' ||
      e.target.classList[0] === 'live_chat_box' ||
      e.target.parentNode.classList[0] === 'live_chat_box'
    ) {
      return
    }

    if (isOpenEmojiList && !emojiListRef.current.contains(e.target)) {
      setIsOpenEmojiList(false)
    }
  }

  // 더보기 미니 메뉴 outside click
  useEffect(() => {
    document.addEventListener('mousedown', clickModalOutside)

    return () => {
      document.removeEventListener('mousedown', clickModalOutside)
    }
  }, [isOpenEmojiList])

  // 페이지 초기 로드시, channelTalk booting
  useEffect(() => {
    ChannelService.boot({
      pluginKey: process.env.NEXT_PUBLIC_CHANNELTALK_PLUGIN_KEY,
      customLauncherSelector: '.help_button_wrapper',
      hideChannelButtonOnBoot: true,
    })
  }, [])

  return (
    <div className='fiive_layout learner_layout'>
      <header className='layout_header'>
        <div className='left_header_box'>
          {offsetX < 1023 ? (
            <div className='back_button_box'>
              <Image
                src='../layouts/fiive/arrow_back.svg'
                width={20}
                height={20}
                alt='backButton'
              />
            </div>
          ) : (
            <>
              {/* fiive logo image 영역 */}
              <div className='fiive_logo_box'>
                <Image
                  src='../layouts/fiive/logo.svg'
                  width={50}
                  height={30}
                  alt='fiiveLogoImage'
                />
              </div>

              {/* logo image 영역과 class 정보를 구별하는 devider 영역 */}
              <div className='devider_box'>
                <Image
                  src='../layouts/fiive/gray_bar.svg'
                  width={1}
                  height={24}
                  alt='devider'
                />
              </div>
            </>
          )}

          {/* class 정보 영역 */}
          <div className='fiive_class_infomation_box'>
            <div className='teacher_profile_image_box'>
              <Image
                src={
                  classData?.teacher_thumbnail
                    ? classData?.teacher_thumbnail
                    : '../layouts/fiive/Avatar.svg'
                }
                width={32}
                height={32}
                alt='teacherProfileImage'
              />
            </div>

            <div className='teacher_name_box'>{classData?.teacher_name}</div>
          </div>
        </div>

        <div className='right_header_box'>
          {/* LIVE 상태 정보 영역 */}
          <div
            className={`live_status ${
              streamInfomation?.state === 'LIVE' && 'play'
            }`}
          >
            {streamInfomation?.state === 'LIVE' ? 'LIVE' : 'LIVE 중이 아님'}
          </div>

          {/* 현재 라이브 참여자 수 영역 */}
          <div className='live_participant_number_box'>
            <Image
              src='../layouts/fiive/live_participant.svg'
              width={12}
              height={12}
              alt='liveParticipant'
            />
            <span className='live_participant_number'>{numberOfLiveUser}</span>
          </div>
        </div>

        {/* 
        <div className='controls'>
          <button type='button' className='notifications'>
            <img
              src='/layouts/fiive/notifications_outlined.svg'
              alt='Notifications'
            />

            <span className='count'>99+</span>
          </button>

          <button type='button' className='account'>
            <img
              src='/layouts/fiive/Avatar.svg'
              alt='Profile'
              className='profile'
            />
            <img
              src='/layouts/fiive/chevron_down_btn.svg'
              alt='Expand'
              className='expand'
            />
          </button>
        </div> */}
      </header>

      <div className='layout-body'>{children}</div>

      <footer className='layout-footer' style={responsiveZindexStyle}>
        {/* 문의하기 영역 */}
        {offsetX >= 1023 && (
          <div
            className='help_button_wrapper'
            id='test'
            onClick={() => clickChannelTalk()}
          >
            <Image
              src='../layouts/fiive/help_question_icon.svg'
              width={22}
              height={22}
              alt='helpQuestionIcon'
            />
            <span className='help_button_text'>문의하기</span>
          </div>
        )}

        {/* 위젯 메뉴 영역 */}
        <div className='widget_menu_wrapper'>
          {/* metadata reaction emoji list */}
          {isOpenEmojiList && (
            <MetaReactionEmojiList
              emojiListRef={emojiListRef}
              setIsOpenEmojiList={setIsOpenEmojiList}
            />
          )}

          {/* live 방송 시작 전, 대기 중일 때 popover으로 emoji 전송이 되지 않음을 안내 */}
          {nowTime < classData?.start_date &&
            (ivsPlayStatus === 'waiting' || ivsPlayStatus === 'error') && (
              <div
                className={`live_waiting_reaction_popover ${
                  isOffReactionPopOver && 'non_active'
                }`}
              >
                <div className='popover_title_box'>
                  <div className='popover_title_text_box'>
                    채팅보다 빠른 리액션 👏
                  </div>
                  <div className='popover_close_box'>
                    <Image
                      src='../layouts/fiive/popover_close_button.svg'
                      onClick={() => setIsOffReactionPopOver(true)}
                      width={12}
                      height={12}
                      alt='closeButton'
                    />
                  </div>
                </div>

                <div className='popover_sub_text_box'>
                  수업이 시작되면 이모지 리액션으로
                  <br />
                  다같이 선생님과 인사해볼까요?
                </div>
              </div>
            )}

          <div
            className='live_chat_box'
            onClick={() => setIsChatOpen(!isChatOpen)}
          >
            <Image
              className='chat_icon'
              src={
                ivsPlayStatus !== 'end'
                  ? isChatOpen
                    ? '../layouts/fiive/chat_icon_active.svg'
                    : '../layouts/fiive/chat_icon.svg'
                  : '../layouts/fiive/chat_icon.svg'
              }
              width={22}
              height={22}
              alt='chatIcon'
            />
            <span
              className={`chat_button_text ${
                ivsPlayStatus !== 'end' && isChatOpen && 'active'
              }`}
            >
              실시간 채팅
            </span>
          </div>

          <div
            className='live_reaction_box'
            onClick={() =>
              ivsPlayStatus === 'play'
                ? setIsOpenEmojiList(!isOpenEmojiList)
                : setIsOpenEmojiList(false)
            }
          >
            <Image
              className='reaction_icon'
              src={
                ivsPlayStatus === 'play'
                  ? isOpenEmojiList
                    ? '../layouts/fiive/reaction_icon_active.svg'
                    : '../layouts/fiive/reaction_icon.svg'
                  : '../layouts/fiive/reaction_icon_non_active.svg'
              }
              width={22}
              height={22}
              alt='reactionIcon'
            />
            <span
              className={`reaction_button_text ${
                ivsPlayStatus === 'play'
                  ? isOpenEmojiList && 'active'
                  : 'non_active'
              }`}
            >
              리액션
            </span>
          </div>
        </div>

        {/* 라이브 나가기 버튼 영역 */}
        <div className='quit_button_wrapper' onClick={() => closeBrowser()}>
          <Image
            src='../layouts/fiive/quit_live_icon.svg'
            width={22}
            height={22}
            alt='quitLiveIcon'
          />
          <span className='quit_button_text'>라이브 나가기</span>
        </div>
      </footer>
    </div>
  )
}

export default FiiveLayout
