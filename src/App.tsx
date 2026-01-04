import { Suspense } from "react"

import { Loader, PositionalAudio, useGLTF } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { Bloom, EffectComposer } from "@react-three/postprocessing"

import { Experience } from "./components/Experience"
import { UI } from "./components/UI"

import "./App.css"

function App() {
  return (
    <>
      {/* <Stats /> */}
      <UI />
      {/* Target at -0.1x */}
      <Canvas shadows camera={{ position: [-0.1, 0, 0], fov: 50 }}>
        {/* NOTE: Avoids setting color-scheme css */}
        <color attach="background" args={["#111"]} />

        <Suspense>
            <Experience />
        </Suspense>

        <EffectComposer>
            <Bloom mipmapBlur intensity={0.3} luminanceThreshold={1.5} />
        </EffectComposer>

        <Preloader />
      </Canvas>
    </>
  )
}

export const AUDIOS = {
  // pop: "sfxs/baloon-pop-48030.mp3",
  // impact: "sfxs/cinematic-hit-159487-cut.mp3",
  // throw: "sfxs/axe-slash-1-106748-cut.mp3",
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

// useGLTF.preload("models/Axe Small.glb")

export default App
