import React, { useRef } from "react"
import { Gltf } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { type RapierRigidBody, RigidBody } from "@react-three/rapier"
import { degToRad } from "three/src/math/MathUtils.js"
import { Vector3 } from "three"

export const Target = () => {
  const rb = useRef<RapierRigidBody | null>(null)

  useFrame(({ clock }) => {
    if (rb.current) {
      rb.current.setTranslation(new Vector3(20, Math.sin(clock.elapsedTime * 2) * 2, 0), true) // oscillate up/down along y-axis [-2..2]
    }
  })

  return (
    <RigidBody ref={rb} name="target" colliders="hull" type="kinematicPosition">
      <Gltf src="models/Shield Round.glb" rotation-y={degToRad(-90)} scale={2} position-x={0} position-y={1} />
    </RigidBody>
  )
}
