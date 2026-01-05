import { CuboidCollider, RigidBody } from "@react-three/rapier"

// Walls act as a thin funnel around Ballons floating up, for precise targeting.
export const Walls = () => {
  return (
    <>
      <RigidBody type="fixed" position-z={-1}>
        <CuboidCollider args={[100, 100, 0.1]} />
      </RigidBody>
      <RigidBody type="fixed" position-z={1}>
        <CuboidCollider args={[100, 100, 0.1]} />
      </RigidBody>
    </>
  )
}
