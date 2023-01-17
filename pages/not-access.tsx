import React, { ReactElement } from 'react'
import Image from 'next/image'
import Head from 'next/head'

import Layout from '../components/FiiveLearnerLayout'

import dummyImg from '../public/dummy/fiive_brand_dummy.jpg'

const not_access = () => {
  return (
    <div className='not_access'>
      <Head>
        <title>fiive studio</title>
      </Head>

      <div className='dummy_body'>
        {/* 왼쪽 구성되어있는 선생님 수업화면 더미와 수업정보 관련 box */}
        <div className='dummy_live_box'>
          <div className='live_obs_dummy' />

          <div className='live_information_dummy'>
            <div className='information_dummy_box'>
              {/* 첫번째 독립적인 네모 스켈레톤 */}
              <div className='first_skeleton_ractangle' />
              {/* 두번째 독립적인 네모 스켈레톤 */}
              <div className='second_skeleton_ractangle' />
              {/* bluegray-1을 배경으로 하고있는 스켈레톤 더미 */}
              <div className='skeleton_dummy_box'>
                <div className='skeleton_dummy_first'>
                  <div className='skeleton_first' />
                  <div className='skeleton_second' />
                </div>
                <div className='skeleton_dummy_second' />
                <div className='skeleton_dummy_third' />
              </div>
            </div>
          </div>
        </div>
        {/* 오른쪽에 구성되어있는 실시간 채팅창 더미 box */}
        <div className='dummy_chat_box'>
          <div className='chat_box'>
            <div className='chat_header_box'>
              <div className='chat_title_box'>실시간 채팅</div>
              <div className='chat_the_menu_box'>
                <div className='more_button_box'>
                  <Image
                    src='/Sendbird/more_button.svg'
                    width={20}
                    height={20}
                    alt='moreButton'
                  />
                </div>

                <div className='close_button_box'>
                  <Image
                    src='/Sendbird/responsive_close_button.svg'
                    width={20}
                    height={20}
                    alt='closeButton'
                  />
                </div>
              </div>
            </div>
            {/* 스켈레톤 부분 */}
            <div className='chat_skeleton_box'>
              <div className='first_chat_skeleton'>
                <div className='circle_skeleton' />
                <div className='ractangle_skeleton_box'>
                  <div className='skeleton_100' />
                  <div className='skeleton_220' />
                </div>
              </div>
              <div className='second_chat_skeleton'>
                <div className='circle_skeleton' />
                <div className='ractangle_skeleton_box'>
                  <div className='skeleton_100' />
                  <div className='skeleton_150' />
                </div>
              </div>
              <div className='third_chat_skeleton'>
                <div className='circle_skeleton' />
                <div className='ractangle_skeleton_box'>
                  <div className='skeleton_100' />
                  <div className='skeleton_200' />
                  <div className='skeleton_120' />
                </div>
              </div>
              <div className='four_chat_skeleton'>
                <div className='circle_skeleton' />
                <div className='ractangle_skeleton_box'>
                  <div className='skeleton_100' />
                  <div className='skeleton_180' />
                </div>
              </div>
              <div className='fifth_chat_skeleton'>
                <div className='circle_skeleton' />
                <div className='ractangle_skeleton_box'>
                  <div className='skeleton_100' />
                  <div className='skeleton_80' />
                </div>
              </div>
              <div className='sixth_chat_skeleton'>
                <div className='circle_skeleton' />
                <div className='ractangle_skeleton_box'>
                  <div className='skeleton_100' />
                  <div className='skeleton_180' />
                </div>
              </div>
              <div className='seven_chat_skeleton'>
                <div className='circle_skeleton' />
                <div className='ractangle_skeleton_box'>
                  <div className='skeleton_100' />
                  <div className='skeleton_180' />
                </div>
              </div>
            </div>
            {/* 채팅창, 보내기버튼 있는 부분 */}
            <div className='chat_bottom_box'>
              <Image
                className='sendMessageIcon'
                src={'/Sendbird/non_active_send_message_icon.svg'}
                //   onClick={() => handleSendMessage()}
                width={24}
                height={24}
                alt='sendMessageIcon'
              />
            </div>
          </div>
        </div>
      </div>
      <div className='error_modal'>
        <img src='/icons/IMG_error_403.png' alt='error_img' />
        <div className='description_box'>
          <div className='main_title'>수강생이 아닌가요?</div>
          <div className='sub_title'>
            지금 찾아주신 라이브는 수강생만 볼 수 있어요.
            <br />
            라이브에 참여하려면 수강 신청을 해주세요.
          </div>
        </div>
        <div className='button_box'>
          <button className='home_button'>홈으로</button>
          <button className='apply_button'>수강 신청하기</button>
        </div>
      </div>
    </div>
  )
}

not_access.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>
}

export default not_access
