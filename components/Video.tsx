import React, { useRef, useEffect, useState } from 'react'
// import Messages from "../components/Messages";
import useStore from '../store/video'

const Video = () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
  const ivsPlayer = useRef<HTMLVideoElement>(null)
  const [init, setInit] = useState(false)
  // const [messages, setMessages] = useState<any[]>([]);

  const setChannel = useStore((state: any) => state.setChannel)

  const addAnnouncement = useStore((state: any) => state.addAnnouncement)

  const addQuestion = useStore((state: any) => state.addQuestion)
  const resolveQuestion = useStore((state: any) => state.resolveQuestion)

  const addReaction = useStore((state: any) => state.addReaction)

  const setTimer = useStore((state: any) => state.setTimer)

  const ApiStudio = process.env.NEXT_PUBLIC_API_BASE_URL

  useEffect(() => {
    initVideo()
  })

  const fetchChannels = async () => {
    const resp = await fetch(`${ApiStudio}/channel`, {
      method: 'GET',
    })

    const { channels = [] } = await resp.json()

    // authrozied - true : 비밀채널 <> false : 공개채널
    const channel = channels.find((item: any) => {
      return !item.authrozied
    })

    return channel
  }

  const fetchChannel = async (arn: string) => {
    const params = new URLSearchParams({
      arn,
    })

    const resp = await fetch(`${baseUrl}/channel?arn=${params}`, {
      method: 'GET',
    })

    const { channel = null } = await resp.json()

    setChannel(channel)
    return channel
  }

  const initVideo = async () => {
    // Bail if already initialized
    if (init) return

    // Bail if IVS sdk is not loaded
    const { IVSPlayer } = window
    if (typeof IVSPlayer === 'undefined') return

    // Bail if player is not supported
    if (!IVSPlayer.isPlayerSupported) return

    const { arn } = await fetchChannels()
    const { playbackUrl } = await fetchChannel(arn)

    // local 환경에서는 test playbackUrl을 이용
    const testPlaybackUrl = process.env.NEXT_PUBLIC_TEST_PLAYBACK_URL

    const player = IVSPlayer.create()

    // Handle embedded metadata events
    player.addEventListener(
      IVSPlayer.PlayerEventType.TEXT_METADATA_CUE,
      (cue: any) => {
        const { text: json, startTime } = cue
        const { type, message } = JSON.parse(json)

        switch (type) {
          case 'ANNOUNCEMENT':
            addAnnouncement(message)
            break
          case 'QUESTION':
            addQuestion(message)
            break
          case 'RESOLVE_QUESTION':
            resolveQuestion(message)
            break
          case 'REACTION':
            addReaction(message)
            break
          case 'TIMER':
            setTimer(message)
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

    // local 환경에서는 test playbackUrl을 이용
    player.load(
      process.env.NODE_ENV === 'development' ? testPlaybackUrl : playbackUrl
    )

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
