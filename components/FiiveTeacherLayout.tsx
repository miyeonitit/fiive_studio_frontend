import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { CSSProperties } from 'styled-components'

import AxiosRequest from '../utils/AxiosRequest'
import ClassRoomUseStore from '../store/ClassRoom'
import fiiveStudioUseStore from '../store/FiiveStudio'

import Popover from '../components/VideoComponents/PopOver'

const FiiveLayout = (props: any) => {
  const router = useRouter()

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
  const streamInfomation = fiiveStudioUseStore(
    (state: any) => state.streamInfomation
  )

  // 라이브 참가자 수를 표현하기 위한 센드버드 number of actived user state
  const numberOfLiveUser = fiiveStudioUseStore(
    (state: any) => state.numberOfLiveUser
  )

  // update now local time
  const nowTime = fiiveStudioUseStore((state: any) => state.nowTime)

  // user auth token for API
  const authToken = fiiveStudioUseStore((state: any) => state.authToken)

  // 반응형 미디어쿼리 스타일 지정을 위한 video player height 측정 전역 state
  const setVideoStatusScreenHeight = fiiveStudioUseStore(
    (state: any) => state.setVideoStatusScreenHeight
  )

  // class infomation 정보를 저장하는 state
  const classData = ClassRoomUseStore((state: any) => state.classData)

  // sendbird infomation 정보를 저장하는 state
  const chatData = ClassRoomUseStore((state: any) => state.chatData)
  const setChatData = ClassRoomUseStore((state: any) => state.setChatData)

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

  // 라이브 종료 시간으로부터 현재 시간이 몇 분 남았는지 계산하는 메서드
  const getBeforeMinutesEndTime = (endTime: number) => {
    let gap = endTime - nowTime.getTime()
    let minutes = Math.ceil(gap / 1000 / 60)

    return minutes
  }

  // teacher의 수업 라이브 종료 버튼 클릭시, IVS streamkey 파기 및 sendbird chat freezing
  const endLiveClass = async () => {
    const classId = router.query.classId
    const sessionIdx = router.query.sessionIdx

    const requestUrl = `/classroom/${classId}/session/${sessionIdx}`

    const responseData = await AxiosRequest({
      url: requestUrl,
      method: 'DELETE',
      body: '',
      token: authToken,
    })

    if (responseData.name !== 'AxiosError') {
      const liveStartDate = new Date(classData?.start_date)
      const liveEndDateAfterTwoHours = new Date(classData?.end_date + 7200000)

      // 현재 시간 기준으로 end_date + 2시간이 (총 4시간) 지나면, ivs 영역 비활성화 + chat 영역 비활성화
      if (nowTime >= liveStartDate && nowTime > liveEndDateAfterTwoHours) {
        setIvsPlayStatus('end')
      } else {
        // 현재 시간 기준으로 end_date + 2시간 전일 때, ivs 영역 비활성화 + chat 영역 freezing
        setIvsPlayStatus('fast-end')
      }

      // sendbird chat freezing
      controlFreezeChat()
    }
  }

  const controlFreezeChat = async () => {
    const requestUrl = `/sendbird/group_channels/${chatData?.channel_url}/freeze`

    const body = {
      freeze: true,
    }

    const responseData = await AxiosRequest({
      url: requestUrl,
      method: 'PUT',
      body: body,
      token: authToken,
    })

    // teacher의 방송종료에 의해 sendbird chat이 freeze 되었음을 알기 위한 isChatFreezed 추가
    setChatData({ ...chatData, isChatFreezed: true })
  }

  useEffect(() => {
    // chat 컴포넌트 열고 닫을 때마다 LiveStatusVideoScreen 준비화면 height 맞춤 조정
    const ivsPlayerHeight = document.getElementsByTagName('video')[0]

    if (typeof ivsPlayerHeight !== 'undefined') {
      setVideoStatusScreenHeight(ivsPlayerHeight.offsetHeight)
    }
  }, [isChatOpen])

  // 현재 시간 업데이트 될 때마다, 10분 남았을 때부터 툴팁이 띄워지도록 하는 로직
  // 라이브 종료 시간이 지나면 음수로 표현되는데, 음수일 때는 실행되지 않도록 방지
  useEffect(() => {
    if (
      typeof classData !== 'undefined' &&
      Object.keys(classData).length !== 0 &&
      getBeforeMinutesEndTime(classData?.end_date) >= 0
    ) {
      if (getBeforeMinutesEndTime(classData?.end_date) <= 10) {
        setIsLiveEndPopOver(true)
      }
    }
  }, [nowTime])

  return (
    <div className='fiive_layout teacher_layout'>
      <header className='layout_header'>
        <div className='left_header_box'>
          {offsetX > 1023 && (
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

            {typeof classData !== 'undefined' &&
            Object.keys(classData).length > 0 ? (
              <div className='teacher_name_box'>{classData?.teacher_name}</div>
            ) : (
              <div className='teacher_name_box non_active'> </div>
            )}
          </div>
        </div>

        <div className='right_header_box'>
          {/* LIVE 상태 정보 영역 */}
          <div
            className={`live_status ${
              streamInfomation === 'LIVE-ON' && 'play'
            }`}
          >
            {streamInfomation === 'LIVE-ON' ? 'LIVE' : 'LIVE 중이 아님'}
          </div>

          {/* 현재 라이브 참여자 수 영역 */}
          <div className='live_participant_number_box'>
            <Image
              src='../layouts/fiive/live_participant.svg'
              width={12}
              height={12}
              alt='liveParticipant'
            />
            <span className='live_participant_number'>
              {numberOfLiveUser ? numberOfLiveUser : '불러올 수 없음'}
            </span>
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
              liveStatusObject={
                getBeforeMinutesEndTime(classData?.end_date) <= 1
                  ? liveEndBefore1Minutes
                  : liveEndBefore10Minutes
              }
              setIsLiveEndPopOver={setIsLiveEndPopOver}
            />
          )}

          <div className='quit_button_box' onClick={() => endLiveClass()}>
            <Image
              src='../layouts/fiive/quit_live_icon.svg'
              width={22}
              height={22}
              alt='quitLiveIcon'
            />
            <span className='quit_button_text'>라이브 종료</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default FiiveLayout
