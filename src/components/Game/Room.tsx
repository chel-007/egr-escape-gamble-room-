import React, { useRef, MutableRefObject, useEffect, useState, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Box } from '@react-three/drei';
import { PerspectiveCamera } from '@react-three/drei';
import { Mesh } from 'three';
import * as THREE from 'three';
import { Vector3 } from 'three';
import { Euler } from 'three';
import { useNavigate } from 'react-router-dom';
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import { Text } from '@react-three/drei';
import ParticleSystem from './ParticleSystem';
import { MeshBasicMaterial, MeshStandardMaterial, Material, Group } from 'three';
import {
  useWallet,
} from "@aptos-labs/wallet-adapter-react";
import { Types } from "aptos";
import './Room.css';
import useAddPlayerInput from './AddPlayerInput';
import UpdateRoom from './UpdateRoom';
import WalletConnector from '../walletConnector';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { TextureLoader } from 'three';
import Toast from '../../components/ui/new-toast'
import holeImage from '../../assets/hole.png'
import boxImage from '../../assets/box.png'
import chaosImage from '../../assets/chaos.png';


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

  const gameStateString = localStorage.getItem('gameState');
  const gameState = gameStateString ? JSON.parse(gameStateString) : {};
  const [turn, setTurn] = useState(gameState.turn || 1);
  const [countdown, setCountdown] = useState(gameState.countdown || 50);
  //const [turnEnded, setTurnEnded] = useState(gameState.turnEnded || false);
  const [simulating, setSimulating] = useState(gameState.simulating || false);
  const [dependency, setDependency] = useState(gameState.dependency || true)
  const [turnEnded, setTurnEnded] = useState(false);
  // const [simulating, setSimulating] = useState(false);
  const [cellClicked, setCellClicked] = useState(false);
  const [addPlayerInputComponent, setAddPlayerInputComponent] = useState(null);
  const [roomActive, setRoomActive] = useState(false);
  const [toast, setToast] = useState({
    visible: false,
    title: '',
    description: ''
  });
  // const [toastVisible, setToastVisible] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const initialCameraPosition = new Vector3(-2, 6, 23);
  const initialCameraRotation = new Euler(-Math.PI / 4, Math.PI / 4, 0);
  const targetCameraPosition = new Vector3(10, 20, 15);
  
  // Use useState hook to manage camera position and rotation
  const [cameraPosition, setCameraPosition] = useState<Vector3>(initialCameraPosition);
  const [cameraRotation, setCameraRotation] = useState<Euler>(initialCameraRotation);

  const { account, connected, network, signAndSubmitTransaction } = useWallet();
  const loader = new TextureLoader();
  const holeTexture = loader.load(holeImage);
  const boxTexture = loader.load(boxImage);
  const chaosTexture = loader.load(chaosImage);

const geometry = new THREE.PlaneGeometry(1, 1); // Adjust the size as needed

