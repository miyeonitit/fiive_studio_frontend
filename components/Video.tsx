import React, { useRef, useEffect, useState } from 'react'

import videoUseStore from '../store/video'
import classRoomUseStore from '../store/classRoom'
import fiiveStudioUseStore from '../store/FiiveStudio'

import AxiosRequest from '../utils/AxiosRequest'

// import Messages from "../components/Messages";

type props = {
  authToken: string
  playbackUrl: string
  classId: string
}

const Video = (props: props) => {
  const channel = videoUseStore((state: any) => state.channel)
  const setChannel = videoUseStore((state: any) => state.setChannel)

  const addAnnouncement = videoUseStore((state: any) => state.addAnnouncement)

  const addQuestion = videoUseStore((state: any) => state.addQuestion)
  const resolveQuestion = videoUseStore((state: any) => state.resolveQuestion)

  const addReaction = videoUseStore((state: any) => state.addReaction)

  const setTimer = videoUseStore((state: any) => state.setTimer)

  // user infomation state
  const userInfomation = fiiveStudioUseStore(
    (state: any) => state.userInfomation
  )

  // ivs Player status 상태 표현 state
  const ivsPlayStatus = fiiveStudioUseStore((state: any) => state.ivsPlayStatus)
  const setIvsPlayStatus = fiiveStudioUseStore(
    (state: any) => state.setIvsPlayStatus
  )

  // console.log(props, 'video props')
  const [init, setInit] = useState(false)
  // const [messages, setMessages] = useState<any[]>([]);

  const ivsPlayer = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (Object.keys(userInfomation).length !== 0 && ivsPlayStatus !== 'play') {
      initVideo()
    }
  }, [userInfomation])

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
    // Bail if already initialized
    if (init) return

    // Bail if IVS sdk is not loaded
    const { IVSPlayer } = window

    if (typeof IVSPlayer === 'undefined') return

    // Bail if player is not supported
    if (!IVSPlayer.isPlayerSupported) return

    // get user's token for ivs play
    const { token } = await getChannelData()

    console.log(token, '1 token')

    // get playbackUrl in channelData
    const playbackUrl = props.playbackUrl + `?token=${token}`

    console.log(playbackUrl, '2 playbackUrl')

    const player = IVSPlayer.create()

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
            console.log('reaction post success')
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

    player.addEventListener(IVSPlayer.PlayerEventType.ERROR, (error: any) => {
      const { type = null } = error

      switch (type) {
        case 'ErrorNoSource':
        case 'ErrorNetworkIO':
        case 'ErrorNotAvailable':
          setIvsPlayStatus('error')

          window.setTimeout(() => {
            player.load(playbackUrl)
            player.play()
          }, 5000)

          setIvsPlayStatus('play')
          break
      }
    })
    player.attachHTMLVideoElement(ivsPlayer.current)

    player.load(playbackUrl)

    setIvsPlayStatus('play')

    player.play()

    setInit(true)
  }

  return (
    <>
      <video src='' ref={ivsPlayer} playsInline controls={true}></video>
      {/* <Messages messages={messages} /> */}
    </>
  )
}

export default Video
