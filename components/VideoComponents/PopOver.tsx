import React from 'react'
import { Dispatch, SetStateAction } from 'react'
import Image from 'next/image'

type props = {
  liveStatusObject: {
    title_text: string
    first_sub_text: string
    second_sub_text: string
  }

  setIsLiveEndPopOver: Dispatch<SetStateAction<boolean>>
}

const PopOver = (props: props) => {
  const { liveStatusObject } = props

  return (
    <div className='PopOver'>
      <div className='popover_wrapper'>
        <div className='popover_title_box'>
          <div className='popover_title_text'>
            {liveStatusObject.title_text}
          </div>
          <div
            className='popover_close_button'
            onClick={() => props.setIsLiveEndPopOver(false)}
          >
            <Image
              src='../layouts/fiive/popover_close_button.svg'
              width={12}
              height={12}
              alt='closeButton'
            />
          </div>
        </div>

        <div className='popover_description_box'>
          {liveStatusObject.first_sub_text}
          <br />
          {liveStatusObject.second_sub_text}
        </div>
      </div>
    </div>
  )
}

export default PopOver
