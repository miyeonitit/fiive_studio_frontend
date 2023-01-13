import React, { useState, useEffect, useRef, RefObject } from 'react'
import Lottie from 'lottie-web'

type props = {
  emojiListRef: RefObject<HTMLDivElement>
  setIsOpenEmojiList: React.Dispatch<React.SetStateAction<boolean>>
}

const MetaReactionEmojiList = (props: props) => {
  const thumbsUpRef = useRef<HTMLDivElement>(null)
  const heartRef = useRef<HTMLDivElement>(null)
  const fireRef = useRef<HTMLDivElement>(null)
  const clappingRef = useRef<HTMLDivElement>(null)
  const smilingRef = useRef<HTMLDivElement>(null)
  const grinningRef = useRef<HTMLDivElement>(null)
  const cryingRef = useRef<HTMLDivElement>(null)

  const closeEmojiList = () => {
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
            onClick={() => closeEmojiList()}
          />
          <div
            className='heart'
            ref={heartRef}
            onClick={() => closeEmojiList()}
          />
          <div
            className='fire'
            ref={fireRef}
            onClick={() => closeEmojiList()}
          />
          <div
            className='clapping'
            ref={clappingRef}
            onClick={() => closeEmojiList()}
          />
          <div
            className='smiling'
            ref={smilingRef}
            onClick={() => closeEmojiList()}
          />
          <div
            className='grinning'
            ref={grinningRef}
            onClick={() => closeEmojiList()}
          />
          <div
            className='crying'
            ref={cryingRef}
            onClick={() => closeEmojiList()}
          />
        </div>
      </div>
    </div>
  )
}

export default MetaReactionEmojiList