const material = new THREE.MeshBasicMaterial({ map: holeTexture });
const meshNew = new THREE.Mesh(geometry, material);
meshNew.position.set(0, 0, 0);

  // const memoizedSetCountdown = useCallback((value) => setCountdown(value), []);
  // const memoizedSetTurnEnded = useCallback((value) => setTurnEnded(value), []);

  const boxRef = useRef<Mesh>(null);
  const navigate = useNavigate();
  const cellSize = 1;
  const padding = 0.1;
  const maxItemsPerRow = 3;
  const itemSpacing = 1.5;
  const hoverColor = '#FFFF00'; 
  const defaultColor = '#FFFFFF';
  const playerAddress = account?.address;

  const ItemModels = {
    1: '../../assets/hole.glb',
    2: '../../assets/box2.glb',
    3: '../../assets/new.glb',
    4: '../../assets/box.glb', 
    5: '../../assets/potion.glb', 
  };
  
  // Create a reference for the grid
  const gridRef = useRef<Mesh>(null);

  const cameraRef = useRef<THREE.PerspectiveCamera>(null);

  const modelRef = useRef(null);

  // console.log(roomId)

  useFetchRoomGrid(roomId, setRoomGrid, dependency, setDependency);
  usePositionEntities(roomGrid, cellSize, padding);
  currentTurnTimer(setCountdown, setTurnEnded, roomActive);

  roomUpdateLogic(countdown, simulating, setSimulating, setCountdown, 
    setTurn, setDependency, turn, dependency, roomId, setToast, roomActive
    )

  useEffect(() => {
    // Call checkRoomStatus initially
    checkRoomStatus(roomId, setRoomActive, setToast, roomActive);
    console.log("still checking room status")
    // Start polling every 10 seconds
    const interval = setInterval(() => {
      UpdateRoom(roomId)
      console.log("still checking every 10 secs")
      checkRoomStatus(roomId, setRoomActive, setToast, roomActive);

      if (roomActive) {
        clearInterval(interval);
      }
    }, 10000);
  
    // Clear the interval on component unmount
    return () => clearInterval(interval);
  }, [roomId, checkRoomStatus, roomActive]);

  // useEffect(() => {
  //   UpdateRoom(roomId);

  //   const interval = setInterval(() => {
  //     console.log("update room called")
  //     console.log(roomId)
  //     UpdateRoom(roomId);
  //   }, 19500);
  
  //   // Clear the interval on component unmount
  //   return () => clearInterval(interval);
  // }, [roomId, checkRoomStatus]);

  useEffect(() => {
    // Calculate the increments for position
    const positionIncrement = targetCameraPosition.clone().sub(initialCameraPosition).divideScalar(120); // Divide by 120 to spread over 12 seconds
    let currentCameraPosition = initialCameraPosition.clone();

    // Update camera position every 100 milliseconds for 12 seconds
    const interval = setInterval(() => {
      // Update camera position
      currentCameraPosition = currentCameraPosition.clone().add(positionIncrement);

      // Set the updated camera position
      setCameraPosition(currentCameraPosition.clone());
    }, 100); // Update every 100 milliseconds

    // Clear the interval after 12 seconds to stop the updates
    setTimeout(() => {
      clearInterval(interval);
    }, 12000); // Stop after 12 seconds

    // Clean up function to clear the interval when the component unmounts
    return () => clearInterval(interval);
  }, [cameraPosition, initialCameraPosition]);
  
  


  useEffect(() => {
    const foundPlayer = roomGrid?.find(room => {
      return room.players_list.some(player => player.address === playerAddress);
    });
  
    if (foundPlayer) {
      const index = foundPlayer.players_list.findIndex(player => player.address === playerAddress);
      if (index !== -1) {
        setPlayerId(index.toString());
      }
    }
  }, [roomGrid, playerAddress]);
  

  return (
    <div className="room-container">
      {roomActive && location.pathname === `/room` && (
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

      {!roomActive && location.pathname === `/room` && (
        <div className='game-lobby'>
          <div className="ui-container">
            <>
              <div className="simulating-info">Waiting...</div>
              <div className="countdown">Game Lobby</div>
            </>
          </div>
          <div className='room-status'>
            <p style={{fontFamily: 'Lato', fontSize: '25px'}}>Waiting for the Room to be Filled!</p>
          </div>
          </div>
      )}

        {toast.visible && (
            <Toast title={toast.title} description={toast.description} />
          )}

      {playerAddress == undefined && location.pathname === `/room` && (
      <div className='connect-wallet'>
      <WalletConnector />
      </div>
      )}

{connected && network && network.name.toString() !== "RandomNet" && (
        <Toast title="Wrong Network" description="Please switch your network to RandomNet to use this app!" />
      )}

{roomActive && location.pathname === `/room` && (
  <Canvas>
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
    <mesh ref={particleSystem}>
      <sphereGeometry args={[50, 32, 32]} />
      <meshBasicMaterial color="black" side={THREE.BackSide} />
    </mesh>
    <ParticleSystem particleSystem={particleSystem} />
    <mesh ref={gridRef}>
      {Array.from({ length: 15 }).map((_, row) =>
        Array.from({ length: 15 }).map((_, col) => (
          <Box
            key={`${row}-${col}`}
            position={[row * (cellSize + padding), 0, col * (cellSize + padding)]}
            scale={[cellSize, 0.1, cellSize]}
            onPointerOver={() => handleCellHover(gridRef, row, col, hoverColor, defaultColor)}
            onClick={() => handleCellClick(row, col, roomGrid, playerAddress, roomId, signAndSubmitTransaction, turnEnded, countdown, setAddPlayerInputComponent, simulating, setToast)}
          />
        ))
      )}
    </mesh>
    {roomGrid && roomGrid.map((room, roomIndex) =>
      room.players_list.map((player, playerIndex) => {
        const x = parseFloat(player.position.x);
        const y = parseFloat(player.position.y);
        const posX = x * 1;
        const posY = y * 1;
        const colors = ['#ff0000', '#00ff00', '#0000ff'];
        const truncatedAddress = `${player.address.slice(0, 6)}...${player.address.slice(-6)}`;
        return (
          <group key={`${roomIndex}-${playerIndex}`} position={[posX, 0.5, posY]}>
            <mesh>
              <boxGeometry args={[0.5, 1.5, 0.5]} />
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
            {player.address === playerAddress && <PlayerArrow position={new Vector3(x, 1, y)} />}
          </group>
        );
      })
    )}
    {/* Additional roomGrid mapping for items_list */}
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
              1: { position: [posX, 0.1, posY], scale: [0.3, 0.4, 0.3] },
              2: { position: [posX, 0, posY], scale: [1, 1, 1] },
              3: { position: [posX, 0.4, posY], scale: [2, 2, 2] }, 
              4: { position: [posX, 0.1, posY], scale: [1, 1, 1] }, 
              5: { position: [posX, 0.5, posY], scale: [4, 3, 4] }, 
            };

            return (
              // <Item key={itemIndex} position={[posX, 0.5, posY]} scale={[2, 2, 2]} itemCode={item.item_code} ItemModels={ItemModels} />
              <Item
              key={itemIndex}
              position={itemPositionScaleMap[item.item_code].position}
              scale={itemPositionScaleMap[item.item_code].scale}
              itemCode={item.item_code}
              ItemModels={ItemModels}/>
            );

          })
        )}
    {/* Inventory rendering */}
    <group position={[-1, 6, 12]}>
            {/* Whiteboard */}
            <mesh>
              <boxGeometry args={[5, 3, 0.1]}/>
              <meshStandardMaterial color="white"/>
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

        {roomGrid &&
          roomGrid
            // Filter roomGrid to get the player's inventory only
            .filter(room => room.players_list.some(player => player.address === playerAddress))
            .map((room, roomIndex) =>
              room.players_list
                .filter(player => player.address === playerAddress)
                .map((player, playerIndex) => (
               <React.Fragment key={`player-inventory-${roomIndex}-${playerIndex}`}>
                {player.inventory.map((item, itemIndex) => {
                const row = Math.floor(itemIndex / maxItemsPerRow);
                const col = itemIndex % maxItemsPerRow;
                const x = -1.5 + col * itemSpacing;
                const y = 0.2 - row * itemSpacing;

                const texture = getItemImage(item, holeTexture, boxTexture, chaosTexture);
                texture.colorSpace = THREE.sRGBEncoding;

                return (
                  <InventoryItem
                  key={`inventory-item-${roomIndex}-${playerIndex}-${itemIndex}`}
                  boxTexture={boxTexture}
                  holeTexture={holeTexture}
                  chaosTexture={chaosTexture}
                  item={item}
                  position={[x, y, 0.1]}
                  onClick={() => handleItemClick(item, setSelectedItems, selectedItems)}/>
                  );
                })}
                  </React.Fragment>
                ))
            )}
    {/* Craft button */}
    {selectedItems.length === 2 && (
              <mesh
                position={[0, -3, 0]}
                onClick={() => handleCraftButtonClick(selectedItems, playerId, roomId, signAndSubmitTransaction)}>
               <planeBufferGeometry args={[3, 1]}/>
                <meshStandardMaterial color="blue"/>
                  <Text
                    position={[0, 0, 0.1]}
                    fontSize={0.3}
                    color="white"
                    anchorX="center"
                    anchorY="middle"
                  >
                    Craft
                  </Text>
                </mesh>
              )}
          </group>
    {/* cellClicked handling */}
    {cellClicked && addPlayerInputComponent}
    <CanvasFrame boxRef={boxRef}/>
    <CameraFrame/>
  </Canvas>
)}
      {location.pathname !== '/room' && (
        <CanvasEffect navigate={navigate} setToast={setToast} />
      )}

      {/* <Canvas>
      <PerspectiveCamera
        ref={cameraRef}
        position={[0, 6, 23]}
        makeDefault={false}  // Do not make this camera the default camera for the scene
      />
    </Canvas> */}
    </div>
  );
};

