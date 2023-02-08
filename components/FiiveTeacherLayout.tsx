import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import { CSSProperties } from 'styled-components'

import classRoomUseStore from '../store/classRoom'
import fiiveStudioUseStore from '../store/FiiveStudio'

import Popover from '../components/VideoComponents/PopOver'

const FiiveLayout = (props: any) => {
  const { children } = props

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

  // ivs Player status 상태 표현 state
  const setIvsPlayStatus = fiiveStudioUseStore(
    (state: any) => state.setIvsPlayStatus
  )

  // 라이브 중일 때의 정보를 저장하기 위한 stream infomation state
  const streamInfoamtion = fiiveStudioUseStore(
    (state: any) => state.streamInfoamtion
  )

  // 라이브 참가자 수를 표현하기 위한 센드버드 number of actived user state
  const numberOfLiveUser = fiiveStudioUseStore(
    (state: any) => state.numberOfLiveUser
  )

  // class infomation 정보를 저장하는 state
  const classData = classRoomUseStore((state: any) => state.classData)

  // live endTime이 끝나기 전에 teacher에게 노출되는 말풍선 boolean state
  const [isLiveEndPopOver, setIsLiveEndPopOver] = useState(false)

  const liveEndBefore10Minutes = {
    title_text: '예정된 수업 시간이 다 돼가요 ⏳',
    first_sub_text: '라이브 종료 시간이 얼마 남지 않았어요.',
    second_sub_text: '수업이 끝나면 라이브 종료를 꼭 눌러주세요!',
  }

  const liveEndBefore1Minutes = {
    title_text: '수업 시간이 더 필요하신가요? ✨',
    first_sub_text: '예정된 수업 시간보다 1시간 더 할 수 있어요.',
    second_sub_text: '수업이 끝나면 라이브 종료를 꼭 눌러주세요!',
  }

  const responsiveZindexStyle: CSSProperties =
    offsetX < 1023 && isOpenResponsiveModal
      ? {
          zIndex: '-1',
        }
      : { zIndex: 'unset' }

  return (
    <div className='fiive_layout teacher_layout'>
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
              streamInfoamtion?.state === 'LIVE' && 'play'
            }`}
          >
            {streamInfoamtion?.state === 'LIVE' ? 'LIVE' : 'LIVE 중이 아님'}
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
        {/* pc 버전에서의 스타일링을 위한 empty div */}
        <div className='empty_wrapper' />

        {/* 위젯 메뉴 영역 */}
        <div className='widget_menu_wrapper'>
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
        </div>

        {/* 라이브 나가기 버튼 영역 */}
        <div className='quit_button_wrapper'>
          {/* live endTime이 끝나기 전에 teacher에게 노출되는 툴팁 */}
          {isLiveEndPopOver && (
            <Popover
              liveStatusObject={liveEndBefore10Minutes}
              setIsLiveEndPopOver={setIsLiveEndPopOver}
            />
          )}

          <Image
            src='../layouts/fiive/quit_live_icon.svg'
            onClick={() => setIvsPlayStatus('end')}
            width={22}
            height={22}
            alt='quitLiveIcon'
          />
          <span
            className='quit_button_text'
            onClick={() => setIvsPlayStatus('end')}
          >
            라이브 종료
          </span>
        </div>
      </footer>
    </div>
  )
}

export default FiiveLayout
