import React, { useState } from 'react'

import DateSeparator from '@sendbird/uikit-react/ui/DateSeparator'

import useStore from '../../store/Sendbird'

const CustomDateSeparator = () => {
  const messageInfomation = useStore((state: any) => state.message)

  const formatDateTime = (date: number) => {
    const dateTime = new Date(date)

    const year = dateTime.getFullYear()
    const month = `0${dateTime.getMonth() + 1}`.slice(-2)
    const day = `0${dateTime.getDate()}`.slice(-2)

    return `${year}년 ${month}월 ${day}일`
  }

  return (
    <div className='CustomDateSeparator'>
      <DateSeparator className='date_separator'>
        {formatDateTime(messageInfomation?.createdAt)}
      </DateSeparator>
    </div>
  )
}

export default CustomDateSeparator
