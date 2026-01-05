import { Suspense } from "react"
import { Loader, PositionalAudio, useGLTF } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { Bloom, EffectComposer } from "@react-three/postprocessing"
import { Physics } from "@react-three/rapier"

import { Experience } from "./components/Experience"
import { UI } from "./components/UI"
import { AUDIOS } from "./consts.ts"
import "./App.css"

function App() {
  return (
    <>
      {/* <Stats /> */}
      <UI />
      <Loader />
      {/* Target at -0.1x */}
      <Canvas shadows camera={{ position: [-0.1, 0, 0], fov: 50 }}>
        {/* NOTE: Avoids setting color-scheme css */}
        <color attach="background" args={["#111"]} />

        <Suspense>
          <Physics debug={true} colliders={false}>
            <Experience />
          </Physics>
        </Suspense>

        <EffectComposer>
          <Bloom mipmapBlur intensity={0.3} luminanceThreshold={1.5} />
        </EffectComposer>

        <Preloader />
      </Canvas>
    </>
  )
}

const Preloader = () => {
  return Object.values(AUDIOS).map((audio) => (
    <PositionalAudio // force-line-break
      key={audio}
      url={audio}
      loop={false}
      autoplay={false}
    />
  ))
}

useGLTF.preload("models/Axe Small.glb") // in AxeController.tsx
useGLTF.preload("models/Shield Round.glb") // in Target.tsx

export default App
