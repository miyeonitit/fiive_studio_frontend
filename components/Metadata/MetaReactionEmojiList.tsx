import React, { useState, useEffect, useRef, RefObject } from 'react'
import { v4 as uuidv4 } from 'uuid'
import Lottie from 'lottie-web'

import AxiosRequest from '../../utils/AxiosRequest'
import classRoomUseStore from '../../store/classRoom'

type props = {
  emojiListRef: RefObject<HTMLDivElement>
  setIsOpenEmojiList: React.Dispatch<React.SetStateAction<boolean>>
}

const MetaReactionEmojiList = (props: props) => {
  // ivs, sendbird chat infomation 정보를 저장하는 state
  const ivsData = classRoomUseStore((state: any) => state.ivsData)

  const thumbsUpRef = useRef<HTMLDivElement>(null)
  const heartRef = useRef<HTMLDivElement>(null)
  const fireRef = useRef<HTMLDivElement>(null)
  const clappingRef = useRef<HTMLDivElement>(null)
  const smilingRef = useRef<HTMLDivElement>(null)
  const grinningRef = useRef<HTMLDivElement>(null)
  const cryingRef = useRef<HTMLDivElement>(null)

  const testIvsValue = process.env.NEXT_PUBLIC_TEST_IVS_CHANNEL_VALUE

  const postReaction = async (reaction: string) => {
    const requestUrl = `/classroom/${testIvsValue}/ivs/meta`

    const body = {
      arn: ivsData?.arn,
      metadata: JSON.stringify({
        type: 'REACTION',
        message: {
          id: uuidv4(),
          type: reaction,
        },
      }),
    }

    const responseData = await AxiosRequest({
      url: requestUrl,
      method: 'POST',
      body: body,
      token: '',
    })

    props.setIsOpenEmojiList(false)
  }

  useEffect(() => {
    Lottie.loadAnimation({
      container: thumbsUpRef.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: require('../../public/components/reaction-emoji/thumbs_up.json'),
    })

    Lottie.loadAnimation({
      container: heartRef.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: require('../../public/components/reaction-emoji/heart.json'),
    })

    Lottie.loadAnimation({
      container: fireRef.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: require('../../public/components/reaction-emoji/fire.json'),
    })

    Lottie.loadAnimation({
      container: clappingRef.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: require('../../public/components/reaction-emoji/clapping_hands.json'),
    })

    Lottie.loadAnimation({
      container: smilingRef.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: require('../../public/components/reaction-emoji/face_with_open_mouth.json'),
    })

    Lottie.loadAnimation({
      container: grinningRef.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: require('../../public/components/reaction-emoji/grinning_face.json'),
    })

    Lottie.loadAnimation({
      container: cryingRef.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: require('../../public/components/reaction-emoji/loudly_crying_face.json'),
    })
  }, [])

  return (
    <div className='MetaReactionEmojiList' ref={props.emojiListRef}>
      <div className='reaction_emoji_wrapper'>
        <div className='reaction_emoji_box'>
          <div
            className='thumbs_up'
            ref={thumbsUpRef}
            onClick={() => postReaction('THUMBS_UP')}
          />
          <div
            className='heart'
            ref={heartRef}
            onClick={() => postReaction('HEART')}
          />
          <div
            className='fire'
            ref={fireRef}
            onClick={() => postReaction('FIRE')}
          />
          <div
            className='clapping'
            ref={clappingRef}
            onClick={() => postReaction('CLAP')}
          />
          <div
            className='smiling'
            ref={smilingRef}
            onClick={() => postReaction('SMILE')}
          />
          <div
            className='grinning'
            ref={grinningRef}
            onClick={() => postReaction('GRINNING')}
          />
          <div
            className='crying'
            ref={cryingRef}
            onClick={() => postReaction('CRY')}
          />
        </div>
      </div>
    </div>
  )
}

export default MetaReactionEmojiList
