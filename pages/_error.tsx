import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import router from 'next/router'

import ChannelService from '../utils/ChannelService'

const ErrorPage = () => {
  // channelTalk open <> close toggle boolean state
  const [isOpenChannelTalk, setIsOpenChannelTalk] = useState(false)

  const closeBrowser = () => {
    window.open('about:blank', '_self').close()
  }

  // channelTalk open <> close toggle
  const clickChannelTalk = () => {
    if (!isOpenChannelTalk) {
      ChannelIO('show')
      setIsOpenChannelTalk(true)

      // default direction인 right에서 left로 설정
      const ChannelTalkDirection = document.getElementById('ch-plugin-script')

      ChannelTalkDirection?.classList.remove('rightPosition')
      ChannelTalkDirection?.classList.add('leftPosition')
    } else {
      ChannelIO('hide')
      setIsOpenChannelTalk(false)
    }
  }

  // 페이지 초기 로드시, channelTalk booting
  useEffect(() => {
    ChannelService.boot({
      pluginKey: process.env.NEXT_PUBLIC_CHANNELTALK_PLUGIN_KEY,
      customLauncherSelector: '.help_button_wrapper',
      hideChannelButtonOnBoot: true,
    })
  }, [])

  return (
    <div className='not_found'>
      <Head>
        <title>500 error</title>
      </Head>

      <div className='title_box'>
        <div className='image_box'>
          <img
            className='notFoundIcon'
            src='/icons/IMG_error_403.png'
            alt='notFoundIcon'
          />
        </div>
        <div className='main_title'>라이브 참여가 늦어지고 있어요...</div>
        <div className='sub_title'>
          이 페이지는 피이브 트래픽 문제(사용량 급증 등) 또는 피이브에서 사용
          중인 지원 인프라에 문제가 있을 때 보여요.
          <br />
          수강생 인터넷 환경 문제와 관련이 없으므로{' '}
          <b>10초 후에 ‘다시 참여하기‘를 눌러주세요.</b>
          <br />
          이 페이지가 지속적으로 보인다면 곧 올라올 VOD를 시청해주세요.
          <br />
          라이브 수업 진행 자체에 문제가 있음이 확인될 경우 피이브 팀이 알맞은
          조치(보강 또는 부분 환불 등)를 빠르게 안내해 드릴게요.
        </div>
      </div>
      <div className='button_box'>
        <button className='prev_button' onClick={() => clickChannelTalk()}>
          문의하기
        </button>
        <button
          className='home_button'
          onClick={() => {
            router.reload(window.location.pathname)
          }}
        >
          다시 참여하기
        </button>
      </div>
    </div>
  )
}

export default ErrorPage
