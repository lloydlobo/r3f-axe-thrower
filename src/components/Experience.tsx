// noinspection ES6PreferShortImport

import { useEffect, useRef } from "react"
import { CameraControls, Environment, Grid, PerspectiveCamera } from "@react-three/drei"
import { RenderMode, VFXParticles } from "wawa-vfx"

import { GradientSky } from "../components/GradientSky"
import { AxeController } from "../components/AxeController.tsx"
import { Target } from "../components/Target.tsx"
import { Balloons } from "../components/Balloons.tsx"
import { Walls } from "../components/Walls.tsx"
import { useGame } from "../hooks/useGame.ts"

export const Experience = () => {
  const controls = useRef<CameraControls | null>(null)

  const axeLaunched = useGame((state) => state.axeLaunched)
  const throws = useGame((state) => state.throws)
  type CameraPanType = "none" | "west" | "east"
  const cameraPan: CameraPanType = throws < 3 ? "west" : "none"

  useEffect(() => {
    if (cameraPan === "none") {
      if (axeLaunched) controls.current?.setLookAt(-4, 2, -1.5, 10, 1.5, -0.8, true)
      else controls.current?.setLookAt(-0.1, 0, 0, 0, 0, 0, true)
    } else if (cameraPan === "east") {
      if (axeLaunched) controls.current?.setLookAt(9.5, 0, 30, 10, 0, 0, true)
      else controls.current?.setLookAt(-0.1, 0, 0, 0, 0, 0, true)
    } else if (cameraPan === "west") {
      if (axeLaunched) controls.current?.setLookAt(9.5, 0, -30, 10, 0, 0, true)
      else controls.current?.setLookAt(-0.1, 0, 0, 0, 0, 0, true)
    } else {
      throw new Error(`Exhausted CameraPanType. Got ${cameraPan}!`)
    }
  }, [axeLaunched, cameraPan])

  return (
    <>
      <CameraControls ref={controls} />

      <GradientSky />
      <Walls />
      <Balloons />
      <AxeController />
      <group position-y={-1} position-x={20}>
        <Target />
      </group>

      {/* Immersion */}
      <Grid position-y={-10} infiniteGrid sectionColor="#999" cellColor="#555" fadeStrength={5} />
      <directionalLight
        position={[30, 15, 30]}
        castShadow={true}
        intensity={1}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.005}
      >
        <PerspectiveCamera attach="shadow-camera" near={10} far={50} fov={80} />
      </directionalLight>
      <Environment preset="sunset" environmentIntensity={0.3} />

      {/*  VFXS */}
      <VFXParticles
        name="sparks"
        settings={{
          fadeAlpha: [0, 1],
          gravity: [0, -10, 0],
          intensity: 8,
          nbParticles: 100_000,
          renderMode: RenderMode.Billboard, // lib could use a brand type to avoid TS enums
        }}
      />
    </>
  )
}
