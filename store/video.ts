import create from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

interface VideoState {
  channel: Channel | null
  setChannel: (channel: Channel | null) => void

  announcements: Array<Announcement>
  addAnnouncement: (item: Announcement) => void
  removeAnnouncement: (id: string) => void

  questions: Array<Question>
  addQuestion: (item: Question) => void
  resolveQuestion: (item: Question) => void

  reactions: Array<Reaction>
  addReaction: (item: Reaction) => void
  removeReaction: (item: Reaction) => void

  timer: number | null
  remainingSeconds: number | null
  setTimer: (timer: Timer) => void
  ticktock: () => void
}

type Announcement = {
  id: string
  content: string
}

type Channel = {
  arn: string
}

type Question = {
  id: string
  content: string
  resolved: boolean
}

type Timer = {
  id: string
  duration: number
}

type Reaction = {
  id: string
  type: string
}

const useStore = create(
  subscribeWithSelector(
    (set): VideoState => ({
      // Channel
      channel: null,
      setChannel: (channel) =>
        set(() => ({
          channel,
        })),

      // Announcements
      announcements: [],
      addAnnouncement: (item) => {
        set((state: VideoState) => ({
          announcements: [...state.announcements, item],
        }))
      },
      removeAnnouncement: (id) => {
        set((state: VideoState) => {
          const items = [...state.announcements]
          const idx = items.findIndex((item) => item.id === id)
          if (idx > -1) items.splice(idx, 1)

          return {
            announcements: items,
          }
        })
      },

      // Questions
      questions: [],
      addQuestion: (item) => {
        set((state: VideoState) => ({
          questions: [...state.questions, item],
        }))
      },
      resolveQuestion: (item) => {
        set((state: VideoState) => {
          const questions = [...state.questions]
          const idx = questions.findIndex(
            (question: Question) => question.id === item.id
          )
          if (idx > -1)
            questions.splice(idx, 1, {
              ...questions[idx],
              resolved: true,
            })

          return {
            questions,
          }
        })
      },

      // Reactions
      reactions: [],
      addReaction: (item) => {
        set((state: VideoState) => ({
          reactions: [...state.reactions, item],
        }))
      },
      removeReaction: (item) => {
        set((state: VideoState) => {
          const items = [...state.reactions]
          const idx = items.findIndex((reaction) => reaction.id === item.id)
          if (idx > -1) items.splice(idx, 1)

          return {
            reactions: items,
          }
        })
      },

      // Timer
      timer: null,
      remainingSeconds: null,
      setTimer: (timer) => {
        set(() => ({
          timer: timer.duration,
          remainingSeconds: timer.duration,
        }))
      },
      ticktock: () => {
        set((state: VideoState) => {
          if (state.remainingSeconds === null) return {}
          if (state.remainingSeconds < 1) return {}

          return {
            remainingSeconds: state.remainingSeconds - 1,
          }
        })
      },
    })
  )
)

export default useStore
