import React, { ReactElement, useState } from 'react'
import type { GetStaticProps } from 'next'
import Head from 'next/head'
import axios from 'axios'

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

import class_thumbnail_image from '../public/placeholders/class_thumbnail.png'

type props = {
  emoji_data: { id: number; key: string; url: string }
}

const TeacherPage: NextPageWithLayout = (props: props) => {
  const [announcementModal, toggleAnnouncementModal] = useState(false)
  const [timerModal, toggleTimerModal] = useState(false)

  // custom reaction emoji list state
  const [emojiContainer, setEmojiContaioner] = useState(props.emoji_data)

  return (
    <div className='fiive teacher page'>
      <Head>
        <title>fiive teacher</title>
        <meta name='description' content='fiive teacher' />
      </Head>

      <aside className='utilities'>
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
      </aside>

      <main>
        <section className='video-wrapper'>
          <h3>강의 화면 미리보기</h3>
          <div className='preview'>
            <Timer></Timer>
            <Reactions></Reactions>
            {/* <Video /> */}
          </div>
        </section>

        <section className='class-info'>
          <div className='class'>
            {/* <Image src={class_thumbnail_image} alt='Class' /> */}
            <div className='description'>
              <ol className='badges'>
                <li className='online'>온라인</li>

                <li className='recording'>녹화중</li>
              </ol>
              <h2>1회차 - 05월 08일 일요일, 22시 30분</h2>
              <p>비문학(기본기+훈련) + 문학(기본기+개념어 정의+유형별 접근)</p>
            </div>
          </div>

          <a href='' target='_blank'>
            상세 페이지 바로가기
          </a>
        </section>
      </main>

      <aside className='chat'>
        {/* <section className='questions'>
          <TeacherQuestionWidget></TeacherQuestionWidget>
        </section> */}

        <section className='chat'>
          <TeacherChatWidget emojiContainer={emojiContainer} />
        </section>
      </aside>

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
      )}
    </div>
  )
}

TeacherPage.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>
}

export const getStaticProps: GetStaticProps = async (context) => {
  const ApiStudio = process.env.NEXT_PUBLIC_API_BASE_URL
  const apiToken = process.env.NEXT_PUBLIC_SENDBIRD_API_TOKEN
  const emojiCategoryId = process.env.NEXT_PUBLIC_SENDBIRD_EMOJI_CATEGORY_ID

  const emojiResonse = await axios.get(
    `https://${ApiStudio}/emoji_categories/${emojiCategoryId}`,
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

export default TeacherPage
