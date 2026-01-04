import { Gltf } from "@react-three/drei"

const axeSmallOffsetConfig = {
  default: { x: 0, y: -0.3, z: 0 },
  firstPerson: { x: 0.25, y: -0.3, z: 0.25 },
}

export const AxeController = () => {
  const axeSmallOffset = axeSmallOffsetConfig.firstPerson

  return (
    <>
      <Gltf // force-line-break
        src={"models/Axe Small.glb"}
        position-x={axeSmallOffset.x}
        position-y={axeSmallOffset.y}
        position-z={axeSmallOffset.z}
      />
      {/*  */}
      {/*  */}
      {/*  */}
    </>
  )
}