const PlayerArrow = ({ position }) => {
  return (
    <group position={[0, 1.7, 0]} rotation={[Math.PI, 0, 0]}>
      {/* Arrow Shaft */}
      <mesh>
        <cylinderGeometry args={[0.05, 0.05, 0.5, 6]} />
        <meshStandardMaterial color="brown" />
      </mesh>
      {/* Arrow Head */}
      <mesh position={[0, 0.4, 0]}>
        <coneGeometry args={[0.13, 0.35, 8]} />
        <meshStandardMaterial color="brown" />
      </mesh>
    </group>
  );
};

const Item = ({ position, scale, itemCode, ItemModels }) => {
  const modelRef: MutableRefObject<Group | null> = useRef(null);
  useEffect(() => {
    if (modelRef.current && itemCode) {
      const loader = new GLTFLoader();
      // console.log("found a new item WORKS", itemCode)
      loader.load(ItemModels[itemCode], (gltf) => {
        // console.log(gltf)
        // console.log("Model loaded successfully")
        modelRef.current?.add(gltf.scene);
      });
    }
  }, [itemCode]);

  return (
    <group ref={modelRef} position={position} scale={scale} />
  );
};


const getItemImage = (itemCode, holeTexture, boxTexture, chaosTexture) => {
  if(itemCode == 1) {
      return holeTexture;
  }
  else if(itemCode == 3){
    return boxTexture
  }
  else if(itemCode == 0){
    return chaosTexture
  }
  };

  const handleItemClick = (selectedItem, setSelectedItems, selectedItems) => {
    // Check if the selected item is already in the list
    if (!selectedItems.includes(selectedItem)) {
      // Add the selected item to the list
      console.log(selectedItem)
      
      setSelectedItems([...selectedItems, selectedItem]);
      console.log(selectedItems)
    } else {
      // Remove the selected item from the list if it's already selected
      setSelectedItems(selectedItems.filter(item => item !== selectedItem));
    }
  };

