import React, {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  ReactElement,
} from 'react'
import type { GetStaticProps } from 'next'
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

type props = {
  emoji_data: { id: number; key: string; url: string }
}

const Chat = dynamic(() => import('../components/Chat'), {
  ssr: false,
  loading: () => <div>Loading...</div>,
})

const LearnerPage: NextPageWithLayout = (props: props) => {
  // 반응형 미디어쿼리 스타일 지정을 위한 브라우저 넓이 측정 전역 state
  const offsetX = fiiveStudioUseStore((state: any) => state.offsetX)

  const [questionModal, toggleQuestionModal] = useState(false)
  const [reactions, toggleReactions] = useState(false)

  // 반응형일 때, chat의 상대적 height state
  const [chatOffsetHeight, setChatOffsetHeight] = useState(0)

  // chat 접기, 펼치기 boolean state
  const [isCloseChat, setIsCloseChat] = useState(false)

  // custom reaction emoji list state
  const [emojiContainer, setEmojiContaioner] = useState(props.emoji_data)

  const questions = useStore((state: any) => state.questions)

  const playerHeightRef = useRef<HTMLElement>(null)

  const question = () => {
    const [question = null] = questions
    return question
  }

  // 반응형일 때, 전체 페이지 height(100vh) - Nav height(73px) - Video height
  const chatHeightStyle: CSSProperties =
    offsetX < 1023
      ? {
          height: `calc(100vh - 73px - ${chatOffsetHeight}px)`,
        }
      : {}

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

  return (
    <div className='fiive learner page'>
      <Head>
        <title>fiive learner</title>
        <meta name='description' content='fiive learner' />
      </Head>

      <main>
        <section className='video-wrapper' ref={playerHeightRef}>
          <Announcements></Announcements>
          <Timer></Timer>
          <Reactions></Reactions>
          <Video />
        </section>

        <section className='session-info'>
          <div className='profile'>
            <div className='img'>
              <Image
                className='profile'
                src='/Sendbird/Ellipse 8stateBadge.svg'
                width={64}
                height={64}
                alt='teacher_profile_img'
              />

              <Image
                className='live'
                src='/Sendbird/iconBadge.svg'
                width={24}
                height={24}
                alt='live_status'
              />
            </div>

            <div className='txt'>
              <h2>&#123;teacher_names&#125;</h2>
              <p>&#123;class_names&#125;</p>
            </div>
          </div>

          <div className='status'>
            <Image
              className='viewers'
              src='/Sendbird/person.svg'
              width={14}
              height={14}
              alt='viewers'
            />
            <span className='viewer-count'>n</span>
            <span className='timestamp'>00:00:10</span>

            <button type='button' className='more'>
              <Image
                className='more'
                src='/Sendbird/more-button.svg'
                width={24}
                height={24}
                alt='More'
              />
            </button>
          </div>
        </section>

        <section className='class-info'>
          <div className='class'>
            {/* <img src='/placeholders/Ratio.jpg' alt='Class' /> */}
            <div className='description'>
              <h2>1회차 - 12월 23일 일요일, 22시 30분</h2>
              <p>비문학(기본기+훈련) + 문학(기본기+개념어 정의+유형별 접근)</p>
            </div>
          </div>

          <a href='' target='_blank'>
            상세 페이지 바로가기
          </a>
        </section>
      </main>

      {/* chat을 접었을 때 aside bar */}
      {isCloseChat && (
        <aside className='closed_chat_sidebar'>
          <div className='closed_chat_image_box'>
            <Image
              src='/Sendbird/move_left.svg'
              onClick={() => setIsCloseChat(false)}
              width={20}
              height={20}
              alt='closed_chat'
            />
          </div>
        </aside>
      )}

      {/* chat을 펼쳤을 때 aside bar */}
      <aside
        className={`chat ${isCloseChat && 'close'}`}
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
            isCloseChat={isCloseChat}
            setIsCloseChat={setIsCloseChat}
            emojiContainer={emojiContainer}
          />
        </div>
        <footer>
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
        </footer>
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

export const getStaticProps: GetStaticProps = async (context) => {
  const ApiStudio = process.env.NEXT_PUBLIC_API_BASE_URL
  const apiToken = process.env.NEXT_PUBLIC_SENDBIRD_API_TOKEN
  const emojiCategoryId = process.env.NEXT_PUBLIC_SENDBIRD_EMOJI_CATEGORY_ID

  const emojiResonse = await axios.get(
    `${ApiStudio}/emoji_categories/${emojiCategoryId}`,
    {
      headers: {
        'Api-Token': apiToken,
      },
    }
  )
  const emojiData = await emojiResonse.data.emojis

  return {
    props: {
      emoji_data: emojiData,
    },
  }
}

export default LearnerPage
