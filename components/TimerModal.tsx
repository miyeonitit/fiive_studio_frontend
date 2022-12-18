import { useState } from 'react'
import useStore from '../store/video'
import { v4 as uuidv4 } from 'uuid'

interface props {
  toggle: () => void
}

const TimerModal = (props: props) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
  const channel = useStore((state) => state.channel)

  const [metadata, setMetadata] = useState('')

  const embedMetadata = async (e) => {
    e.preventDefault()

    if (channel === null) return

    const format = /^\d{2}:\d{2}:\d{2}$/

    if (metadata.length && format.test(metadata)) {
      const [hours, minutes, seconds] = metadata.split(':')
      const secs =
        parseInt(hours, 10) * 60 * 60 +
        parseInt(minutes, 10) * 60 +
        parseInt(seconds, 10)

      const form = new URLSearchParams({
        arn: channel.arn,
        data: JSON.stringify({
          type: 'TIMER',
          message: {
            id: uuidv4(),
            duration: secs,
          },
        }),
      })

      const resp = await fetch(`${baseUrl}/channel/metadata`, {
        method: 'POST',
        body: form,
      })

      setMetadata('')
    }
    props.toggle()
  }

  return (
    <div className='timer-modal'>
      <div className='wrapper'>
        <form onSubmit={embedMetadata} action=''>
          <div className='form-group'>
            <input
              onInput={(e) => {
                const target = e.target as HTMLInputElement
                setMetadata(target.value)
              }}
              value={metadata}
              type='text'
              className='form-control mb-2'
              placeholder='00:00:00'
            />

            <button type='submit'>타이머 등록</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TimerModal
