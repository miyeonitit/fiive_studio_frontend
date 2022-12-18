import React, { useState, useEffect } from 'react'

import DateSeparator from '@sendbird/uikit-react/ui/DateSeparator'
import { useChannelContext } from '@sendbird/uikit-react/Channel/context'

import useStore from '../../store/Sendbird'

const CustomDateSeparator = (props) => {
  const messageInfomation = useStore((state: any) => state.message)

  const channelInfomation = useChannelContext()

  const [allMessages, setAllMessages] = useState(channelInfomation.allMessages)

  const compareMessageDate = (date: number) => {
    const dateTime = new Date(date)

    const day = `0${dateTime.getDate()}`.slice(-2)

    return day
  }

  const formatDateTime = (date: number) => {
    const dateTime = new Date(date)

    const year = dateTime.getFullYear()
    const month = `0${dateTime.getMonth() + 1}`.slice(-2)
    const day = `0${dateTime.getDate()}`.slice(-2)

    return `${year}년 ${month}월 ${day}일`
  }

  useEffect(() => {
    if (messageInfomation) {
      if (
        compareMessageDate(allMessages[allMessages.length - 1].createdAt) !==
        compareMessageDate(allMessages[allMessages.length - 2].createdAt)
      ) {
        console.log('삑')
      }
    }
  }, [allMessages, messageInfomation])

  console.log(channelInfomation, '후하하')

  return (
    <div className='CustomDateSeparator'>
      <DateSeparator className='date_separator'>
        {/* {/* {formatDateTime(messageInfomation?.createdAt)} */}
      </DateSeparator>
    </div>
  )
}

export default CustomDateSeparator
