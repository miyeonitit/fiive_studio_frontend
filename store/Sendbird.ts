import create from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

interface SendbirdState {
  message: object | null
  addMessageInfomation: (message: object) => void

  messageLength: number
  changeMessageLength: (messageLength: number) => void

  // 라이브 참여자 목록 on, off에 따라 typing input을 숨기기 위한 state
  isUserList: boolean
  setIsUserList: (isUserList: boolean) => void

  // custom 한 emojis의 리스트 state
  emojiContainer: object | null
  addEmojiContainer: (emojiContainer: object) => void
}

const useStore = create(
  subscribeWithSelector(
    (set): SendbirdState => ({
      message: null,
      addMessageInfomation: (message) =>
        set(() => ({
          message,
        })),

      messageLength: 0,
      changeMessageLength: (messageLength) =>
        set(() => ({
          messageLength,
        })),

      isUserList: false,
      setIsUserList: (isUserList) =>
        set(() => ({
          isUserList,
        })),

      emojiContainer: null,
      addEmojiContainer: (emojiContainer) =>
        set(() => ({
          emojiContainer,
        })),
    })
  )
)

export default useStore
