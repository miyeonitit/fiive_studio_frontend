import create from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

interface classRoomState {
  // ivs infomaion state
  ivsData: object
  setIvsData: (ivsData: object) => void

  // sendbird chat infomaion state
  chatData: object
  setChatData: (ivsData: object) => void
}

const useStore = create(
  subscribeWithSelector(
    (set): classRoomState => ({
      ivsData: {},
      setIvsData: (ivsData: object) =>
        set(() => ({
          ivsData,
        })),

      chatData: {},
      setChatData: (chatData: object) =>
        set(() => ({
          chatData,
        })),
    })
  )
)

export default useStore