const InventoryItem = ({ item, position, onClick, holeTexture, boxTexture, chaosTexture }) => {
    const [isSelected, setIsSelected] = useState(false);
    const [isItemHovered, setIsItemHovered] = useState(false);

    const meshRef = useRef<Mesh>(null);

    const itemCodeNames = {
      0: 'Chaos',
      1: 'Hole',
      2: 'Clean Box',
      3: 'Box',
      4: 'Tele',
      5: 'Potion'
    };

    
    const texture = getItemImage(item, holeTexture, boxTexture, chaosTexture);
    // texture.repeat.set(2, 2);
    texture.colorSpace = THREE.sRGBEncoding;
  
    // Function to handle click event
    const handleClick = () => {
      setIsSelected(!isSelected); // Toggle the selection state
      onClick(item); // Call the onClick function passed from the parent component
    };

    const handleMouseEnter = () => {
      setIsItemHovered(true);
  if (meshRef.current && meshRef.current.material instanceof MeshStandardMaterial) {
    meshRef.current.material.color.set(0xff00ff); // Change color when hovered
    document.body.style.cursor = 'pointer'; // Change cursor to pointer
  }
    };
  
    const handleMouseLeave = () => {
      setIsItemHovered(false);
      if (meshRef.current && meshRef.current.material instanceof MeshStandardMaterial) {
        meshRef.current.material.color.set(0xffffff); // Change color when hovered
        document.body.style.cursor = 'auto'; // Change cursor to pointer
      }
    };
  
    return (
      <React.Fragment>
        <mesh position={position} 
        onClick={handleClick}
        onPointerEnter={handleMouseEnter} // Handle mouse enter event
        onPointerLeave={handleMouseLeave} // Handle mouse leave event
        ref={meshRef}>
          <planeGeometry args={[1, 1]}/>
          <meshStandardMaterial
            map={texture}
            color={isSelected ? 'darkgray' : 'white'} // Change color based on selection state
            transparent={true}
            side={THREE.DoubleSide}/>
        </mesh>
        {/* Position the text slightly below the item */}
        <Text
          position={[position[0], position[1] - 0.6, position[2]]} // Adjust Y position to be slightly below the item
          fontSize={0.2}
          color="black"
          anchorX="center"
          anchorY="middle"
        >
          {itemCodeNames[item]}
        </Text>
      </React.Fragment>
    );
  };

  const handleCraftButtonClick = (selectedItems, playerId, roomId, signAndSubmitTransaction) => {
    
    const item_1 = selectedItems[0];
    const item_2 = selectedItems[1]

    const addCraft = async () => {

    const payload: Types.TransactionPayload = {
        type: "entry_function_payload",
        function: `${'0x60e5a00ffd3cf1ba4323bfa8f5ddbe1dea2c8f817607a5f89a32b28e5f16d37e'}::dapp::add_player_craft`,
        type_arguments: [],
        arguments: [roomId, playerId, item_1, item_2]
      };

    try {
      
      const response = await signAndSubmitTransaction(payload);
      console.log(response);
    } 
    catch (error) {
      console.error(error);
    }
  }
    addCraft();
};

