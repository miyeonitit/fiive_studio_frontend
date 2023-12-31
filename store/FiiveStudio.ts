import create from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

interface FiiveStudioState {
  // 반응형 미디어쿼리 스타일 지정을 위한 브라우저 넓이 측정 state
  offsetX: number
  setOffsetX: (offsetX: number) => void

  // 반응형 전용 모달이 활성화 된 상태인지 확인하는 boolean state
  isOpenResponsiveModal: false
  setIsOpenResponsiveModal: (isOpenResponsiveModal: boolean) => void

  // 반응형 사이즈에서 header의 라이브 참여자 목록을 볼 때, UI height 버그를 처리하기 위해 확인하는 boolean state
  isOpenResponsiveLiveMember: false
  setIsOpenResponsiveLiveMember: (isOpenResponsiveLiveMember: boolean) => void

  // 반응형 사이즈에서 video player의 height을 읽어, LiveStatusVideoScreen의 height을 조정하기 위한 number state
  videoStatusScreenHeight: number
  setVideoStatusScreenHeight: (videoStatusScreenHeight: number) => void

  // sendbird chat UI open <> close toggle boolean state
  isChatOpen: boolean
  setIsChatOpen: (isChatOpen: boolean) => void

  // ivs 재생 status string state
  // waiting: 라이브 전 재생 대기중 <> play: 재생중 <> fast-end: end_date + 2시간이 지나기 전 라이브 종료 <> end_date + 2시간이 지난 후 라이브 종료 <> error : 재생 에러
  ivsPlayStatus: string
  setIvsPlayStatus: (ivsPlayStatus: string) => void

  // 라이브 중일 때의 정보를 저장하기 위한 stream infomation state
  // LIVE-ON: LIVE ON <> LIVE-OFF: LIVE OFF
  streamInfomation: string
  setStreamInfomation: (streamInfomation: string) => void

  // 라이브 참가자 수를 표현하기 위한 센드버드 number of actived user state
  numberOfLiveUser: number
  setNumberOfLiveUser: (numberOfLiveUser: number) => void

  // user auth token for API
  authToken: string
  setAuthToken: (authToken: string) => void

  // user infomation object state
  userInfomation: object
  setUserInfomation: (userInfomation: object) => void

  // 현재 시간 data
  nowTime: object
  setNowTime: (nowTime: object) => void
}

const useStore = create(
  subscribeWithSelector(
    (set): FiiveStudioState => ({
      offsetX: 0,
      setOffsetX: (offsetX) =>
        set(() => ({
          offsetX,
        })),

      isOpenResponsiveModal: false,
      setIsOpenResponsiveModal: (isOpenResponsiveModal) =>
        set(() => ({
          isOpenResponsiveModal,
        })),

      isOpenResponsiveLiveMember: false,
      setIsOpenResponsiveLiveMember: (isOpenResponsiveLiveMember) =>
        set(() => ({
          isOpenResponsiveLiveMember,
        })),

      videoStatusScreenHeight: 0,
      setVideoStatusScreenHeight: (videoStatusScreenHeight) =>
        set(() => ({
          videoStatusScreenHeight,
        })),

      isChatOpen: true,
      setIsChatOpen: (isChatOpen) =>
        set(() => ({
          isChatOpen,
        })),

      ivsPlayStatus: 'waiting',
      setIvsPlayStatus: (ivsPlayStatus) =>
        set(() => ({
          ivsPlayStatus,
        })),

      authToken: '',
      setAuthToken: (authToken) =>
        set(() => ({
          authToken,
        })),

      userInfomation: {},
      setUserInfomation: (userInfomation) =>
        set(() => ({
          userInfomation,
        })),

      streamInfomation: 'LIVE-OFF',
      setStreamInfomation: (streamInfomation) =>
        set(() => ({
          streamInfomation,
        })),

      numberOfLiveUser: 0,
      setNumberOfLiveUser: (numberOfLiveUser) =>
        set(() => ({
          numberOfLiveUser,
        })),

      nowTime: new Date(),
      setNowTime: (nowTime) =>
        set(() => ({
          nowTime,
        })),
    })
  )
)

export default useStore
