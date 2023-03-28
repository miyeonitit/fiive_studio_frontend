import React, {
  useState,
  useEffect,
  ReactElement,
  useLayoutEffect,
} from 'react'
import Head from 'next/head'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import Router, { useRouter } from 'next/router'
import { NextPageWithLayout } from '../types/NextPageWithLayout'
import { CSSProperties } from 'styled-components'

import AxiosRequest from '../utils/AxiosRequest'
import sendbirdUseStore from '../store/Sendbird'
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
  classroom: { ivs: ivsType; sendbird: sendbirdChatType; class: classType }
  authTokenValue: string
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

  // sendbird Chat open <> close 동작을 위한 toggle boolean state
  const isChatOpen = fiiveStudioUseStore((state: any) => state.isChatOpen)
  const setIsChatOpen = fiiveStudioUseStore((state: any) => state.setIsChatOpen)

  // waiting: 라이브 전 재생 대기중 <> play: 재생중 <> end: 라이브 종료 <> error : 재생 에러
  const ivsPlayStatus = fiiveStudioUseStore((state: any) => state.ivsPlayStatus)

  // user infomation state
  const userInfomation = fiiveStudioUseStore(
    (state: any) => state.userInfomation
  )
  const setUserInfomation = fiiveStudioUseStore(
    (state: any) => state.setUserInfomation
  )

  // save sendbird emoji list container
  const emojiContainer = sendbirdUseStore((state: any) => state.emojiContainer)
  const addEmojiContainer = sendbirdUseStore(
    (state: any) => state.addEmojiContainer
  )

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

  // 1. get user infomation with user auth-token
  const getUserInfomation = async (token: string) => {
    const requestUrl = `/auth`

    const responseData = await AxiosRequest({
      url: requestUrl,
      method: 'GET',
      body: '',
      token: token,
    })

    if (responseData.name !== 'AxiosError') {
      // 접속한 본인의 role이 teacher나 admin일 경우, 404 페이지로 이동
      if (responseData.userRole !== 'learner') {
        router.push('/404')
      }

      // 유저의 접속 정보가 맞다면, userInfomation에 유저 정보 저장
      setUserInfomation(responseData)
    } else if (
      responseData.response.request.status === 401 ||
      responseData.response.request.status === 403
    ) {
      // 401, 403 - user의 수강 권한이 없을 경우, not-access 페이지로 이동
      router.push('/not-access')
    }
  }

  // 2. get chat's emoji list container
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

  useLayoutEffect(() => {
    const redirectFiive = process.env.NEXT_PUBLIC_FIIVE_URL

    // auth-token이 존재하지 않을 경우, fiive login 화면으로 이동
    if (typeof props?.authTokenValue === 'undefined') {
      router.push(`${redirectFiive}/login`)
    }
    // auth-token이 존재할 경우
    else if (props?.authTokenValue.length !== 0) {
      // 1. get user infomation with user auth-token
      getUserInfomation(props?.authTokenValue)

      // 2. get chat's emoji list container
      getChatEmojiContainer(props?.authTokenValue)
    }
  }, [props?.authTokenValue])

  return (
    <div className='fiive learner page'>
      <Head>
        <title>fiive studio || learner page</title>
      </Head>

      <main>
        {/* ivs 영역 */}
        <section className='video-wrapper' ref={playerHeightRef}>
          {/* metadata reaction emoji 컴포넌트 */}
          <Reactions />

          {/* ivs video player 영역 컴포넌트 */}
          <Video
            playbackUrl={ivsInfomation?.channel?.playbackUrl}
            authToken={props?.authTokenValue}
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
            {typeof classInfomation !== 'undefined' &&
              Object.keys(classInfomation).length > 0 && (
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
            {typeof classInfomation !== 'undefined' &&
            Object.keys(classInfomation).length > 0 ? (
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
              authTokenValue={props?.authTokenValue}
            />
          ) : (
            <FakeChat status='liveEnd' chatHeightStyle={chatHeightStyle} />
          )}
        </div>
      </aside>
    </div>
  )
}

LearnerPage.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>
}

export default LearnerPage
