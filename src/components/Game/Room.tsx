import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Box } from '@react-three/drei';
import { Mesh } from 'three';
import { useNavigate } from 'react-router-dom';
import { Aptos, AptosConfig, MoveValue, Network } from "@aptos-labs/ts-sdk";


interface RoomGridItem {
  active: boolean;
  id: string;
  items_list: any[]; // Define the type accordingly
  name: string;
  players_list: { address: string; inventory: any[]; position: { x: string; y: string } }[];
}

const Room = ({ roomId }) => {
  const [roomGrid, setRoomGrid] = useState<RoomGridItem[] | null>(null);

  const boxRef = useRef<Mesh>(null);
  const navigate = useNavigate();
  const cellSize = 1;
  const padding = 0.1;
  
  // Create a reference for the grid
  const gridRef = useRef<Mesh>(null);

  useFetchRoomGrid(roomId, setRoomGrid);

  usePositionEntities(roomGrid, cellSize, padding);

  console.log(roomGrid)

  return (
    <Canvas
      camera={{ position: [15, 7, 7], rotation: [-Math.PI / 4, Math.PI / 4, 0] }} // Adjust camera position and rotation
    >
      <OrbitControls
        enableRotate={true}
        enablePan={true}
        enableZoom={true}
        maxPolarAngle={Math.PI / 3} // Limit the top-down rotation
        minPolarAngle={Math.PI / 6} // Limit the bottom-up rotation
        maxAzimuthAngle={Math.PI / 3} // Limit the right rotation
        minAzimuthAngle={-Math.PI / 3} // Limit the left rotation
      />
      <color attach="background" args={['black']} />
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      {/* Render the grid */}
      <mesh ref={gridRef}>
        {/* Create 10x10 grid of cells */}
        {Array.from({ length: 10 }).map((_, row) =>
          Array.from({ length: 10 }).map((_, col) => (
            <Box key={`${row}-${col}`} position={[row * (cellSize + padding), 0, col * (cellSize + padding)]} scale={[cellSize, 0.1, cellSize]} />
          ))
        )}
      </mesh>
            {/* Render players */}
            {roomGrid && roomGrid.map((row, rowIndex) =>
        row.map((player, colIndex) => (
          <mesh key={`${rowIndex}-${colIndex}`} position={[player.position.x, 0, player.position.y]}>
            <Box scale={[0.5, 0.5, 0.5]} />
          </mesh>
        ))
      )}
      

        {/* Render players and item codes */}
        {/* {roomGrid[0]?.players_list?.map((player, index) => (
        <mesh key={`player-${index}`} position={[player?.position.x || 0, 0, player?.position.y || 0]}>
        <Box scale={[0.5, 0.5, 0.5]} />
        </mesh>
        ))} */}
      {/* Render item codes similarly */}
                 
      {/* useFrame hook inside the Canvas component */}
      <CanvasFrame boxRef={boxRef} />
      {/* useEffect hook inside the Canvas component */}
      <CanvasEffect navigate={navigate} />
    </Canvas>
  );
};

const useFetchRoomGrid = (roomId, setRoomGrid) => {
  const config = new AptosConfig({ network: Network.RANDOMNET });
  const aptosClient = new Aptos(config);

  useEffect(() => {
    const fetchRoomGrid = async () => {
      try {
        const roomGrid = await aptosClient.view({
          payload: {
              function: `${'0x26b0ab8afb0b67adcbeab1d1f04ef8d067c5b7b8f0ee65e23994bf3d00a4506f'}::dapp::get_room`,
              functionArguments: [roomId.toString()],
          },
        });

        console.log(roomGrid)
        setRoomGrid(roomGrid.flat());
      } catch (error) {
        console.error('Error fetching room grid data:', error);
      }
    };
    fetchRoomGrid();
  }, []); // Run once on component mount
};

const usePositionEntities = (roomGrid, cellSize, padding) => {
  useEffect(() => {
    const positionEntities = () => {
      // Check if roomGrid is not null
      if (roomGrid) {
        // Map over players and position them in the grid
        console.log(roomGrid[0].players_list)
        roomGrid[0].players_list.forEach(player => {
          // Convert position data to numbers
          const x = parseFloat(player.position.x);
          const y = parseFloat(player.position.y);
          
          // Calculate position within the grid
          const posX = (x * cellSize) + (x * padding);
          const posY = (y * cellSize) + (y * padding);
          
          // Set player's position in the grid
          player.position.x = posX;
          player.position.y = posY;

          console.log(player.position.x)
        });
        
        // Map over item codes and position them in the grid (similar to players)
      }
    };
    positionEntities();
  }, [roomGrid]);
};


// Custom component for useFrame hook
const CanvasFrame = ({ boxRef }) => {
  useFrame(() => {
    // Rotate the box slowly
    if (boxRef.current) {
      boxRef.current.rotation.x += 0.001;
      boxRef.current.rotation.y += 0.001;
    }
  });

  return null;
};

const CanvasEffect = ({ navigate }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      // Navigate to the /room with the specified roomId
      navigate('/room');
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return null;
};

export default Room;
