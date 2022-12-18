import create from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

interface SendbirdState {
  message: object | null
  addMessageInfomation: (message: object) => void

  // 라이브 참여자 목록 on, off에 따라 typing input을 숨기기 위한 state
  isUserList: boolean
  setIsUserList: (isUserList: boolean) => void
}

const useStore = create(
  subscribeWithSelector(
    (set): SendbirdState => ({
      message: null,
      addMessageInfomation: (message) =>
        set(() => ({
          message,
        })),

      isUserList: false,
      setIsUserList: (isUserList) =>
        set(() => ({
          isUserList,
        })),
    })
  )
)

export default useStore
