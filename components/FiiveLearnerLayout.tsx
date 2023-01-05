import Image from 'next/image'

import fiiveStudioUseStore from '../store/FiiveStudio'

const FiiveLayout = (props: any) => {
  const { children } = props

  // 반응형 미디어쿼리 스타일 지정을 위한 브라우저 넓이 측정 전역 state
  const offsetX = fiiveStudioUseStore((state: any) => state.offsetX)

  return (
    <div className='fiive_layout learner_layout'>
      <header className='layout_header'>
        <div className='left_header_box'>
          {offsetX < 1023 ? (
            <div className='back_button_box'>
              <Image
                src='../layouts/fiive/arrow_back.svg'
                width={20}
                height={20}
                alt='backButton'
              />
            </div>
          ) : (
            <>
              {/* fiive logo image 영역 */}
              <div className='fiive_logo_box'>
                <Image
                  src='../layouts/fiive/logo.svg'
                  width={50}
                  height={30}
                  alt='fiiveLogoImage'
                />
              </div>

              {/* logo image 영역과 class 정보를 구별하는 devider 영역 */}
              <div className='devider_box'>
                <Image
                  src='../layouts/fiive/gray_bar.svg'
                  width={1}
                  height={24}
                  alt='devider'
                />
              </div>
            </>
          )}

          {/* class 정보 영역 */}
          <div className='fiive_class_infomation_box'>
            <div className='teacher_profile_image_box'>
              <Image
                src='../layouts/fiive/Avatar.svg'
                width={32}
                height={32}
                alt='teacherProfileImage'
              />
            </div>

            <div className='teacher_name_box'>미친국어T</div>
          </div>
        </div>

        <div className='right_header_box'>
          {/* LIVE 상태 정보 영역 */}
          <div className='live_status'>LIVE 준비 중</div>

          {/* 현재 라이브 참여자 수 영역 */}
          <div className='live_participant_number_box'>
            <Image
              src='../layouts/fiive/live_participant.svg'
              width={12}
              height={12}
              alt='liveParticipant'
            />
            <span className='live_participant_number'>2</span>
          </div>
        </div>

        {/* 
        <div className='controls'>
          <button type='button' className='notifications'>
            <img
              src='/layouts/fiive/notifications_outlined.svg'
              alt='Notifications'
            />

            <span className='count'>99+</span>
          </button>

          <button type='button' className='account'>
            <img
              src='/layouts/fiive/Avatar.svg'
              alt='Profile'
              className='profile'
            />
            <img
              src='/layouts/fiive/chevron_down_btn.svg'
              alt='Expand'
              className='expand'
            />
          </button>
        </div> */}
      </header>

      <div className='layout-body'>{children}</div>

      <footer className='layout-footer'></footer>
    </div>
  )
}

export default FiiveLayout