const checkRoomStatus = (roomId, setRoomActive, setToast, roomActive) => {
  const config = new AptosConfig({ network: Network.RANDOMNET });
  const aptosClient = new Aptos(config);

  const checkRoom = async () => {
    try {
      const checkRoomResponse = await aptosClient.view({
        payload: {
          function: `${'0x60e5a00ffd3cf1ba4323bfa8f5ddbe1dea2c8f817607a5f89a32b28e5f16d37e'}::dapp::get_room`,
          functionArguments: [roomId.toString()],
        },
      });

      const room = checkRoomResponse[0] as { active?: boolean, players_list?: [] };
      setToast({
        visible: false,
        title: '',
        description: ''
      });

      if (room && room.active == true) {
        console.log(room.players_list);
        setRoomActive(true);
      } 
      if (room && room.players_list && Number(room.players_list.length) === 5 && !roomActive) {
        UpdateRoom(roomId)
      }
      else {
        console.log(room);
        localStorage.removeItem('gameState');
      }
    } catch (error) {
      console.error('Error checking room status:', error);
      if (error instanceof Error && error.message){
        if (error.message.includes('Cannot read properties of null')) {
        setToast({
          visible: true,
          title: 'Room fetch Failed',
          description: 'Cannot get Connected Room. Go to Dashboard to join a Room'
        });
      }
      else if(error.message.includes('Network Error')){
        setToast({
          visible: true,
          title: 'Room fetch Failed',
          description: 'Network Error. Re-connect to the internet and reload'
        });
        }
    }
      if (error instanceof Error && error.message){
        if (error.message.includes('Failed to execute function')) {
          setToast({
            visible: true,
            title: 'Room fetch Failed',
            description: 'Room ID Does not exist. Please join a new room'
          });
        localStorage.removeItem('activeRoomId');
        }
      }
    }
  };

  checkRoom();
};






