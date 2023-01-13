import React, { useRef, useEffect, useState } from 'react'
import axios from 'axios'

// import Messages from "../components/Messages";
import videoUseStore from '../store/video'

type props = {
  playbackUrl: string
}

const Video = (props: props) => {
  const channel = videoUseStore((state: any) => state.channel)
  const setChannel = videoUseStore((state: any) => state.setChannel)

  const addAnnouncement = videoUseStore((state: any) => state.addAnnouncement)

  const addQuestion = videoUseStore((state: any) => state.addQuestion)
  const resolveQuestion = videoUseStore((state: any) => state.resolveQuestion)

  const addReaction = videoUseStore((state: any) => state.addReaction)

  const setTimer = videoUseStore((state: any) => state.setTimer)

  const [init, setInit] = useState(false)
  // const [messages, setMessages] = useState<any[]>([]);

  const ivsPlayer = useRef<HTMLVideoElement>(null)

  const ApiStudio = process.env.NEXT_PUBLIC_API_BASE_URL
  const testIvsValue = process.env.NEXT_PUBLIC_TEST_IVS_CHANNEL_VALUE
  const testIvsToken = process.env.NEXT_PUBLIC_TEST_IVS_TOKEN

  useEffect(() => {
    if (typeof props.playbackUrl !== 'undefined') {
      initVideo()
    }
  }, [props.playbackUrl])

  const getChannelData = async () => {
    let channelData = ''

    await axios
      .get(`${ApiStudio}/classroom/${testIvsValue}/ivs`)
      .then((response) => {
        channelData = response.data
      })

    return channelData
  }

  const initVideo = async () => {
    // Bail if already initialized
    if (init) return

    // Bail if IVS sdk is not loaded
    const { IVSPlayer } = window
    if (typeof IVSPlayer === 'undefined') return

    // Bail if player is not supported
    if (!IVSPlayer.isPlayerSupported) return

    // // get ivs channel data
    // const channelData = await getChannelData()

    // 리턴된 channelData를 전역적으로 저장
    // setChannel(channelData)

    // get playbackUrl in channelData
    // const playbackUrl = channelData?.channel?.playbackUrl

    const playbackUrl = props.playbackUrl + `?token=${testIvsToken}`

    const player = IVSPlayer.create()

    // Handle embedded metadata events
    player.addEventListener(
      IVSPlayer.PlayerEventType.TEXT_METADATA_CUE,
      (cue: any) => {
        const type = cue.text
        console.log(cue, 'get cue data')

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
            // addReaction(message)
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
        case 'ErrorNotAvailable':
          window.setTimeout(() => {
            player.load(playbackUrl)
            player.play()
          }, 5000)
          break
      }
    })

    player.attachHTMLVideoElement(ivsPlayer.current)

    player.load(playbackUrl)

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
