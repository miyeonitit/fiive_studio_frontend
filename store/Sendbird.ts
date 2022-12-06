import create from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

interface SendbirdState {
  message: object | null
  addMessageInfomation: (message: object) => void
}

const useStore = create(
  subscribeWithSelector(
    (set): SendbirdState => ({
      message: null,
      addMessageInfomation: (message) =>
        set(() => ({
          message,
        })),
    })
  )
)

export default useStore