const useFetchRoomGrid = (roomId, setRoomGrid, dependency, setDependency) => {
  const config = new AptosConfig({ network: Network.RANDOMNET });
  const aptosClient = new Aptos(config);

  useEffect(() => {
    const fetchRoomGrid = async () => {
      try {
        const roomGrid = await aptosClient.view({
          payload: {
            function: `${'0x60e5a00ffd3cf1ba4323bfa8f5ddbe1dea2c8f817607a5f89a32b28e5f16d37e'}::dapp::get_room`,
            functionArguments: [roomId.toString()],
          },
        });

        console.log(roomGrid)
        setRoomGrid(roomGrid.flat());
      } catch (error) {
        if (error instanceof Error && error.message){
          if (error.message.includes('Network Error')) {
            alert("Network Error. Please reconnect and Reload the Room!")
          }
        }
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

const currentTurnTimer = (setCountdown, setTurnEnded, roomActive) => {
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

if (roomActive) {
    countdownTimer = setInterval(handleCountdown, 1000);

    return () => clearInterval(countdownTimer);
}
  }, [setCountdown, setTurnEnded, roomActive]);
};

const roomUpdateLogic = (countdown,
   simulating, setSimulating, setCountdown, setTurn,
    setDependency, turn, dependency, roomId, setToast, roomActive) => {

      useEffect(() => {
        const gameStateString = localStorage.getItem('gameState');
        if (gameStateString !== null) {
          const gameState = JSON.parse(gameStateString);
          const lastUpdated = gameState.lastUpdated || Date.now();
          let elapsedTime = Date.now() - lastUpdated;
      
          // Calculate the current turn based on elapsed time and stored countdown
          let currentTurn = gameState.turn || 1;
          let remainingTime = gameState.countdown || 20;
          let isSimulating = gameState.simulating || false;
      
          // Deduct the remaining countdown from the elapsed time
          elapsedTime -= (30 - remainingTime) * 1000; // Convert seconds to milliseconds
      
          // Increment turns for each 20-second block
          while (elapsedTime >= 30 * 1000) {
            currentTurn++;
            elapsedTime -= 30 * 1000;
          }
      
          // If the remaining time is less than or equal to 10 seconds, start simulating
          if (remainingTime <= 10) {
            isSimulating = true;
            // If it ends during simulation, increment the turn
            if (remainingTime === 0) {
              currentTurn++;
              remainingTime = 20; // Reset countdown for the next turn
            }
          }
      
          // Update state values
          setTurn(currentTurn);
          setCountdown(remainingTime);
          setSimulating(isSimulating);
          setDependency(gameState.dependency || true);
        } else {
          // No gameState found, initialize with default values
          setTurn(1);
          setCountdown(20);
          setSimulating(false);
          setDependency(true);
        }
      }, []);
      
  
  
  

  useEffect(() => {
    if (countdown === 0 && !simulating && roomActive) {
      console.log("ive been run agn")
      // Start simulation
      setSimulating(true);
      setToast({
        visible: false,
        title: '',
        description: ''
      });
      setCountdown(10);
      console.log('Simulation started...');
      UpdateRoom(roomId)
      setDependency(true);

      // Update the UI to indicate simulation
      setTimeout(() => {
        // End simulation
        setSimulating(false);
        setToast({
          visible: false,
          title: '',
          description: ''
        });
        // Increment turn
        setTurn(prevTurn => prevTurn + 1);
        setDependency(false);
        // Start countdown for the next turn
        setCountdown(20);
       // currentTurnTimer(setCountdown, setTurnEnded, roomActive)
      }, 10000); // Simulate for 10 seconds
    }
    
    // Update local storage with current game state and lastUpdated time
    localStorage.setItem('gameState', JSON.stringify({ countdown, simulating, turn, dependency, lastUpdated: Date.now() }));
  }, [countdown, simulating, setSimulating, setCountdown, setTurn, setDependency]);

  useEffect(() => {
    if (countdown === 0 && simulating) {
        // End simulation
        setSimulating(false);
        // Increment turn
        setTurn(prevTurn => prevTurn + 1);
        setDependency(false);
        setCountdown(20);
    }
    localStorage.setItem('gameState', JSON.stringify({ countdown, simulating, turn, dependency, lastUpdated: Date.now() }));
  }, [countdown, simulating, setSimulating, setCountdown, setTurn, setDependency]);

};


// const updateRoom = (roomId) => {
//   const config = new AptosConfig({ network: Network.RANDOMNET });
//   const aptosClient = new Aptos(config);

//   useEffect(() => {
//     const updatingRoom = async () => {
//       try {
//         const update = await aptosClient.view({
//           payload: {
//             function: `${'0xc0a4a8ac1b69d25e7595f69d04580ca77f3d604e235ca4f89dc97b156a61ef30'}::dapp::update_room`,
//             functionArguments: [roomId.toString()],
//           },
//         });
//       } catch (error) {
//         console.error('Error Updating Room:', error);
//       }
//     };
//   }, []);
// };



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

const handleCellClick = (row: number, col: number, roomGrid, playerAddress, roomId, signAndSubmitTransaction, turnEnded, countdown, setAddPlayerInputComponent, simulating, setToast) => {
  if (simulating) {
    setToast({
      visible: true,
      title: "Cannot Move",
      description: "Please wait for Room to finish Simulating before Moving"
    });
    return;
  }

  if(playerAddress == undefined){
    setToast({
      visible: true,
      title: "Wallet not Connected",
      description: "You need to first connect your wallet to the Room!"
    });
    return;
  }

  const currentPlayerPosition = getPlayerPosition(roomGrid, playerAddress);
  const newPosition = calculateNewPosition(currentPlayerPosition, row, col, setToast);
  console.log(newPosition)

  if (newPosition) {
    const { row: newRow, col: newCol } = newPosition;
    const updatedcol = newCol + 1;
    console.log("updated col", updatedcol)
    console.log("newRow", newRow)

    console.log(roomGrid[0].items_list.some(item => Math.floor(item.position.x) === newRow && Math.floor(item.position.y) === updatedcol));
    if(roomGrid[0].players_list.some(player => player.position.x === newRow && player.position.y === updatedcol)) {
      setToast({
        visible: true,
        title: "Invalid Move",
        description: "Another player is occupying this cell. You cannot move here!"
      });
      return;
    }

    else {
      if(roomGrid[0].items_list.some(item => Math.floor(item.position.x) === newRow && Math.floor(item.position.y) === updatedcol)){
        setToast({
          visible: true,
          title: "Item Found",
          description: "You have found an Item. Going into Inventory after Move"
        });
      }
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

  if (!currentPlayer) {
    return null;
  }
  const playerPosition = currentPlayer.players_list.find(player => player.address === playerAddress)?.position;

  console.log("playerPosition", playerPosition)

  if (!playerPosition) {
    return null;
  }
  const row = parseInt(playerPosition.x);
const dummycol = Math.ceil(parseFloat(playerPosition.y));
console.log(dummycol);

let col;
if(dummycol == 0){
  col = 0;
}
else if (dummycol > 11){
  col = dummycol - 2;
}
else{
  col = dummycol - 1;
}
// const col = dummycol - 1;

console.log(col);
  return { row, col };
};

const calculateNewPosition = (currentPlayerPosition, row, col, setToast) => {

  console.log(currentPlayerPosition)
  if (!currentPlayerPosition) {
    setToast({
      visible: true,
      title: "Player not Connected",
      description: "Please Connect your Address before trying to Move!"
    });
    return null;
  }
  const { row: currentRow, col: currentCol } = currentPlayerPosition;

  const rowDiff = row - currentRow;
  const colDiff = col - currentCol;

  console.log(rowDiff, row, currentRow);
  console.log(colDiff, col, currentCol);

  // Check if the clicked cell is one cell away vertically or horizontally
  if ((Math.abs(rowDiff) === 1 && colDiff === 0) || (Math.abs(colDiff) === 1 && rowDiff === 0)) {
    return { row: row, col: col };
  } else {
    // alert('You can only move one cell up, down, left, or right from your current position.');
    setToast({
      visible: true,
      title: "Invalid Move",
      description: "You can only move one cell UP, DOWN, LEFT, or RIGHT from your current position."
    });
    return null;
  }
};


const CameraFrame = () => {
  const { camera } = useThree();
  const targetPosition = new Vector3(-2, 6, 23);
const initialPosition = new Vector3(0, 15, 100)
  const zoomDuration = 3000;
  const [animationEnded, setAnimationEnded] = useState(false);
  const animationEndedRef = useRef(false);

  useEffect(() => {
    // Set initial camera position
    camera.position.copy(initialPosition);
  }, []); // Run only once when component mounts

  useEffect(() => {
    if (animationEndedRef.current) return;

    const startTime = Date.now();

    const animateCamera = () => {
      const currentTime = Date.now();
      const elapsedTime = currentTime - startTime;
      const t = Math.min(1, elapsedTime / zoomDuration);

      const newPosition = initialPosition.clone().lerp(targetPosition, t);
      camera.position.copy(newPosition);

      if (camera.position.distanceTo(targetPosition) < 0.1) {
        animationEndedRef.current = true;
        setAnimationEnded(true);
      } else {
        requestAnimationFrame(animateCamera);
      }
    };

    animateCamera();

    return () => {
      animationEndedRef.current = true;
    };
  }, [camera]);

  return null;
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

const CanvasEffect = ({ navigate, setToast }) => {
  const [roomOpened, setRoomOpened] = useState(false);
  let retryTimeout;

  const openRoomWithRetry = () => {
    if (roomOpened) return;

    const newWindow = window.open('/room', '_blank');
    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
      setToast({
        visible: true,
        title: 'Cannot open Room',
        description: 'Popup was blocked. Please allow popups for this site.',
      });
      retryTimeout = setTimeout(openRoomWithRetry, 5000);
    } else {
      // Reset the toast visibility
      setToast({ visible: false, title: '', description: '' });
      setRoomOpened(true);
      console.log("room is now opened, should't open again")
    }
  };

  useEffect(() => {
    retryTimeout = setTimeout(openRoomWithRetry, 5000);
    return () => {
      clearTimeout(retryTimeout);
    };
  }, []);

  return null;
};

export default Room;
