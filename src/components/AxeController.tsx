import { Gltf } from "@react-three/drei"
import { type RapierRigidBody, RigidBody, vec3 } from "@react-three/rapier"
import { useEffect, useRef, useState } from "react"
import { useFrame } from "@react-three/fiber"
import { Quaternion, Vector3 } from "three"

import { useGame } from "../hooks/useGame.ts"
import { lerp } from "three/src/math/MathUtils"
import type { Vector } from "three/examples/jsm/physics/RapierPhysics"
import { VFXEmitter, VFXParticles } from "wawa-vfx"

const axeSmallOffsetConfig = {
  default: new Vector3(0, -0.3, 0),
  firstPerson: new Vector3(0.3125, -0.3, 0.25),
}

export const AxeController = () => {
  const rb = useRef<RapierRigidBody | null>(null) // rigid body

  const [isOffsetAxe, setIsOffsetAxe] = useState<boolean>(true)
  const axeSmallOffset = isOffsetAxe ? axeSmallOffsetConfig.firstPerson : axeSmallOffsetConfig.default

  const axeLaunched = useGame((state) => state.axeLaunched)
  const launchAxe = useGame((state) => state.launchAxe)

  const [impact, setImpact] = useState<Vector | null>(null)
  const onTargetHit = useGame((state) => state.onTargetHit)

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
    } else {
      setImpact(null)
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

  useEffect(() => {
    if (impact) {
      onTargetHit()
    }
  }, [impact, onTargetHit])

  return (
    <>
      {impact && (
        <group position={vec3(impact)}>
          <VFXEmitter
            emitter="sparks"
            debug={false}
            settings={{
              spawnMode: "burst",
              nbParticles: 8000,
              duration: 1,
              size: [0.01, 0.62],
              startPositionMin: [0, 0, 0],
              startPositionMax: [0, 0, 0],
              directionMin: [-1, -1, -1],
              directionMax: [1, 1, 1],
              rotationSpeedMin: [-1, -1, -10],
              rotationSpeedMax: [1, 1, 10],
              speed: [0.1, 10],
              particlesLifetime: [0.1, 1],
              colorStart: ["orange", "orangered"],
            }}
          />
        </group>
      )}
      <RigidBody
        ref={rb}
        name="axe"
        colliders="hull"
        type="dynamic"
        sensor={true} // move to target without being impacted by collision with balloons
        onIntersectionEnter={(e) => {
          if (e.other.rigidBodyObject?.name === "target") {
            rb.current?.setBodyType(0, false) // author set it as 2 (2 messes up next throw as the axe just falls down)
            rb.current?.setLinvel(new Vector3(0, 0, 0), false)
            rb.current?.setAngvel(new Vector3(0, 0, 0), false)
            setImpact(rb.current?.translation())
          } // 0 = RigidBodyType.Dynamic, 2 = RigidBodyType.KinematicPosition
        }} // changed `onCollisionEnter` to `onIntersectionEnter`
      >
        <Gltf src="models/Axe Small.glb" position={axeSmallOffset} />
        {axeLaunched && !impact && (
          <group position={axeSmallOffset}>
            <VFXEmitter
              emitter="axes"
              settings={{
                loop: true,
                spawnMode: "time",
                nbParticles: 82,
                particlesLifetime: [1, 1],
                duration: 0.5,
                size: [1, 1],
                startPositionMin: [0, 0, 0],
                startPositionMax: [0, 0, 0],
                directionMin: [0, 0, 0],
                directionMax: [0, 0, 0],
                startRotationMin: [0, 0, 0],
                startRotationMax: [0, 0, 0],
                speed: [0.1, 2],
                colorStart: ["#424242"],
              }}
            />
          </group>
        )}
      </RigidBody>
    </>
  )
}

// # Troubleshooting
// - This fixes bug where the first throw drops, debug shows yellow lines on kinematicPosition, dynamic is pink
//   - RigidBody requires Physics provider in App
//   - Earlier, we chose `type="kinematicPosition"` prevents RigidBody from falling down (gravity)
//   - After, being latched on to the mouse pointer, we can simply choose `type="dynamic"`.
