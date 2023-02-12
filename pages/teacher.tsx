import React, { useState, useRef, useEffect, ReactElement } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import Router from 'next/router'
import { CSSProperties } from 'styled-components'

import AxiosRequest from '../utils/AxiosRequest'
import sendbirdUseStore from '../store/Sendbird'
import classRoomUseStore from '../store/classRoom'
import fiiveStudioUseStore from '../store/FiiveStudio'

import { NextPageWithLayout } from '../types/NextPageWithLayout'
import Layout from '../components/FiiveTeacherLayout'
import Video from '../components/Video'
import LectureTools from '../components/LectureTools'
import TeacherChatWidget from '../components/TeacherChatWidget'
import TeacherQuestionWidget from '../components/TeacherQuestionWidget'
import AnnouncementModal from '../components/AnnouncementModal'
import TimerModal from '../components/TimerModal'
import Timer from '../components/Timer'
import Reactions from '../components/Reactions'
import LiveStatusVideoScreen from '../components/VideoComponents/LiveStatusVideoScreen'
import FakeChat from '../components/FakeChat'

type ivsType = {
  channel: { arn: string; authorized: boolean; playbackUrl: string }
}

type classType = {
  class_name: string
  curriculum_contents: string
  start_date: number
  end_date: number
  class_thumbnail: string
  teacher_thumbnail: null
  teacher_name: string
  session: number
}

type sendbirdChatType = {
  name: string
  channel_url: string
  members: Array<object>
}

type props = {
  emoji_data?: { emojis: Array<object>; id: number; name: string; url: string }
  classroom: { ivs: ivsType; sendbird: sendbirdChatType; class: classType }
  class_id: string
  auth_token: string
  sendbirdAccessToken: string
}

const Chat = dynamic(() => import('../components/Chat'), {
  ssr: false,
  loading: () => <FakeChat status='loading' />,
})

const useInterval = (callback: any, delay: number) => {
  const savedCallback = useRef()

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    const tick = () => {
      savedCallback.current()
    }

    if (delay !== null) {
      let replayMethod = setInterval(tick, delay)

      return () => clearInterval(replayMethod)
    }
  }, [delay])
}

