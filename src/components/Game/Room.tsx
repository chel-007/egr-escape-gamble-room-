import React, { useRef, MutableRefObject, useEffect, useState, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Box } from '@react-three/drei';
import { Mesh } from 'three';
import * as THREE from 'three';
import { useNavigate } from 'react-router-dom';
import { Aptos, AptosConfig, MoveValue, Network } from "@aptos-labs/ts-sdk";
import { Text } from '@react-three/drei';
import ParticleSystem from './ParticleSystem';
import { MeshBasicMaterial, Material, Group } from 'three';
import {
  useWallet,
} from "@aptos-labs/wallet-adapter-react";
import { Types, Provider } from "aptos";
import './Room.css';
import useAddPlayerInput from './AddPlayerInput';
import WalletConnector from '../walletConnector';
import { useLoader } from '@react-three/fiber';
// import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';


interface RoomGridItem {
  active: boolean;
  id: string;
  items_list: any[]; // Define the type accordingly
  name: string;
  players_list: { address: string; inventory: any[]; position: { x: string; y: string } }[];
}

const Room = ({ roomId }) => {
  const [roomGrid, setRoomGrid] = useState<RoomGridItem[] | null>(null);
  const [playerPosition, setPlayerPosition] = useState<{ x: number; y: number } | null>(null);
  const particleSystem = useRef<THREE.Mesh>(null);
  const [turn, setTurn] = useState(1);
  const [countdown, setCountdown] = useState(20);
  const [turnEnded, setTurnEnded] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [dependency, setDependency] = useState(true)
  const [cellClicked, setCellClicked] = useState(false);
  const [addPlayerInputComponent, setAddPlayerInputComponent] = useState(null);

  const { account, connected, signAndSubmitTransaction } = useWallet();

  // const memoizedSetCountdown = useCallback((value) => setCountdown(value), []);
  // const memoizedSetTurnEnded = useCallback((value) => setTurnEnded(value), []);

  const boxRef = useRef<Mesh>(null);
  const navigate = useNavigate();
  const cellSize = 1;
  const padding = 0.1;
  const maxItemsPerRow = 4;
  const itemSpacing = 0.3;
  const hoverColor = '#FFFF00'; 
  const defaultColor = '#FFFFFF';
  const playerAddress = account?.address;

  const ItemModels = {
    2: '../../assets/box2.glb',
    3: '../../assets/new.glb',
    4: '../../assets/new.glb', 
  };
  
  // Create a reference for the grid
  const gridRef = useRef<Mesh>(null);
  // const modelRef = useRef(null);
  
  // console.log(dependency)

  useFetchRoomGrid(roomId, setRoomGrid, dependency, setDependency);
  usePositionEntities(roomGrid, cellSize, padding);
  currentTurnTimer(setCountdown, setTurnEnded);
  roomUpdateLogic(countdown, simulating, setSimulating, setCountdown, setTurn, setDependency)

  return (
    <div className="room-container">
      {location.pathname === `/room` && (
      <div className="ui-container">
        {simulating ? (
          <>
            <div className="simulating-info">Simulating...</div>
            <div className="countdown">Countdown: {countdown}s</div>
          </>
          ) : (
          <>
            <div className="turn-info">Turn: {turn}</div>
            <div className="countdown">Countdown: {countdown}s</div>
          </>
        )}
        </div>
      )}

      {playerAddress == undefined && (
      <div className='connect-wallet'>
      <WalletConnector />
      </div>
      )}
      <Canvas
        camera={{ position: [-2, 6, 23], rotation: [-Math.PI / 4, Math.PI / 4, 0] }}
      >
        <OrbitControls
          enableRotate={true}
          enablePan={true}
          enableZoom={true}
          maxPolarAngle={Math.PI / 2.2}
          minPolarAngle={Math.PI / 6}
          maxAzimuthAngle={Math.PI / 3}
          minAzimuthAngle={-Math.PI / 15}
        />
        <color attach="background" args={['black']} />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />

        {/* Particle system for space background */}
        <mesh ref={particleSystem}>
          <sphereGeometry args={[50, 32, 32]} /> {/* Decrease the radius from 100 to 50 */}
          <meshBasicMaterial color="black" side={THREE.BackSide} />
        </mesh>

        {/* Include the ParticleSystem component */}
        <ParticleSystem particleSystem={particleSystem} />

        {/* Render the grid */}
        <mesh ref={gridRef}>
          {Array.from({ length: 15}).map((_, row) =>
            Array.from({ length: 15 }).map((_, col) => (
              <Box
                key={`${row}-${col}`}
                position={[row * (cellSize + padding), 0, col * (cellSize + padding)]}
                scale={[cellSize, 0.1, cellSize]}
                onPointerOver={() => handleCellHover(gridRef, row, col, hoverColor, defaultColor)}
                onClick={() => 
                handleCellClick(row, col, roomGrid, playerAddress,
                roomId, signAndSubmitTransaction, turnEnded, countdown,
                setAddPlayerInputComponent, simulating)} // Handle click
              />
            ))
          )}
        </mesh>

        {roomGrid && roomGrid.map((room, roomIndex) =>
          room.players_list.map((player, playerIndex) => {
            // Convert position data to numbers
            const x = parseFloat(player.position.x);
            const y = parseFloat(player.position.y);

            // Calculate position within the grid
            const posX = x * 1; // Assuming cell size is 1
            const posY = y * 1; // Assuming cell size is 1

            // Define colors for players
            const colors = ['#ff0000', '#00ff00', '#0000ff']; // Example colors
            const truncatedAddress = `${player.address.slice(0, 6)}...${player.address.slice(-6)}`;

            return (
              <group key={`${roomIndex}-${playerIndex}`} position={[posX, 0.5, posY]}>
                {/* Player Box */}
                <mesh>
                  <boxBufferGeometry args={[0.5, 1.5, 0.5]} />
                  <meshStandardMaterial color={colors[playerIndex % colors.length]} />
                </mesh>
                {/* Player Address */}
                <Text
                  position={[0, 0.9, 0]} // Adjust position above the player
                  fontSize={0.1}
                  color="white"
                  anchorX="center"
                  anchorY="middle"
                  outlineWidth={0.02}
                  outlineColor="black"
                >
                  {truncatedAddress}
                </Text>
              </group>
            );
          })
        )}

        {roomGrid && roomGrid.map((room, roomIndex) =>
          room.items_list.map((item, itemIndex) => {
            // Convert position data to numbers
            const x = parseFloat(item.position.x);
            const y = parseFloat(item.position.y);

            // Calculate position within the grid
            const posX = x * 1; // Assuming cell size is 1
            const posY = y * 1; // Assuming cell size is 1

            const colors = ['#ff0000', '#00ff00', '#0000ff'];

            const itemPositionScaleMap = {
              0: { position: [posX, 0.1, posY], scale: [1, 1, 1] },
              2: { position: [posX, 0, posY], scale: [1, 1, 1] },
              3: { position: [posX, 0.4, posY], scale: [2, 2, 2] }, 
            };

            return (
              // <Item key={itemIndex} position={[posX, 0.5, posY]} scale={[2, 2, 2]} itemCode={item.item_code} ItemModels={ItemModels} />
              <Item
              key={itemIndex}
              position={itemPositionScaleMap[item.item_code].position}
              scale={itemPositionScaleMap[item.item_code].scale}
              itemCode={item.item_code}
              ItemModels={ItemModels}
            />
            );

          })
        )}

        <group position={[-5, 6, 12]}> {/* Adjust position as needed */}
              {/* Whiteboard */}
              <mesh>
                <boxBufferGeometry args={[5, 3, 0.1]} />
                <meshStandardMaterial color="white" />
              </mesh>
              {/* Inventory header text */}
              <Text
                position={[0, 1.1, 0.1]}
                fontSize={0.3}
                fontWeight={900}
                color="black"
                anchorX="center"
                anchorY="middle"
              >
                Inventory
              </Text>
          {/* Text for inventory items */}
          {roomGrid && roomGrid.map((room, roomIndex) =>
            room.players_list.map((player, playerIndex) => (
              <React.Fragment key={`player-inventory-${roomIndex}-${playerIndex}`}>
            {player.inventory.map((item, itemIndex) => {
              const row = Math.floor(itemIndex / maxItemsPerRow);
              const col = itemIndex % maxItemsPerRow;
              const x = -2 + col * itemSpacing; // Adjust x position based on column
              const y = 1.5 - row * itemSpacing; // Adjust y position based on row

              return (
                <Text
                  key={`inventory-item-${roomIndex}-${playerIndex}-${itemIndex}`}
                  position={[x, y, 0.2]} // Adjust position on the whiteboard
                  fontSize={0.2}
                  color="black"
                  anchorX="left"
                  anchorY="middle"
                >
                  {item} {/* Assuming the item is a string */}
                </Text>
              );
            })}
          </React.Fragment>
        ))
      )}
    </group>
        {cellClicked && addPlayerInputComponent}
        <CanvasFrame boxRef={boxRef} />
        <CanvasEffect navigate={navigate} />
      </Canvas>
    </div>
  );
};

