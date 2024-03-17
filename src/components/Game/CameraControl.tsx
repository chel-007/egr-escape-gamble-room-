import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const CameraControl = ({ cameraRef }) => {
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const speed = 0.1;
    if (cameraRef.current) {
      const newPosition = new THREE.Vector3(0, 6, 23 - t * speed);
      cameraRef.current.position.copy(newPosition);
      // Apply rotation here
      cameraRef.current.lookAt(0, 6, 0); // Look at the center of the scene
    }
  });

  return null;
};

export default CameraControl;
