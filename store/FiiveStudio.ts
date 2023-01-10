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

  // sendbird chat UI open <> close toggle boolean state
  isChatOpen: boolean
  setIsChatOpen: (isChatOpen: boolean) => void
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

      isChatOpen: true,
      setIsChatOpen: (isChatOpen) =>
        set(() => ({
          isChatOpen,
        })),
    })
  )
)

export default useStore
