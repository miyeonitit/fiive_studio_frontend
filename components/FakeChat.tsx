import React from 'react'
import Image from 'next/image'
import { CSSProperties } from 'styled-components'

import fiiveStudioUseStore from '../store/FiiveStudio'

type props = {
  status: string
  chatHeightStyle?: CSSProperties
}

const FakeChat = (props: props) => {
  // sendbird Chat close 동작을 위한 toggle boolean state
  const setIsChatOpen = fiiveStudioUseStore((state: any) => state.setIsChatOpen)

  return (
    <div className='FakeChat'>
      <div className='fake_chat_wrapper' style={props?.chatHeightStyle}>
        {props.status !== 'loading' && (
          <div className='fake_chat_header'>
            <div className='chat_title_box'>실시간 채팅</div>
            <div
              className='close_button_box'
              onClick={() => setIsChatOpen(false)}
            >
              <Image
                src='/pages/Sendbird/responsive_close_button.svg'
                width={20}
                height={20}
                alt='closeButton'
              />
            </div>
          </div>
        )}

        <div
          className={`fake_chat_body ${
            props.status === 'loading' && 'loading'
          }`}
        >
          {props.status === 'loading' ? (
            <>
              <div className='fake_chat_header'>
                <div className='chat_title_box'>실시간 채팅</div>
                <div
                  className='close_button_box'
                  onClick={() => setIsChatOpen(false)}
                >
                  <div className='chat_the_menu_box'>
                    <div className='more_button_box'>
                      <Image
                        src='/pages/Sendbird/more_button.svg'
                        width={20}
                        height={20}
                        alt='moreButton'
                      />
                    </div>

                    <div className='close_button_box'>
                      <Image
                        src='/pages/Sendbird/responsive_close_button.svg'
                        width={20}
                        height={20}
                        alt='closeButton'
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className='fake_UI_box'>
                <div className='fake_chat_profile_image_box'> </div>
                <div className='fake_chat_contents_box'>
                  <div className='fake_title_box'> </div>
                  <div className='fake_contents_box'> </div>
                </div>
              </div>
              <div className='fake_UI_box'>
                <div className='fake_chat_profile_image_box'> </div>
                <div className='fake_chat_contents_box'>
                  <div className='fake_title_box'> </div>
                  <div className='fake_contents_box'> </div>
                </div>
              </div>
              <div className='fake_UI_box'>
                <div className='fake_chat_profile_image_box'> </div>
                <div className='fake_chat_contents_box'>
                  <div className='fake_title_box'> </div>
                  <div className='fake_contents_box'> </div>
                </div>
              </div>
              <div className='fake_UI_box'>
                <div className='fake_chat_profile_image_box'> </div>
                <div className='fake_chat_contents_box'>
                  <div className='fake_title_box'> </div>
                  <div className='fake_contents_box'> </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className='fake_chat_image_box'>
                <img
                  src='/components/fake-chat/chat_status_live_end.png'
                  alt='fakeChatImage'
                />
              </div>
              <div className='fake_chat_text_box'>
                라이브 종료 후에는 <br />
                채팅을 볼 수 없어요.
              </div>
            </>
          )}
        </div>

        <div className='fake_chat_footer'>
          <input
            type='text'
            placeholder={
              props.status === 'loading' ? '' : '메시지를 보낼 수 없어요.'
            }
            disabled
          />
          <div className='fake_chat_send_button_box'>
            <Image
              className='fake_chat_send_button'
              src='/pages/Sendbird/non_active_send_message_icon.svg'
              width={24}
              height={24}
              alt='fake_chat_send_button'
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default FakeChat
