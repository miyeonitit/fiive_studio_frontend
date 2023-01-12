import React, { useState, useRef, useEffect, ReactElement } from 'react'
import { NextPageWithLayout } from '../types/NextPageWithLayout'
import Head from 'next/head'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { CSSProperties } from 'styled-components'
import axios from 'axios'

import sendbirdUseStore from '../store/Sendbird'
import fiiveStudioUseStore from '../store/FiiveStudio'

import Layout from '../components/FiiveLearnerLayout'
import Video from '../components/Video'
import Announcements from '../components/Announcements'
import QuestionModal from '../components/QuestionModal'
import SubmitReaction from '../components/SubmitReaction'
import Timer from '../components/Timer'
import Reactions from '../components/Reactions'
import useStore from '../store/video'

const Chat = dynamic(() => import('../components/Chat'), {
  ssr: false,
  loading: () => <div>Loading...</div>,
})

const LearnerPage: NextPageWithLayout = () => {
  // 반응형 미디어쿼리 스타일 지정을 위한 브라우저 넓이 측정 전역 state
  const offsetX = fiiveStudioUseStore((state: any) => state.offsetX)

  // 반응형 사이즈에서 header의 라이브 참여자 목록을 볼 때, UI height 버그를 처리하기 위해 확인하는 boolean state
  const isOpenResponsiveLiveMember = fiiveStudioUseStore(
    (state: any) => state.isOpenResponsiveLiveMember
  )

  // sendbird Chat open <> close 동작을 위한 toggle boolean state
  const isChatOpen = fiiveStudioUseStore((state: any) => state.isChatOpen)
  const setIsChatOpen = fiiveStudioUseStore((state: any) => state.setIsChatOpen)

  const questions = useStore((state: any) => state.questions)

  const [questionModal, toggleQuestionModal] = useState(false)
  const [reactions, toggleReactions] = useState(false)

  // 반응형일 때, chat의 상대적 height state
  const [chatOffsetHeight, setChatOffsetHeight] = useState(0)

  // custom reaction emoji list state
  const [emojiContainer, setEmojiContainer] = useState([])

  const playerHeightRef = useRef<HTMLElement>(null)

  // 반응형일 때, 전체 페이지 height(100vh) - ( Nav height(57px) + fix bottom height(82px) + content margin up & down(24px) = 163px )- Video height
  const chatHeightStyle: CSSProperties =
    offsetX < 1023 && !isOpenResponsiveLiveMember
      ? {
          height: `calc(100vh  - 163px - ${chatOffsetHeight}px)`,
        }
      : {}

  const question = () => {
    const [question = null] = questions
    return question
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
    reset()
  }, [])

  useEffect(() => {
    const ApiStudio = process.env.NEXT_PUBLIC_API_BASE_URL
    const emojiCategoryId = process.env.NEXT_PUBLIC_SENDBIRD_EMOJI_CATEGORY_ID

    axios
      .get(`${ApiStudio}/sendbird/emoji_categories/${emojiCategoryId}`)
      .then((response) => {
        const data = response.data

        setEmojiContainer(data.emojis)
      })
      .catch((error) => {
        console.error('실패:', error)
      })
  }, [])

  return (
    <div className='fiive learner page'>
      {/* <Head>
        <title>fiive studio || learner page</title>
      </Head> */}

      <main>
        {/* ivs 영역 */}
        <section className='video-wrapper' ref={playerHeightRef}>
          <Announcements></Announcements>
          <Timer></Timer>
          <Reactions></Reactions>
          <Video />
        </section>

        {/* class infomation 영역 */}
        {(offsetX >= 1023 || !isChatOpen) && (
          <section className='class-wrapper'>
            <div className='class_infomation_wrapper'>
              <div className='class_title_box'>
                평가원 행동 증명(이감 파이널2 (시즌6) 해설 강의) n회차
              </div>

              <div className='class_description_box'>
                평가원 기술 지문 포인트 및 실전 행동 훈련 + EBS 수능특강 속 기술
                지문 연계 대비
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
                선생님과 수강생이 함께 소통하는 공간이에요. 피이브 커뮤니티
                가이드를 준수하는 것을 잊지 마세요.
              </div>
              <button className='community_guide_button'>
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
          <Chat
            userId='learne'
            isChatOpen={isChatOpen}
            setIsChatOpen={setIsChatOpen}
            emojiContainer={emojiContainer}
          />
        </div>
        {/* <footer>
          <button
            onClick={() => {
              toggleQuestionModal(true)
            }}
            type='button'
          >
            <Image
              src='../icons/question.svg'
              width={20}
              height={20}
              alt='Question'
            />
          </button>

          <button
            onClick={() => {
              toggleReactions(!reactions)
            }}
            type='button'
          >
            <Image
              src='../icons/reaction.svg'
              width={20}
              height={20}
              alt='Reactions'
            />
          </button>

          <button type='button'>
            <Image
              src='../icons/setting.svg'
              width={20}
              height={20}
              alt='Settings'
            />
          </button>
          {reactions && (
            <SubmitReaction
              toggle={() => {
                toggleReactions(false)
              }}
            ></SubmitReaction>
          )}
        </footer> */}
      </aside>

      {questionModal && (
        <QuestionModal
          toggle={() => {
            toggleQuestionModal(false)
          }}
        ></QuestionModal>
      )}
    </div>
  )
}

LearnerPage.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>
}

export default LearnerPage
