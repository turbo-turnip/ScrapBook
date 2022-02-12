import { FC, useEffect, useRef, useState } from "react";
import { useAnimations, useGLTF } from "@react-three/drei";
import { useSpring, animated } from "@react-spring/three";

interface LockProps {
  rotation?: Array<number>;
  scale?: Array<number>;
  position?: Array<number>;
}

export const LockModel: FC<LockProps> = ({ ...props }) => {
  const group = useRef();
  const { nodes, materials, animations } = useGLTF("/lock.glb");
  const { actions } = useAnimations(animations, group);
  const [hovering, setHovering] = useState(false);
  const { scaleSprings } = useSpring({ scaleSprings: hovering ? ((props?.scale?.[0] || 1) + 0.1) : (props?.scale?.[0] || 1) });

  useEffect(() => {
    Object.keys(actions).forEach((action) => {
      actions[action].repetitions = 1;
      actions[action].clampWhenFinished = true;
      actions[action].play();
    });
  }, []);

  return (
    <animated.group
      ref={group}
      rotation={props.rotation || []}
      position={props.position || []}
      scale={scaleSprings}
      dispose={null}
      onPointerEnter={() => setHovering(true)}
      onPointerLeave={() => setHovering(false)}
    >
      <mesh
        name="Cube"
        geometry={nodes.Cube.geometry}
        material={materials.metal_1}
        position={[0, 1.03, 0]}
        rotation={[0, -0.64, 0]}
        scale={[0.44, 1, 1]}
      />
      <mesh
        name="Torus"
        geometry={nodes.Torus.geometry}
        material={nodes.Torus.material}
        position={[0, -0.02, 0]}
        rotation={[0, -0.64, 0]}
      />
      <mesh
        name="Cylinder"
        geometry={nodes.Cylinder.geometry}
        material={nodes.Cylinder.material}
        position={[0.09, 1.83, -0.93]}
        rotation={[0, -0.64, -Math.PI / 2]}
        scale={[0.08, 0.02, 0.08]}
      />
      <mesh
        name="Cylinder001"
        geometry={nodes.Cylinder001.geometry}
        material={nodes.Cylinder001.material}
        position={[-0.86, 1.83, 0.35]}
        rotation={[0, -0.64, -Math.PI / 2]}
        scale={[0.08, 0.02, 0.08]}
      />
      <mesh
        name="Cylinder002"
        geometry={nodes.Cylinder002.geometry}
        material={nodes.Cylinder002.material}
        position={[-0.86, 0.24, 0.35]}
        rotation={[0, -0.64, -Math.PI / 2]}
        scale={[0.08, 0.02, 0.08]}
      />
      <mesh
        name="Cylinder003"
        geometry={nodes.Cylinder003.geometry}
        material={nodes.Cylinder003.material}
        position={[0.09, 0.24, -0.92]}
        rotation={[0, -0.64, -Math.PI / 2]}
        scale={[0.08, 0.02, 0.08]}
      />
      <mesh
        name="Cylinder004"
        geometry={nodes.Cylinder004.geometry}
        material={nodes.Cylinder004.material}
        position={[0.85, 1.83, -0.36]}
        rotation={[0, -0.64, -Math.PI / 2]}
        scale={[0.08, 0.02, 0.08]}
      />
      <mesh
        name="Cylinder005"
        geometry={nodes.Cylinder005.geometry}
        material={nodes.Cylinder005.material}
        position={[-0.09, 1.83, 0.92]}
        rotation={[0, -0.64, -Math.PI / 2]}
        scale={[0.08, 0.02, 0.08]}
      />
      <mesh
        name="Cylinder006"
        geometry={nodes.Cylinder006.geometry}
        material={nodes.Cylinder006.material}
        position={[-0.09, 0.24, 0.92]}
        rotation={[0, -0.64, -Math.PI / 2]}
        scale={[0.08, 0.02, 0.08]}
      />
      <mesh
        name="Cylinder007"
        geometry={nodes.Cylinder007.geometry}
        material={nodes.Cylinder007.material}
        position={[0.85, 0.24, -0.35]}
        rotation={[0, -0.64, -Math.PI / 2]}
        scale={[0.08, 0.02, 0.08]}
      />
      <mesh
        name="Cube001"
        geometry={nodes.Cube001.geometry}
        material={nodes.Cube001.material}
        position={[0, 1.03, 0]}
        rotation={[0, -0.64, 0]}
        scale={[0.44, 1, 1]}
      />
    </animated.group>
  );
};

useGLTF.preload("/lock.glb");
