import useStore from '../store/video'
import { v4 as uuidv4 } from 'uuid'

import AxiosRequest from '../utils/AxiosRequest'
import classRoomUseStore from '../store/classRoom'

interface props {
  toggle: () => void
}

const SubmitReaction = (props: props) => {
  const channel = useStore((state: any) => state.channel)

  // ivs, sendbird chat infomation 정보를 저장하는 state
  const ivsData = classRoomUseStore((state: any) => state.ivsData)

  const testIvsValue = process.env.NEXT_PUBLIC_TEST_IVS_CHANNEL_VALUE

  const embedMetadata = async (type: string) => {
    const requestUrl = `/classroom/${testIvsValue}/ivs/meta`

    const body = {
      arn: ivsData?.arn,
      metadata: JSON.stringify({
        type: 'REACTION',
        message: {
          id: uuidv4(),
          type: type,
        },
      }),
    }

    const responseData = await AxiosRequest({
      url: requestUrl,
      method: 'POST',
      body: body,
      token: '',
    })
  }

  return (
    <div className='submit-reaction'>
      <button
        onClick={() => {
          embedMetadata('LIKE')
        }}
        type='button'
      >
        <img src='/components/submit-reaction/like.v2.svg' alt='Like' />
      </button>

      <button
        onClick={() => {
          embedMetadata('HEART')
        }}
        type='button'
      >
        <img src='/components/submit-reaction/heart.v2.svg' alt='Heart' />
      </button>

      <button
        onClick={() => {
          embedMetadata('LIT')
        }}
        type='button'
      >
        <img src='/components/submit-reaction/lit.v2.svg' alt='Lit' />
      </button>

      <button
        onClick={() => {
          embedMetadata('SMILE')
        }}
        type='button'
      >
        <img src='/components/submit-reaction/smile.v2.svg' alt='Smile' />
      </button>

      <button
        onClick={() => {
          embedMetadata('SHAKE')
        }}
        type='button'
      >
        <img src='/components/submit-reaction/shake.v2.svg' alt='Shake' />
      </button>

      <button
        onClick={() => {
          embedMetadata('FANFARE')
        }}
        type='button'
      >
        <img src='/components/submit-reaction/fanfare.v2.svg' alt='Fanfare' />
      </button>
    </div>
  )
}

export default SubmitReaction
