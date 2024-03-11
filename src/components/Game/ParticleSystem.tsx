import React, { useEffect } from 'react';
import * as THREE from 'three';

const ParticleSystem = ({ particleSystem }) => {
  useEffect(() => {
    if (particleSystem.current) {
      const particles = 10000;
      const geometry = new THREE.BufferGeometry();

      const positions: number[] = [];
      const colors: number[] = [];

      const color = new THREE.Color();

      for (let i = 0; i < particles; i++) {
        // Random position within the sphere
        const radius = 50;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);

        positions.push(x, y, z);

        // Random color for each particle
        color.setHSL(Math.random(), 1.0, 0.5);
        colors.push(color.r as number, color.g as number, color.b as number);
      }

      geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

      const material = new THREE.PointsMaterial({
        size: 0.7,
        vertexColors: true,
        opacity: 0.5, // Initial opacity
        transparent: true, // Enable transparency
      });

      const points = new THREE.Points(geometry, material);
      particleSystem.current.add(points);

      // Animation loop
      const animateParticles = () => {
        const positionsArray = geometry.attributes.position.array as Float32Array;

        // Twinkle effect: Change opacity randomly
        for (let i = 0; i < positionsArray.length; i += 3) {
          material.opacity = Math.random() * 0.5 + 0.5; // Random opacity between 0.5 and 1.0
          material.needsUpdate = true; // Update material
        }

        // Floating effect: Update particle positions slowly
        for (let i = 0; i < positionsArray.length; i += 3) {
          positionsArray[i + 1] += Math.sin(Date.now() * 0.001 + i * 10) * 0.01; // Adjust Y position
        }

        // Update position buffer
        geometry.attributes.position.needsUpdate = true;

        requestAnimationFrame(animateParticles);
      };

      animateParticles();
    }
  }, [particleSystem]);

  return null;
};

export default ParticleSystem;
