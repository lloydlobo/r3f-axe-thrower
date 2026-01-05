import { create } from "zustand"
import { MeshStandardMaterial, Vector3 } from "three"
import { randFloat, randFloatSpread, randInt } from "three/src/math/MathUtils"

export const BALLOON_COLORS: string[] = ["white", "#b7b0e3", "#5a47ce"]

export const balloonMaterials: Record<string, MeshStandardMaterial> = {}

BALLOON_COLORS.forEach((color) => {
  balloonMaterials[color] = new MeshStandardMaterial({
    color,
  })
})

export const useGame = create((set, get) => ({
  balloons: [],
  axeLaunched: false,
  isFirstGame: true,
  balloonsHit: 0,
  targetsHit: 0,
  throws: 0,

  launchAxe: () => {
    if (get().axeLaunched || get().throws <= 0) return
    set(() => ({
      axeLaunched: true,
      throws: get().throws - 1,
    }))
    setTimeout(() => {
      set(() => ({ axeLaunched: false }))
    }, 2000)
  },
  startGame: () => {
    console.log("startGame")
    set(() => ({
      throws: 5,
      axeLaunched: false,
      isFirstGame: false,
      balloonsHit: 0,
      targetsHit: 0,
      balloons: new Array(50).fill(0).map((_, index) => ({
        id: `balloon_${index}_${Math.random()}`,
        position: new Vector3(randFloat(8, 18), randFloat(-20, 0), randFloatSpread(1)), // spread: [-range/2..range/2]
        color: BALLOON_COLORS[randInt(0, BALLOON_COLORS.length - 1)],
      })),
    }))
  },
  onBalloonHit: () => {
    set((state) => ({
      balloonsHit: state.balloonsHit + 1,
    }))
  },
  onTargetHit: () => {
    set((state) => ({
      targetsHit: state.targetsHit + 1,
    }))
  },
}))
