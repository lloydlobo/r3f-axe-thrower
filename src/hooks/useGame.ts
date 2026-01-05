// import { create } from "zustand/react"
import { create } from "zustand"

type _StoreApiType = {
  axeLaunched: boolean
  launchAxe: () => void
}

export const useGame = create((set, get) => {
  return {
    axeLaunched: false,
    launchAxe: () => {
      if (get().axeLaunched) {
        return
      }
      set(() => ({
        axeLaunched: true,
      }))
      setTimeout(() => {
        set(() => ({
          axeLaunched: false,
        }))
      }, 2000)
    },
  }
})
