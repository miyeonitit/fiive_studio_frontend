import React, { useRef, useEffect, useState } from 'react'

import videoUseStore from '../store/video'
import ClassRoomUseStore from '../store/ClassRoom'
import fiiveStudioUseStore from '../store/FiiveStudio'

import AxiosRequest from '../utils/AxiosRequest'

// import Messages from "../components/Messages";

type props = {
  authToken: string
  playbackUrl: string
  classId: string
  userRole: string
}

const Video = (props: props) => {
  // const channel = videoUseStore((state: any) => state.channel)
  // const setChannel = videoUseStore((state: any) => state.setChannel)

  // const addAnnouncement = videoUseStore((state: any) => state.addAnnouncement)

  // const addQuestion = videoUseStore((state: any) => state.addQuestion)
  // const resolveQuestion = videoUseStore((state: any) => state.resolveQuestion)

  // const setTimer = videoUseStore((state: any) => state.setTimer)

  const addReaction = videoUseStore((state: any) => state.addReaction)

  // user infomation state
  const userInfomation = fiiveStudioUseStore(
    (state: any) => state.userInfomation
  )

  // ivs Player status 상태 표현 state
  const setIvsPlayStatus = fiiveStudioUseStore(
    (state: any) => state.setIvsPlayStatus
  )

  // 라이브 중일 때의 정보를 저장하기 위한 stream infomation state
  const setStreamInfomation = fiiveStudioUseStore(
    (state: any) => state.setStreamInfomation
  )

  // update now local time
  const nowTime = fiiveStudioUseStore((state: any) => state.nowTime)

  // 반응형 미디어쿼리 스타일 지정을 위한 브라우저 넓이 측정 전역 state
  const offsetX = fiiveStudioUseStore((state: any) => state.offsetX)

  // 반응형 미디어쿼리 스타일 지정을 위한 video player height 측정 전역 state
  const setVideoStatusScreenHeight = fiiveStudioUseStore(
    (state: any) => state.setVideoStatusScreenHeight
  )

  // class infomation 정보를 저장하는 state
  const classData = ClassRoomUseStore((state: any) => state.classData)

  // sendbird infomation 정보를 저장하는 state
  const chatData = ClassRoomUseStore((state: any) => state.chatData)
  const setChatData = ClassRoomUseStore((state: any) => state.setChatData)

  const [init, setInit] = useState(false)

  // const [messages, setMessages] = useState<any[]>([]);

  const ivsPlayer = useRef<HTMLVideoElement>(null)

  const controlFreezeChat = async () => {
    const requestUrl = `/sendbird/group_channels/${chatData?.channel_url}/freeze`

    const body = {
      freeze: true,
    }

    const responseData = await AxiosRequest({
      url: requestUrl,
      method: 'PUT',
      body: body,
      token: props?.authToken,
    })

    // teacher의 방송종료에 의해 sendbird chat이 freeze 되었음을 알기 위한 isChatFreezed 추가
    setChatData({ ...chatData, isChatFreezed: true })
  }

  // userInfomation의 정보가 갱신되어야 하고, streamInfomation으로 LIVE 중인지 아닌지를 판단해야 함
  useEffect(() => {
    const liveStartDate = new Date(classData?.start_date)
    const liveEndDateAfterTwoHours = new Date(classData?.end_date + 7200000)

    // 현재 시간 기준으로 end_date + 2시간이 (총 4시간) 지나면, ivs 영역 비활성화 + chat 영역 비활성화
    if (nowTime >= liveStartDate && nowTime > liveEndDateAfterTwoHours) {
      setIvsPlayStatus('end')
    } else {
      initVideo()
    }
  }, [props?.playbackUrl, nowTime, classData])

  useEffect(() => {
    if (typeof ivsPlayer !== 'undefined') {
      setVideoStatusScreenHeight(ivsPlayer.current?.offsetHeight)
    }
  }, [offsetX])

  const getChannelData = async () => {
    const requestUrl = `/classroom/${userInfomation.classId}/ivs/key`

    const body = {
      expiration: 14400,
    }

    // ivs player를 재생할 수 있는 user의 전용 token을 받아오는 request
    const responseData = await AxiosRequest({
      url: requestUrl,
      method: 'POST',
      body: body,
      token: props?.authToken,
    })

    // user의 전용 token을 받아온 뒤, token을 파라미터로 전달하여 initVideo 호출
    return responseData
  }

  const initVideo = async () => {
    if (typeof props?.playbackUrl !== 'undefined') {
      // Bail if already initialized
      if (init) return

      // Bail if IVS sdk is not loaded
      const { IVSPlayer } = window

      if (typeof IVSPlayer === 'undefined') return

      // Bail if player is not supported
      if (!IVSPlayer.isPlayerSupported) return

      // get user's token for ivs play
      const { token } = await getChannelData()

      // get playbackUrl in channelData
      const playbackUrl = props.playbackUrl + `?token=${token}`

      const player = IVSPlayer.create()

      player.addEventListener(IVSPlayer.PlayerState.IDLE, () => {
        // user가 정지 버튼을 누르거나 재생바를 건드리면 ivs player가 멈추는 현상 때문에 조건문 분기 처리
        if (player.isPaused()) {
          player.load(playbackUrl)
          player.play()
          setIvsPlayStatus('play')
        } else {
          // user가 정지버튼을 누르지 않았음에도, 영상 송출 자체에 버퍼링이 걸렸을 때
          setIvsPlayStatus('waiting')
          setVideoStatusScreenHeight(ivsPlayer.current?.offsetHeight)
        }
      })

      player.addEventListener(IVSPlayer.PlayerState.READY, () => {
        setIvsPlayStatus('waiting')
        setVideoStatusScreenHeight(ivsPlayer.current?.offsetHeight)
      })

      player.addEventListener(IVSPlayer.PlayerState.BUFFERING, () => {
        setIvsPlayStatus('error')
        setVideoStatusScreenHeight(ivsPlayer.current?.offsetHeight)
      })

      player.addEventListener(IVSPlayer.PlayerState.PLAYING, () => {
        setIvsPlayStatus('play')
        setStreamInfomation('LIVE-ON')
      })

      player.addEventListener(IVSPlayer.PlayerState.ENDED, () => {
        setIvsPlayStatus('fast-end')
        setStreamInfomation('LIVE-OFF')
        setVideoStatusScreenHeight(ivsPlayer.current?.offsetHeight)

        if (props.userRole !== 'learner') {
          controlFreezeChat()
        }
      })

      // Handle embedded metadata events
      player.addEventListener(
        IVSPlayer.PlayerEventType.TEXT_METADATA_CUE,
        (cue: any) => {
          // const type = cue.text
          const { text: json } = cue
          const { type, message } = JSON.parse(json)

          switch (type) {
            case 'ANNOUNCEMENT':
              // addAnnouncement(message)
              break
            case 'QUESTION':
              // addQuestion(message)
              break
            case 'RESOLVE_QUESTION':
              // resolveQuestion(message)
              break
            case 'REACTION':
              addReaction(message)
              break
            case 'TIMER':
              // setTimer(message)
              break
          }

          /*
          setMessages((msgs) => [
            ...msgs,
            {
              id: startTime,
              message,
            },
          ]);
          */
        }
      )

      // ivs player의 초기 호출 시 or teacher가 OBS 방송 중이 아닐 시의 케이스
      player.addEventListener(IVSPlayer.PlayerEventType.ERROR, (error: any) => {
        const { type = null } = error

        const liveStartDate = new Date(classData?.start_date)
        const liveEndDateAfterTwoHours = new Date(classData?.end_date + 7200000)

        switch (type) {
          case 'ErrorNoSource':
          case 'ErrorNetworkIO':
            setIvsPlayStatus('error')
            setVideoStatusScreenHeight(ivsPlayer.current?.offsetHeight)

          case 'ErrorNotAvailable':
            if (nowTime > liveStartDate && nowTime < liveEndDateAfterTwoHours) {
              // 현재 시간 기준으로 start_date가 지났는데도 OBS 방송이 켜져 있지 않을 때 waiting 준비 화면 세팅
              setIvsPlayStatus('waiting')
            }

            window.setTimeout(() => {
              player.load(playbackUrl)
              player.play()
            }, 5000)

            break
        }
      })

      player.attachHTMLVideoElement(ivsPlayer.current)

      player.load(playbackUrl)

      setIvsPlayStatus('play')

      player.play()

      setInit(true)
    }
  }

  return (
    <>
      <video src='' ref={ivsPlayer} playsInline controls={true}></video>
      {/* <Messages messages={messages} /> */}
    </>
  )
}

export default Video
