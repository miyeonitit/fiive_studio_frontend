import React, { useState } from 'react'
import Image from 'next/image'

import useStore from '../store/video'
// import { CSSTransitionGroup } from 'react-transition-group'
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup'

const Reactions = (props: any) => {
  const reactions = useStore((state: any) => state.reactions)
  const addReaction = useStore((state: any) => state.addREaction)
  const removeReaction = useStore((state: any) => state.removeReaction)

  const [isSwitchAnimation, setIsSwitchAnimation] = useState(false)

  const reaction = (type: string) => {
    let img

    switch (type) {
      case 'THUMBS_UP':
        img = (
          <Image
            src='../components/live-reaction-emoji/thumbs_up.png'
            width={20}
            height={20}
            alt='THUMBS_UP'
          />
        )
        break
      case 'HEART':
        img = (
          <Image
            src='../components/live-reaction-emoji/heart.png'
            width={20}
            height={20}
            alt='HEART'
          />
        )
        break
      case 'FIRE':
        img = (
          <Image
            src='../components/live-reaction-emoji/fire.png'
            width={20}
            height={20}
            alt='FIRE'
          />
        )
        break
      case 'CLAP':
        img = (
          <Image
            src='../components/live-reaction-emoji/clap.png'
            width={20}
            height={20}
            alt='CLAP'
          />
        )
        break
      case 'SMILE':
        img = (
          <Image
            src='../components/live-reaction-emoji/smile_face.png'
            width={20}
            height={20}
            alt='SMILE'
          />
        )
        break
      case 'GRINNING':
        img = (
          <Image
            src='../components/live-reaction-emoji/grinning_face.png'
            width={20}
            height={20}
            alt='GRINNING'
          />
        )
        break
      case 'CRY':
        img = (
          <Image
            src='../components/live-reaction-emoji/crying_face.png'
            width={20}
            height={20}
            alt='CRY'
          />
        )
        break
    }

    return img
  }

  console.log(isSwitchAnimation, 'isSwitchAnimation')

  const items = reactions.map((item: any) => {
    const swarm = []

    for (let number = 1; number <= 1; number++) {
      const bottom = Math.floor(Math.random() * 400)
      swarm.push({
        key: `${item.id}-${number}`,
        type: item.type,
        style: {
          // top: '150px',
          // left: `${bottom}px`,
          // bottom: `-${bottom}px`,
        },
      })
    }

    return swarm.map((item: any) => (
      <div className='item' style={item.style} key={item.key}>
        {reaction(item.type)}
      </div>
    ))
  })

  return (
    <div className='reactions-component'>
      <CSSTransitionGroup
        unmountOnLeave
        transitionName='example'
        transitionEnterTimeout={2000}
        transitionLeaveTimeout={2000}
        onEnter={() => setIsSwitchAnimation(true)}
        onExited={() => setIsSwitchAnimation(true)}
      >
        {items}
      </CSSTransitionGroup>
    </div>
  )
}

export default Reactions
