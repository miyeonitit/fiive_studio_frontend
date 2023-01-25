import React, { useRef, useEffect, useState } from 'react'

import videoUseStore from '../store/video'
import classRoomUseStore from '../store/classRoom'
import fiiveStudioUseStore from '../store/FiiveStudio'

import AxiosRequest from '../utils/AxiosRequest'

// import Messages from "../components/Messages";

const Video = (props) => {
  const { ivsData } = props
  const channel = videoUseStore((state: any) => state.channel)
  const setChannel = videoUseStore((state: any) => state.setChannel)

  const addAnnouncement = videoUseStore((state: any) => state.addAnnouncement)

  const addQuestion = videoUseStore((state: any) => state.addQuestion)
  const resolveQuestion = videoUseStore((state: any) => state.resolveQuestion)

  const addReaction = videoUseStore((state: any) => state.addReaction)

  const setTimer = videoUseStore((state: any) => state.setTimer)

  // ivs Player status 상태 표현 state
  const ivsPlayStatus = fiiveStudioUseStore((state: any) => state.ivsPlayStatus)
  const setIvsPlayStatus = fiiveStudioUseStore(
    (state: any) => state.setIvsPlayStatus
  )

  const [init, setInit] = useState(false)
  // const [messages, setMessages] = useState<any[]>([]);

  const ivsPlayer = useRef<HTMLVideoElement>(null)

  const testIvsValue = process.env.NEXT_PUBLIC_TEST_IVS_CHANNEL_VALUE

  useEffect(() => {
    initVideo()
  }, [props.playbackUrl])

  const getChannelData = async () => {
    const requestUrl = `/classroom/${testIvsValue}/ivs/key`

    const body = {
      expiration: 14400,
    }

    // ivs player를 재생할 수 있는 user의 전용 token을 받아오는 request
    const responseData = await AxiosRequest({
      url: requestUrl,
      method: 'POST',
      body: body,
      token: '',
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

    // get playbackUrl in channelData
    const playbackUrl = props.playbackUrl + `?token=${token}`

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

      setIvsPlayStatus('error')

      switch (type) {
        case 'ErrorNoSource':
        case 'ErrorNotAvailable':
          window.setTimeout(() => {
            player.load(playbackUrl)
            player.play()
            setIvsPlayStatus('play')
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

  return (
    <>
      <video src='' ref={ivsPlayer} playsInline controls={true}></video>
      {/* <Messages messages={messages} /> */}
    </>
  )
}

export default Video
