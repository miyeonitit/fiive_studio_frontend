import useStore from '../store/video'
import { v4 as uuidv4 } from 'uuid'

interface props {
  toggle: () => void
}

const SubmitReaction = (props: props) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
  const channel = useStore((state: any) => state.channel)

  const embedMetadata = async (type: string) => {
    if (channel === null) return

    const form = new URLSearchParams({
      arn: channel.arn,
      data: JSON.stringify({
        type: 'REACTION',
        message: {
          id: uuidv4(),
          type,
        },
      }),
    })

    const resp = await fetch(`${baseUrl}/channel/metadata`, {
      method: 'POST',
      body: form,
    })
    props.toggle()
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