const Item = ({ position, scale, itemCode, ItemModels }) => {
  const modelRef: MutableRefObject<Group | null> = useRef(null);
  useEffect(() => {
    if (modelRef.current && itemCode) {
      const loader = new GLTFLoader();
      console.log("found a new item WORKS", itemCode)
      loader.load(ItemModels[itemCode], (gltf) => {
        console.log(gltf)
        console.log("Model loaded successfully")
        modelRef.current?.add(gltf.scene);
      });
    }
  }, [itemCode]);

  return (
    <group ref={modelRef} position={position} scale={scale} />
  );
};

const useFetchRoomGrid = (roomId, setRoomGrid, dependency, setDependency) => {
  const config = new AptosConfig({ network: Network.RANDOMNET });
  const aptosClient = new Aptos(config);

  useEffect(() => {
    const fetchRoomGrid = async () => {
      try {
        const roomGrid = await aptosClient.view({
          payload: {
            function: `${'0xc0a4a8ac1b69d25e7595f69d04580ca77f3d604e235ca4f89dc97b156a61ef30'}::dapp::get_room`,
            functionArguments: [roomId.toString()],
          },
        });

        console.log(roomGrid)
        setRoomGrid(roomGrid.flat());
      } catch (error) {
        console.error('Error fetching room grid data:', error);
      }
      // console.log("fetchroom", dependency)
    };
    if(dependency){
      fetchRoomGrid();
    }
    
  }, [dependency]); // Run once on component mount
};



