import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Box } from '@react-three/drei';
import { Mesh } from 'three';
import { useNavigate } from 'react-router-dom';

const Room = ({ roomId }) => {
  const boxRef = useRef<Mesh>(null);
  const navigate = useNavigate();

  return (
    <Canvas>
      <OrbitControls />
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <mesh ref={boxRef}>
        <Box scale={[1, 1, 1]} />
      </mesh>
      {/* useFrame hook inside the Canvas component */}
      <CanvasFrame boxRef={boxRef} />
      {/* useEffect hook inside the Canvas component */}
      <CanvasEffect navigate={navigate} />
    </Canvas>
  );
};

// Custom component for useFrame hook
const CanvasFrame = ({ boxRef }) => {
  useFrame(() => {
    // Rotate the box slowly
    if (boxRef.current) {
      boxRef.current.rotation.x += 0.01;
      boxRef.current.rotation.y += 0.01;
    }
  });

  return null;
};

const CanvasEffect = ({ navigate }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      // Navigate to the /room with the specified roomId
      navigate(`/room/`);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return null;
};

export default Room;
