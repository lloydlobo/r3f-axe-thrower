import { useRef } from "react"
import { CameraControls, Environment, Grid, PerspectiveCamera } from "@react-three/drei"
import { GradientSky } from "../components/GradientSky"

export const Experience = () => {
  const controls = useRef()

  return (
    <>
      <CameraControls ref={controls} />

      {/* NOTE: Position sends the target far away */}
      {/* NOTE: App |> EffectComposer |> Bloom lights up the orange emmisive */}
      <mesh position-x={10}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial // force-line-break
          color="orange"
          emissive="orange"
          emissiveIntensity={8}
        />
      </mesh>

      {/* Immersion */}
      <GradientSky />
      <Grid // force-line-break
        position-y={-10}
        infiniteGrid
        sectionColor="#999"
        cellColor="#555"
        fadeStrength={5}
      />
      <directionalLight // force-line-break
        position={[30, 15, 30]}
        castShadow
        intensity={1}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.005}
      >
        <PerspectiveCamera // force-line-break
          attach="shadow-camera"
          near={10}
          far={50}
          fov={80}
        />
      </directionalLight>
      <Environment preset="sunset" environmentIntensity={0.3} />
    </>
  )
}