const usePositionEntities = (roomGrid, cellSize, padding) => {
  useEffect(() => {
    const positionEntities = () => {
      if (roomGrid) {
        roomGrid[0].players_list.forEach(player => {
          const x = parseFloat(player.position.x);
          const y = parseFloat(player.position.y);
          
          const posX = (x * cellSize) + (x * padding);
          const posY = (y * cellSize) + (y * padding);
          
          player.position.x = posX;
          player.position.y = posY;
        });

          roomGrid[0].items_list.forEach(item => {
            const itemx = parseFloat(item.position.x);
            const itemy = parseFloat(item.position.y);
            
            const itemposX = (itemx * cellSize) + (itemx * padding);
            const itemposY = (itemy * cellSize) + (itemy * padding);
            
            item.position.x = itemposX;
            item.position.y = itemposY;
        });

        // console.log(roomGrid);
      }
    };
    positionEntities();
  }, [roomGrid]);
};

const currentTurnTimer = (setCountdown, setTurnEnded) => {
  useEffect(() => {
    let countdownTimer: ReturnType<typeof setInterval> | undefined = undefined;

    const handleCountdown = () => {
      setCountdown(prevCountdown => {
        if (prevCountdown === 0) {
          clearInterval(countdownTimer);
          setTurnEnded(true);
          // console.log('Turn ended. Countdown reached 0.');
          return 0;
        } else {
          return prevCountdown - 1;
        }
      });
    };

    countdownTimer = setInterval(handleCountdown, 1000);

    return () => clearInterval(countdownTimer);
  }, [setCountdown, setTurnEnded]);
};

const roomUpdateLogic = (countdown, simulating, setSimulating, setCountdown, setTurn, setDependency) => {
  useEffect(() => {
    if (countdown === 0 && !simulating) {
      // Start simulation
      setSimulating(true);
      setCountdown(10);
      console.log('Simulation started...');
      setDependency(true)

      // Update the UI to indicate simulation
      setTimeout(async () => {
        // await updateRoom(roomId);

        // End simulation
        setSimulating(false);
        // Increment turn
        setTurn(prevTurn => prevTurn + 1);
        setDependency(false)
        // Start countdown for the next turn
        setCountdown(20);
      }, 10000); // Simulate for 10 seconds
    }
  }, [countdown, simulating, setSimulating, setCountdown, setTurn]);

  const updateRoom = (roomId) => {
    const config = new AptosConfig({ network: Network.RANDOMNET });
    const aptosClient = new Aptos(config);
  
    useEffect(() => {
      const updatingRoom = async () => {
        try {
          const update = await aptosClient.view({
            payload: {
              function: `${'0xc0a4a8ac1b69d25e7595f69d04580ca77f3d604e235ca4f89dc97b156a61ef30'}::dapp::update_room`,
              functionArguments: [roomId.toString()],
            },
          });
        } catch (error) {
          console.error('Error Updating Room:', error);
        }
      };
    }, []);
  };
};



