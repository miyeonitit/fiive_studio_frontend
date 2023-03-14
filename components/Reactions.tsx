import React, { useState, useEffect } from 'react'
import Image from 'next/image'

import useStore from '../store/video'
// import { CSSTransitionGroup } from 'react-transition-group'
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup'

const Reactions = (props: any) => {
  const reactions = useStore((state: any) => state.reactions)
  const addReaction = useStore((state: any) => state.addREaction)
  const removeReaction = useStore((state: any) => state.removeReaction)

  const reaction = (type: string) => {
    let img

    switch (type) {
      case 'THUMBS_UP':
        img = (
          <img
            src='/components/live-reaction-emoji/thumbs_up.png'
            alt='THUMBS_UP'
          />
        )
        break
      case 'HEART':
        img = (
          <img src='/components/live-reaction-emoji/heart.png' alt='HEART' />
        )
        break
      case 'FIRE':
        img = <img src='/components/live-reaction-emoji/fire.png' alt='FIRE' />
        break
      case 'CLAP':
        img = <img src='/components/live-reaction-emoji/clap.png' alt='CLAP' />
        break
      case 'SMILE':
        img = (
          <img
            src='/components/live-reaction-emoji/smile_face.png'
            alt='SMILE'
          />
        )
        break
      case 'GRINNING':
        img = (
          <img
            src='/components/live-reaction-emoji/grinning_face.png'
            alt='GRINNING'
          />
        )
        break
      case 'CRY':
        img = (
          <img
            src='/components/live-reaction-emoji/crying_face.png'
            alt='CRY'
          />
        )
        break
    }

    return img
  }

  const items = reactions.map((item: any) => {
    const swarm = []

    for (let number = 1; number <= 1; number++) {
      swarm.push({
        key: `${item.id}-${number}`,
        type: item.type,
        style: {
          top: '120px',
          left: `${item.random_value}px`,
        },
      })
    }

    return swarm.map((item: any) => (
      <div className='item' style={item.style} key={item.key}>
        {reaction(item.type)}
      </div>
    ))
    // dom으로 메서드 잡아서 2000초 뒤에 종료시키는 example-leave 클래스네임 집어넣을 생각중
  })

  // 애니메이션의 시작점에서는 애니메이션이 작동이 되지만(enter animation), 애니메이션의 종료점에서는 애니메이션 작동이 되지 않아(leave animation)
  // 종료 애니메이션이 작동되게끔, 애니메이션 작동 2000초 후에 종료 애니메이션의 className을 강제로 넣어주는 로직
  useEffect(() => {
    if (reactions.length !== 0) {
      // 1. 리액션 배열 중 마지막 요소를 잡는다.
      const lastReactionOrder =
        document.getElementsByClassName('item')[reactions.length - 1]

      // 2. 애니메이션 작동 2000초 후에 종료 애니메이션의 className을 강제로 넣어준다.
      setTimeout(() => {
        lastReactionOrder.classList.add('example-leave')
      }, 2000)

      setTimeout(() => {
        lastReactionOrder.classList.add('example-leave-active')
      }, 2500)
    }
  }, [reactions])

  return (
    <div className='reactions-component'>
      <CSSTransitionGroup
        transitionName='example'
        transitionEnterTimeout={2500}
        transitionLeaveTimeout={2500}
      >
        {items}
      </CSSTransitionGroup>
    </div>
  )
}

export default Reactions
