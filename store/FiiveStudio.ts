import create from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

interface FiiveStudioState {
  // 반응형 미디어쿼리 스타일 지정을 위한 브라우저 넓이 측정 state
  offsetX: number
  setOffsetX: (offsetX: number) => void
}

const useStore = create(
  subscribeWithSelector(
    (set): FiiveStudioState => ({
      offsetX: 0,
      setOffsetX: (offsetX) =>
        set(() => ({
          offsetX,
        })),
    })
  )
)

export default useStore