const handleCellHover = (gridRef, row: number, col: number, hoverColor: string, defaultColor: string) => {
  // Find the mesh of the hovered cell
  const mesh = gridRef.current?.children[row * 15 + col] as Mesh;

  // Check if the material is an array
  if (Array.isArray(mesh.material)) {
    // If it's an array, iterate over each material and set the color
    mesh.material.forEach((material: Material) => {
      if (material instanceof MeshBasicMaterial) {
        material.color.set(hoverColor);
      }
    });
  } else {
    // If it's a single material, set the color directly
    if (mesh.material instanceof MeshBasicMaterial) {
      mesh.material.color.set(hoverColor);
    }
  }

  // Restore the default color of other cells
  gridRef.current?.children.forEach((child: Mesh, index: number) => {
    if (index !== row * 15 + col) {
      if (Array.isArray(child.material)) {
        child.material.forEach((material: Material) => {
          if (material instanceof MeshBasicMaterial) {
            material.color.set(defaultColor);
          }
        });
      } else {
        if (child.material instanceof MeshBasicMaterial) {
          child.material.color.set(defaultColor);
        }
      }
    }
  });
};

const handleCellClick = (row: number, col: number, roomGrid, playerAddress, roomId, signAndSubmitTransaction, turnEnded, countdown, setAddPlayerInputComponent, simulating) => {
  // if (turnEnded) {
  //   alert('Current turn has ended. You cannot make a move now.');
  //   return;
  // }
  if (simulating) {
    alert('Simulation in progress. Cannot make a move.');
    return;
  }
  
  // Get the player's current position
  const currentPlayerPosition = getPlayerPosition(roomGrid, playerAddress);
  const newPosition = calculateNewPosition(currentPlayerPosition, row, col);
  console.log(newPosition)

  if (newPosition) {
    const { row: newRow, col: newCol } = newPosition;
    const updatedcol = newCol + 1;

    console.log(roomGrid[0].items_list.some(player => player.position.x === newRow && player.position.y === updatedcol))
    if(roomGrid[0].players_list.some(player => player.position.x === newRow && player.position.y === updatedcol)) {
      alert('Another player is occupying this cell. You cannot move here.');
      return; 
    }
    else if(roomGrid[0].items_list.some(item => item.position.x === newRow && item.position.y === updatedcol)) {
      console.log('You found an item!');
    }
    else {
      console.log("executing add player input");
      const component = useAddPlayerInput(playerAddress, roomId, newPosition, signAndSubmitTransaction, countdown);

      setAddPlayerInputComponent(component);
    }

  } 
  else{
    console.error('newPosition was invalid');
  }

};


const getPlayerPosition = (roomGrid: RoomGridItem[] | null, playerAddress: string): { row: number, col: number } | null => {
  if (!roomGrid) {
    return null;
  }
  const currentPlayer = roomGrid.find(room => room.players_list.some(player => player.address === playerAddress));

  console.log("currentPlayer", roomGrid.find(room => room.players_list.some(player => player.address === playerAddress)))
  if (!currentPlayer) {
    return null;
  }
  const playerPosition = currentPlayer.players_list.find(player => player.address === playerAddress)?.position;

  // console.log(playerPosition)

  if (!playerPosition) {
    return null;
  }
  const row = parseInt(playerPosition.x);
  const dummycol = parseInt(playerPosition.y);
  const col = dummycol - 1;
  return { row, col };
};

const calculateNewPosition = (currentPlayerPosition, row, col) => {
  // Extract the current row and column from the player's position

  console.log(currentPlayerPosition)
  const { row: currentRow, col: currentCol } = currentPlayerPosition;

  // Calculate the absolute difference between the current and clicked cell positions
  const rowDiff = row - currentRow;
  const colDiff = col - currentCol;

  console.log(rowDiff, row, currentRow);
  console.log(colDiff, col, currentCol);

  // Check if the clicked cell is one cell away vertically or horizontally
  if ((Math.abs(rowDiff) === 1 && colDiff === 0) || (Math.abs(colDiff) === 1 && rowDiff === 0)) {
    // Return the new position if the clicked cell is one cell away
    // console.log(x, y)
    return { row: row, col: col };
  } else {
    alert('You can only move one cell up, down, left, or right from your current position.');
    return null;
  }
};




const CanvasFrame = ({ boxRef }) => {
  useFrame(() => {
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
      navigate('/room');
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return null;
};

export default Room;
