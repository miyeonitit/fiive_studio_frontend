import React, { useState, ReactElement } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { NextPageWithLayout } from '../types/NextPageWithLayout'

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
  const [questionModal, toggleQuestionModal] = useState(false)
  const [reactions, toggleReactions] = useState(false)

  // chat 접기, 펼치기 boolean state
  const [isCloseChat, setIsCloseChat] = useState(false)

  const questions = useStore((state: any) => state.questions)

  const question = () => {
    const [question = null] = questions
    return question
  }

  return (
    <div className='fiive learner page'>
      <Head>
        <title>fiive learner</title>
        <meta name='description' content='fiive learner' />
      </Head>

      <main>
        <section className='video-wrapper'>
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
              <h2>&#123;teacher_name&#125;</h2>
              <p>&#123;class_name&#125;</p>
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
            <span className='timestamp'>00:00:00</span>

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
              <h2>1회차 - 05월 08일 일요일, 22시 30분</h2>
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
      <aside className={`chat ${isCloseChat && 'close'}`}>
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
          />
        </div>
        <footer>
          <button
            onClick={() => {
              toggleQuestionModal(true)
            }}
            type='button'
          >
            <img src='/icons/question.svg' alt='Question' />
          </button>

          <button
            onClick={() => {
              toggleReactions(!reactions)
            }}
            type='button'
          >
            <img src='/icons/reaction.svg' alt='Reactions' />
          </button>

          <button type='button'>
            <img src='/icons/setting.svg' alt='Settings' />
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

export default LearnerPage
