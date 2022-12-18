import dynamic from 'next/dynamic'

const Chat = dynamic(() => import('../components/Chat'), {
  ssr: false,
  loading: () => <div>Loading...</div>,
})

const TeacherChatWidget = () => {
  return (
    <div className='teacher-chat-widget'>
      {/* <h3>
        <span>강의실 채팅</span>

        <button type='button'>
          <img
            src='/components/teacher-chat-widget/members.svg'
            alt='Members'
          />
        </button>
      </h3> */}

      <Chat userId='teacher' />
    </div>
  )
}

export default TeacherChatWidget