const TeacherPage: NextPageWithLayout = (props: props) => {
  // 반응형 미디어쿼리 스타일 지정을 위한 브라우저 넓이 측정 전역 state
  const offsetX = fiiveStudioUseStore((state: any) => state.offsetX)

  // 반응형 사이즈에서 header의 라이브 참여자 목록을 볼 때, UI height 버그를 처리하기 위해 확인하는 boolean state
  const isOpenResponsiveLiveMember = fiiveStudioUseStore(
    (state: any) => state.isOpenResponsiveLiveMember
  )

  // sendbird Chat open <> close 동작을 위한 toggle boolean state
  const isChatOpen = fiiveStudioUseStore((state: any) => state.isChatOpen)
  const setIsChatOpen = fiiveStudioUseStore((state: any) => state.setIsChatOpen)

  // waiting: 라이브 전 재생 대기중 <> play: 재생중 <> end: 라이브 종료 <> error : 재생 에러
  const ivsPlayStatus = fiiveStudioUseStore((state: any) => state.ivsPlayStatus)
  const setIvsPlayStatus = fiiveStudioUseStore(
    (state: any) => state.setIvsPlayStatus
  )

  // user infomation state
  const userInfomation = fiiveStudioUseStore(
    (state: any) => state.userInfomation
  )
  const setUserInfomation = fiiveStudioUseStore(
    (state: any) => state.setUserInfomation
  )

  // user auth token for API
  const setAuthToken = fiiveStudioUseStore((state: any) => state.setAuthToken)

  // 라이브 중일 때의 정보를 저장하기 위한 stream infomation state
  const setStreamInfomation = fiiveStudioUseStore(
    (state: any) => state.setStreamInfomation
  )

  // class infomation 정보를 저장하는 state
  const classData = classRoomUseStore((state: any) => state.classData)

  // save sendbird emoji list container
  const emojiContainer = sendbirdUseStore((state: any) => state.emojiContainer)
  const addEmojiContainer = sendbirdUseStore(
    (state: any) => state.addEmojiContainer
  )

  // const [announcementModal, toggleAnnouncementModal] = useState(false)
  // const [timerModal, toggleTimerModal] = useState(false)

  // 반응형일 때, chat의 상대적 height state
  const [chatOffsetHeight, setChatOffsetHeight] = useState(0)

  const playerHeightRef = React.useRef() as React.MutableRefObject<HTMLElement>

  // 반응형일 때, 전체 페이지 height(100vh) - ( Nav height(57px) + fix bottom height(82px) + content margin up & down(24px) = 163px )- Video height
  const chatHeightStyle: CSSProperties =
    offsetX < 1023
      ? {
          height: `calc(100vh  - 163px - ${chatOffsetHeight}px)`,
        }
      : {}

  const getUserInfomation = async (token: string) => {
    const requestUrl = `/auth`

    const responseData = await AxiosRequest({
      url: requestUrl,
      method: 'GET',
      body: '',
      token: token,
    })

    if (responseData.name !== 'AxiosError') {
      setUserInfomation(responseData)
    } else {
      console.log('수강 권한 없음')

      Router.push({
        pathname: '/not-access',
        query: { classId: props.class_id },
      })
    }
  }

  const getChatEmojiContainer = async (token: string) => {
    const emojiCategoryId = process.env.NEXT_PUBLIC_SENDBIRD_EMOJI_CATEGORY_ID

    const requestUrl = `/sendbird/emoji_categories/${emojiCategoryId}`

    const responseData = await AxiosRequest({
      url: requestUrl,
      method: 'GET',
      body: '',
      token: token,
    })

    addEmojiContainer(responseData.emojis)
  }

  const getLiveStreamInfomation = async (classId: string) => {
    const requestUrl = `/classroom/${classId}/ivs/stream`

    const body = {
      channelArn: props?.classroom?.ivs?.channel?.arn,
    }

    const responseData = await AxiosRequest({
      url: requestUrl,
      method: 'POST',
      body: body,
      token: props.auth_token,
    })

    if (responseData.name !== 'AxiosError') {
      setStreamInfomation(responseData.stream)
    } else {
      setStreamInfomation({})
    }
  }

  // 브라우저 resize 할 때마다 <Video /> 의 height 감지
  const reset = () => {
    setChatOffsetHeight(playerHeightRef.current?.offsetHeight)
  }

  useEffect(() => {
    window.addEventListener('resize', reset)

    // clean up function
    // return () => {
    //   window.removeEventListener('resize', reset)
    // }
  }, [chatOffsetHeight])

  useEffect(() => {
    // get offsetX
    reset()
  }, [])

  useEffect(() => {
    if (props.auth_token && props.auth_token.length !== 0) {
      // 1. get user auth_token
      setAuthToken(props.auth_token)

      // 2. get user infomation with user auth_token
      getUserInfomation(props.auth_token)

      // 3. get chat's emoji list container
      getChatEmojiContainer(props.auth_token)
    }
  }, [props.auth_token])

  // 최상단 Nav의 live 상태 표현을 위한, live 상태인지 아닌지 계속 판단해주는 로직
  // setInterval은 state 갱신이 되지 않아, 페이지 렌더 전 초기의 빈 state만을 기억하여 콜백함수를 호출한다는 단점이 존재함
  // 따라서 react custom hooks인 useInterval 사용
  useInterval(() => {
    getLiveStreamInfomation(props?.class_id)
  }, 5000)

  return (
    <div className='fiive teacher page'>
      <Head>
        <title>fiive studio || teacher page</title>
      </Head>

      {/* <aside className='utilities'>
        <section className='tools'>
          <LectureTools
            openAnnouncementModal={() => {
              toggleAnnouncementModal(true)
            }}
            openTimerModal={() => {
              toggleTimerModal(true)
            }}
          />
        </section>
      </aside> */}

      <main>
        {/* ivs 영역 */}
        <section className='video-wrapper' ref={playerHeightRef}>
          {/* <Timer></Timer> */}

          {/* metadata reaction emoji 컴포넌트 */}
          <Reactions />

          {/* ivs video player 영역 컴포넌트 */}
          <Video
            playbackUrl={props?.classroom?.ivs?.channel?.playbackUrl}
            authToken={props?.auth_token}
            classId={userInfomation?.classId}
          />

          {/* live 시작 전, 재생 에러, live 종료일 때 띄우는 준비 화면 컴포넌트 */}
          {ivsPlayStatus !== 'play' && (
            <LiveStatusVideoScreen
              ivsPlayStatus={ivsPlayStatus}
              thumbnailImgSrc={props?.classroom?.class?.class_thumbnail}
            />
          )}
        </section>

        {/* class infomation 영역 */}
        {(offsetX >= 1023 || !isChatOpen) && (
          <section className='class-wrapper'>
            <div className='class_infomation_wrapper'>
              <div className='class_title_box'>
                {props?.classroom?.class?.class_name}{' '}
                {props?.classroom?.class?.session}회차
              </div>

              <div className='class_description_box'>
                {props?.classroom?.class?.curriculum_contents}
              </div>
            </div>

            {/* class notification 영역 */}
            <div className='class_notification_wrapper'>
              <div className='nonotification_title_box'>
                <Image
                  src='../layouts/fiive/announce_icon.svg'
                  width={16}
                  height={16}
                  alt='announceIcon'
                />
                <span className='class_title'>
                  n회차 라이브에 오신 것을 환영해요
                </span>
              </div>
              <div className='notification_description_box'>
                피이브 스튜디오에서 제공하는 수업 도구와 함께 수강생과 소통하며
                라이브 수업을 운영해보세요! 수업 도구 사용법과 업데이트 소식이
                궁금하다면 아래에서 확인해보세요.
              </div>
              <button
                className='community_guide_button'
                onClick={() =>
                  window.open(
                    'https://www.notion.so/pureblack/86412e7f47b54f3680b76029777bfc0d'
                  )
                }
              >
                커뮤니티 가이드 알아보기
              </button>
            </div>
          </section>
        )}
      </main>

      {/* chat을 펼쳤을 때 aside bar */}
      <aside
        className={`chat ${!isChatOpen && 'close'}`}
        style={chatHeightStyle}
      >
        <div className='chatroom'>
          {ivsPlayStatus !== 'end' ? (
            <Chat
              userId={userInfomation?.userId}
              userRole={userInfomation?.userRole}
              currentUrl={props.classroom?.sendbird?.channel_url}
              isChatOpen={isChatOpen}
              setIsChatOpen={setIsChatOpen}
              emojiContainer={emojiContainer}
              chatHeightStyle={chatHeightStyle}
              sendbirdAccessToken={props?.sendbirdAccessToken}
              authToken={props?.auth_token}
            />
          ) : (
            <FakeChat status='liveEnd' chatHeightStyle={chatHeightStyle} />
          )}
        </div>
      </aside>

      {/* <aside className='chat'>
        <section className='questions'>
          <TeacherQuestionWidget></TeacherQuestionWidget>
        </section>
        <section className='chat'>
          <TeacherChatWidget emojiContainer={emojiContainer} />
        </section>
      </aside> */}
      {/* 
      {announcementModal && (
        <AnnouncementModal
          toggle={() => {
            toggleAnnouncementModal(!announcementModal)
          }}
        ></AnnouncementModal>
      )}
      {timerModal && (
        <TimerModal
          toggle={() => {
            toggleTimerModal(!timerModal)
          }}
        ></TimerModal>
      )} */}
    </div>
  )
}

TeacherPage.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>
}

export default TeacherPage
