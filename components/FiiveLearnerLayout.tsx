import React, { useEffect, useState } from 'react'
import Image from 'next/image'

import fiiveStudioUseStore from '../store/FiiveStudio'
import ChannelService from '../utils/ChannelService'

const FiiveLayout = (props: any) => {
  const { children } = props

  // channelTalk open <> close toggle boolean state
  const [isOpenChannelTalk, setIsOpenChannelTalk] = useState(false)

  // 반응형 미디어쿼리 스타일 지정을 위한 브라우저 넓이 측정 전역 state
  const offsetX = fiiveStudioUseStore((state: any) => state.offsetX)

  // sendbird Chat open <> close 동작을 위한 toggle boolean state
  const isChatOpen = fiiveStudioUseStore((state: any) => state.isChatOpen)
  const setIsChatOpen = fiiveStudioUseStore((state: any) => state.setIsChatOpen)

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
                src='../layouts/fiive/Avatar.svg'
                width={32}
                height={32}
                alt='teacherProfileImage'
              />
            </div>

            <div className='teacher_name_box'>미친국어T</div>
          </div>
        </div>

        <div className='right_header_box'>
          {/* LIVE 상태 정보 영역 */}
          <div className='live_status'>LIVE 준비 중</div>

          {/* 현재 라이브 참여자 수 영역 */}
          <div className='live_participant_number_box'>
            <Image
              src='../layouts/fiive/live_participant.svg'
              width={12}
              height={12}
              alt='liveParticipant'
            />
            <span className='live_participant_number'>2</span>
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

      <footer className='layout-footer'>
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
          <div
            className='live_chat_box'
            onClick={() => setIsChatOpen(!isChatOpen)}
          >
            <Image
              src={
                isChatOpen
                  ? '../layouts/fiive/chat_icon_active.svg'
                  : '../layouts/fiive/chat_icon.svg'
              }
              width={22}
              height={22}
              alt='chatIcon'
            />
            <span className={`chat_button_text ${isChatOpen && 'active'}`}>
              실시간 채팅
            </span>
          </div>

          <div className='live_reaction_box'>
            <Image
              src='../layouts/fiive/reaction_icon.svg'
              width={22}
              height={22}
              alt='reactionIcon'
            />
            <span className='reaction_button_text'>리액션</span>
          </div>
        </div>

        {/* 라이브 나가기 버튼 영역 */}
        <div className='quit_button_wrapper'>
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
