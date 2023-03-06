import React, { useState, useRef, useEffect, ReactElement } from 'react'
import { NextPageWithLayout } from '../types/NextPageWithLayout'
import Head from 'next/head'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import Router from 'next/router'
import { useRouter } from 'next/router'
import { CSSProperties } from 'styled-components'

import AxiosRequest from '../utils/AxiosRequest'
import sendbirdUseStore from '../store/Sendbird'
import classRoomUseStore from '../store/classRoom'
import fiiveStudioUseStore from '../store/FiiveStudio'

import Layout from '../components/FiiveLearnerLayout'
import Video from '../components/Video'
import Announcements from '../components/Announcements'
import QuestionModal from '../components/QuestionModal'
import SubmitReaction from '../components/SubmitReaction'
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

const LearnerPage: NextPageWithLayout = (props: props) => {
  const router = useRouter()

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

  // now local time
  const nowTime = fiiveStudioUseStore((state: any) => state.nowTime)

  // const questions = useStore((state: any) => state.questions)

  // const [questionModal, toggleQuestionModal] = useState(false)
  // const [reactions, toggleReactions] = useState(false)

  // 반응형일 때, chat의 상대적 height state
  const [chatOffsetHeight, setChatOffsetHeight] = useState(0)

  const playerHeightRef = React.useRef() as React.MutableRefObject<HTMLElement>

  // classroom Data 구조 분해 할당
  const ivsInfomation = props?.classroom?.ivs
  const classInfomation = props?.classroom?.class
  const sendbirdInfomation = props?.classroom?.sendbird

  // 반응형일 때, 전체 페이지 height(100vh) - ( Nav height(57px) + fix bottom height(82px) + content margin up & down(24px) = 163px )- Video height
  const chatHeightStyle: CSSProperties =
    offsetX < 1023
      ? {
          height: `calc(100vh  - 57px - ${chatOffsetHeight}px)`,
        }
      : {}

  // const question = () => {
  //   const [question = null] = questions
  //   return question
  // }

  const getUserInfomation = async (token: string) => {
    const requestUrl = `/auth`
    const classId = router.query.classId
    const sessionIdx = router.query.sessionIdx

    const responseData = await AxiosRequest({
      url: requestUrl,
      method: 'GET',
      body: '',
      token: token,
    })

    if (responseData.name !== 'AxiosError') {
      // 접속한 본인의 role이 teacher나 admin일 경우, 404 페이지로 이동
      if (responseData.userRole !== 'learner') {
        Router.push({
          pathname: '/404',
          query: { classId: classId, sessionIdx: sessionIdx },
        })
      }

      setUserInfomation(responseData)
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
    const liveEndDateAfterTwoHours = new Date(classData?.end_date + 7200000)

    if (nowTime > liveEndDateAfterTwoHours) {
      setIvsPlayStatus('end')
      return
    }

    const requestUrl = `/classroom/${classId}/ivs/stream`

    const body = {
      channelArn: props?.classroom?.ivs?.channel?.arn,
    }

    const responseData = await AxiosRequest({
      url: requestUrl,
      method: 'POST',
      body: body,
      token: props?.auth_token,
    })

    if (responseData.name !== 'AxiosError') {
      // LIVE 방송 중일 때
      setStreamInfomation(responseData.stream)
    } else {
      // LIVE 방송 중이지 않을 때 (ivsPlayStatus가 waiting 이거나 end)
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
    const classId = router.query.classId
    const sessionIdx = router.query.sessionIdx

    if (props?.auth_token && props?.auth_token.length !== 0) {
      // 수강 권한 없는 user가 접근 시 not-access 페이지로 이동
      if (props.classroom.status === 401) {
        // console.log(props.classroom.response.status === 403, '수강 권한 없음')
        Router.push({
          pathname: '/not-access',
          query: { classId: classId, sessionIdx: sessionIdx },
        })
        return
      }

      // 1. get user auth_token
      setAuthToken(props?.auth_token)

      // 2. get user infomation with user auth_token
      getUserInfomation(props?.auth_token)

      // 3. get chat's emoji list container
      getChatEmojiContainer(props?.auth_token)
    }
  }, [props?.auth_token])

  return (
    <div className='fiive learner page'>
      <Head>
        <title>fiive studio || learner page</title>
      </Head>

      <main>
        {/* ivs 영역 */}
        <section className='video-wrapper' ref={playerHeightRef}>
          {/* <Announcements></Announcements>
          <Timer></Timer> */}

          {/* metadata reaction emoji 컴포넌트 */}
          <Reactions />

          {/* ivs video player 영역 컴포넌트 */}
          <Video
            playbackUrl={ivsInfomation?.channel?.playbackUrl}
            authToken={props?.auth_token}
            classId={userInfomation?.classId}
            userRole={userInfomation?.userRole}
          />

          {/* live 시작 전, 재생 에러, live 종료일 때 띄우는 준비 화면 컴포넌트 */}
          {ivsPlayStatus !== 'play' && (
            <LiveStatusVideoScreen
              ivsPlayStatus={ivsPlayStatus}
              thumbnailImgSrc={classInfomation?.class_thumbnail}
            />
          )}
        </section>

        {/* class infomation 영역 */}
        {(offsetX >= 1023 || !isChatOpen) && (
          <section className='class-wrapper'>
            {Object.keys(classInfomation).length > 0 && (
              <div className='class_infomation_wrapper'>
                <div className='class_title_box'>
                  {classInfomation?.class_name} {classInfomation?.session + 1}
                  회차
                </div>

                <div className='class_description_box'>
                  {classInfomation?.curriculum_contents}
                </div>
              </div>
            )}

            {/* class notification 영역 */}
            {Object.keys(classInfomation).length > 0 ? (
              <div className='class_notification_wrapper'>
                <div className='nonotification_title_box'>
                  <Image
                    src='../layouts/fiive/announce_icon.svg'
                    width={16}
                    height={16}
                    alt='announceIcon'
                  />
                  <span className='class_title'>
                    {classInfomation?.session + 1}회차 라이브에 오신 것을
                    환영해요
                  </span>
                </div>
                <div className='notification_description_box'>
                  선생님과 수강생이 함께 소통하는 공간이에요. 피이브 커뮤니티
                  가이드를 준수하는 것을 잊지 마세요.
                </div>
                <button
                  className='community_guide_button'
                  onClick={() =>
                    router.push(
                      'https://www.notion.so/pureblack/86412e7f47b54f3680b76029777bfc0d'
                    )
                  }
                >
                  커뮤니티 가이드 알아보기
                </button>
              </div>
            ) : (
              <div className='class_notification_wrapper'>
                <div className='nonotification_title_box'>
                  <Image
                    src='../layouts/fiive/alert_icon.svg'
                    width={16}
                    height={16}
                    alt='alertIcon'
                  />
                  <span className='class_title'>
                    라이브 정보를 가져오는데 문제가 생겼어요.
                  </span>
                </div>
                <div className='notification_description_box'>
                  [ClassDoesnotExistsError / Status Code: nnn] <br />
                  수업 참여에는 문제가 없으나 이 메시지가 자주 보이는 경우
                  피이브 고객센터에 메시지 내용을 그대로 보내주세요.
                </div>
              </div>
            )}
          </section>
        )}
      </main>

      {/* chat을 펼쳤을 때 aside bar */}
      <aside
        className={`chat ${!isChatOpen && 'close'}`}
        style={chatHeightStyle}
      >
        {/* <header>
          <button type='button' className='arrow'>
            <img src='/icons/move_right.svg' alt='Arrow' />
          </button>

          <h3>실시간 채팅</h3>

          <button type='button' className='notifications'>
            <img src='/icons/announce.svg' alt='Notifications' />
          </button>
        </header> */}
        {/* 
        <div className='questions'>
          {question() && (
            <div className='question-item'>
              <h4>Q1</h4>
              <p>{question()?.content}</p>
              <span className='timestamp'>n분 전</span>
            </div>
          )} */}
        {/* Swiper */}
        {/* </div> */}
        <div className='chatroom'>
          {ivsPlayStatus !== 'end' ? (
            <Chat
              userId={userInfomation?.userId}
              userRole={userInfomation?.userRole}
              currentUrl={sendbirdInfomation?.channel_url}
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

      {/* {questionModal && (
        <QuestionModal
          toggle={() => {
            toggleQuestionModal(false)
          }}
        ></QuestionModal>
      )} */}
    </div>
  )
}

LearnerPage.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>
}

export default LearnerPage
