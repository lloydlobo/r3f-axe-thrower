import { Gltf } from "@react-three/drei"
import { type RapierRigidBody, RigidBody } from "@react-three/rapier"
import { useEffect, useRef, useState } from "react"
import { useFrame } from "@react-three/fiber"
import { Quaternion, Vector3 } from "three"

import { useGame } from "../hooks/useGame.ts"

const axeSmallOffsetConfig = {
  default: new Vector3(0, -0.3, 0),
  firstPerson: new Vector3(0.3125, -0.3, 0.25),
}

export const AxeController = () => {
  const rb = useRef<RapierRigidBody | null>(null) // rigid body

  const axeLaunched = useGame((state) => state.axeLaunched)
  const launchAxe = useGame((state) => state.launchAxe)

  const [isOffsetAxe, setIsOffsetAxe] = useState<boolean>(true)
  const axeSmallOffset = isOffsetAxe ? axeSmallOffsetConfig.firstPerson : axeSmallOffsetConfig.default

  useEffect(() => {
    const onPointerUp = () => {
      launchAxe()
    }
    window.addEventListener("pointerup", onPointerUp)
    return () => {
      window.removeEventListener("pointerup", onPointerUp)
    }
  }, [launchAxe])

  useEffect(() => {
    if (axeLaunched) {
      rb.current?.setBodyType(0, false) // 0 = RigidBodyType.Dynamic
      rb.current?.applyImpulse(new Vector3(1, 0.5, 0), true) // Push to right and bit upwards
      rb.current?.applyTorqueImpulse(new Vector3(0, 0, -0.2), true) // Z rotation
    }
  }, [axeLaunched])

  useFrame(({ pointer }) => {
    if (rb.current && !axeLaunched) {
      rb.current.setRotation(new Quaternion(0, 0, 0, 1), true)
      rb.current.setTranslation(new Vector3(1, -0.2 + pointer.y * 0.5, pointer.x * 0.5), true)
      rb.current.setLinvel(new Vector3(0, 0, 0), false)
      rb.current.setAngvel(new Vector3(0, 0, 0), false)
    }
  }) // bind to mouse and also reset after each throw

  return (
    <RigidBody ref={rb} name="axe" colliders="hull" type="dynamic">
      <Gltf src="models/Axe Small.glb" position={axeSmallOffset} />
    </RigidBody>
  )
}

// # Troubleshooting
// - This fixes bug where the first throw drops, debug shows yellow lines on kinematicPosition, dynamic is pink
//   - RigidBody requires Physics provider in App
//   - Earlier, we chose `type="kinematicPosition"` prevents RigidBody from falling down (gravity)
//   - After, being latched on to the mouse pointer, we can simply choose `type="dynamic"`.
