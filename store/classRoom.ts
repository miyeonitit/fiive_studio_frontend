import create from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

interface ClassRoomState {
  // ivs infomaion state
  ivsData: object
  setIvsData: (ivsData: object) => void

  // sendbird chat infomaion state
  chatData: object
  setChatData: (chatData: object) => void

  // class infomation state
  classData: object
  setClassData: (classData: object) => void
}

const useStore = create(
  subscribeWithSelector(
    (set): ClassRoomState => ({
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

      classData: {},
      setClassData: (classData: object) =>
        set(() => ({
          classData,
        })),
    })
  )
)

export default useStore
