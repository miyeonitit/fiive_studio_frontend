import React from 'react'

type props = {
  topHeight: string
  rightWidth: string
  tooltipText: string
  width?: string
}

const MessageTooltip = (props: props) => {
  const tooltipStyle = {
    top: `${props.topHeight}px`,
    right: `${props.rightWidth}px`,
    width: `${props.width}px`,
  }

  return (
    <div className='MessageTooltip'>
      <div
        className={`message_infomation_tooltip ${
          props.tooltipText === '삭제' && 'delete'
        }`}
        style={tooltipStyle}
      >
        {props.tooltipText}
      </div>
    </div>
  )
}

export default MessageTooltip
