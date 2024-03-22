import React, { useRef, MutableRefObject, useEffect, useState, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Box } from '@react-three/drei';
import { Mesh } from 'three';
import * as THREE from 'three';
import { Vector3 } from 'three';
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
import axios from 'axios';
import WalletConnector from '../walletConnector';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { TextureLoader } from 'three';
import Toast from '../../components/ui/new-toast'
import coreImage from '../../assets/core.jpg'
import potionImage from '../../assets/potion.jpg'
import eyeImage from '../../assets/eye.jpg'
import auraImage from '../../assets/aura.jpg'
import fusionImage from '../../assets/fusion.jpg'
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
  const particleSystem = useRef<THREE.Mesh>(null);
  const [turn, setTurn] = useState(1);
  const [countdown, setCountdown] = useState(30);
  const [simulating, setSimulating] = useState(false);
  const [dependency, setDependency] = useState(true)
  const [turnEnded, setTurnEnded] = useState(false);
  const [cellClicked, setCellClicked] = useState(false);
  const [addPlayerInputComponent, setAddPlayerInputComponent] = useState(null);
  const [roomActive, setRoomActive] = useState(false);
  const [toast, setToast] = useState({
    visible: false,
    title: '',
    description: ''
  });
  const [selectedItems, setSelectedItems] = useState([]);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const { account, connected, network, signAndSubmitTransaction } = useWallet();
  const loader = new TextureLoader();
  const coreTexture = loader.load(coreImage);
  const potionTexture = loader.load(potionImage);
  const eyeTexture = loader.load(eyeImage);
  const auraTexture = loader.load(auraImage);
  const fusionTexture = loader.load(fusionImage)
  const chaosTexture = loader.load(chaosImage);

const geometry = new THREE.PlaneGeometry(1, 1);

const material = new THREE.MeshBasicMaterial({ map: coreTexture });
const meshNew = new THREE.Mesh(geometry, material);
meshNew.position.set(0, 0, 0);

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
    1: '../../assets/core.glb',
    2: '../../assets/potion.glb',
    3: '../../assets/eye.glb',
    4: '../../assets/aura.glb', 
    5: '../../assets/fusion.glb',
  };
  
  const gridRef = useRef<Mesh>(null);

  useFetchRoomGrid(roomId, setRoomGrid, dependency, setDependency);
  currentTurnTimer(setCountdown, setTurnEnded, roomActive);
  roomUpdateLogic(roomId, countdown, simulating, setSimulating, setCountdown, 
    setDependency, setToast, roomActive
    )

  useEffect(() => {
    checkRoomStatus(roomId, setRoomActive, setToast, roomActive, setDependency);

    const interval = setInterval(() => {
      if (roomActive) {
        setDependency(true)
        clearInterval(interval);
      }
      console.log("still checking")
      checkRoomStatus(roomId, setRoomActive, setToast, roomActive, setDependency);
    }, 10000);
    return () => clearInterval(interval);
  }, [roomId, checkRoomStatus, roomActive]);  


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
            <div className="turn-info">Make ur Move</div>
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
        const posX = (x * cellSize) + (padding * (x + 1));
        const posY = (y * cellSize) + (padding * (y + 1));
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
            const itemx = parseFloat(item.position.x);
            const itemy = parseFloat(item.position.y)
            const posX = (itemx * cellSize) + (itemx * padding);
            const posY = (itemy * cellSize) + (itemy * padding);

            const colors = ['#ff0000', '#00ff00', '#0000ff'];

            const itemPositionScaleMap = {
              0: { position: [posX, 0.1, posY], scale: [1, 1, 1] },
              1: { position: [posX, 0.3, posY], scale: [0.015, 0.018, 0.015] },
              2: { position: [posX, 0.5, posY], scale: [3, 3, 3] },
              3: { position: [posX, 0.8, posY], scale: [0.6, 0.9, 0.6] }, 
              4: { position: [posX, 0.4, posY], scale: [0.1, 0.1, 0.1] }, 
              5: { position: [posX, 0.4, posY], scale: [0.85, 1.1, 0.85] }, 
            };

            return (
              <Item
              key={`${item.id}-${item.item_code}-${item.position.x}-${item.position.y}`}
              position={itemPositionScaleMap[item.item_code].position}
              scale={itemPositionScaleMap[item.item_code].scale}
              itemCode={item.item_code}
              ItemModels={ItemModels}/>
            );

          })
        )}
    {/* Inventory rendering */}
    <group position={[-4, 5, 12]}>
            {/* Whiteboard */}
            <mesh>
              <boxGeometry args={[5, 8, 0.1]}/>
              <meshStandardMaterial color="white"/>
            </mesh>
            <Text
              position={[0, 3.5, 0.1]}
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
                const y = 2.5 - row * itemSpacing;

                return (
                  <InventoryItem
                  key={`inventory-item-${player.address}-${itemIndex}`}
                  coreTexture={coreTexture}
                  potionTexture={potionTexture}
                  eyeTexture={eyeTexture}
                  auraTexture={auraTexture}
                  fusionTexture={fusionTexture}
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
                position={[0, -3.5, 0.2]}
                onClick={() => handleCraftButtonClick(selectedItems, setSelectedItems, playerId, roomId, signAndSubmitTransaction)}>
               <planeGeometry args={[3, 1]}/>
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
          {cellClicked && addPlayerInputComponent}
          <CanvasFrame boxRef={boxRef}/>
          <CameraFrame/>
          </Canvas>
)}
      {location.pathname !== '/room' && (
        <CanvasEffect navigate={navigate} setToast={setToast} />
      )}
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
      loader.load(ItemModels[itemCode], (gltf) => {
        modelRef.current?.add(gltf.scene);
      });
    }
  }, [itemCode]);

  return (
    <group ref={modelRef} position={position} scale={scale} />
  );
};


const getItemImage = (itemCode, coreTexture, potionTexture, eyeTexture, auraTexture, fusionTexture, chaosTexture) => {
  if(itemCode == 1) {
    return coreTexture;
  }
  else if(itemCode == 2){
    return potionTexture
  }
  else if(itemCode == 3){
    return eyeTexture
  }
  if(itemCode == 4) {
    return auraTexture;
  }
  if(itemCode == 5) {
    return fusionTexture;
  }
  else if(itemCode == 0){
    return chaosTexture
  }
};

  const handleItemClick = (selectedItem, setSelectedItems, selectedItems) => {
    // Check if the selected item is already in the list
    if (!selectedItems.includes(selectedItem)) {
      
      setSelectedItems([...selectedItems, selectedItem]);
    } else {
      setSelectedItems(selectedItems.filter(item => item !== selectedItem));
    }
  };

const InventoryItem = ({ item, position, onClick, coreTexture, potionTexture, eyeTexture, auraTexture, fusionTexture, chaosTexture }) => {
    const [isSelected, setIsSelected] = useState(false);
    const [isItemHovered, setIsItemHovered] = useState(false);

    const meshRef = useRef<Mesh>(null);

    const itemCodeNames = {
      0: 'Chaos',
      1: 'Core',
      2: 'Potion',
      3: 'Eye',
      4: 'Aura',
      5: 'Fusion'
    };

    
    const texture = getItemImage(item, coreTexture, potionTexture, eyeTexture, auraTexture, fusionTexture, chaosTexture);
    // texture.repeat.set(2, 2);
    texture.colorSpace = THREE.sRGBEncoding;
  
    // Function to handle click event
    const handleClick = () => {
      setIsSelected(!isSelected);
      onClick(item);
    };

    const handleMouseEnter = () => {
      setIsItemHovered(true);
  if (meshRef.current && meshRef.current.material instanceof MeshStandardMaterial) {
    meshRef.current.material.color.set(0xff00ff);
    document.body.style.cursor = 'pointer';
  }
    };
  
    const handleMouseLeave = () => {
      setIsItemHovered(false);
      if (meshRef.current && meshRef.current.material instanceof MeshStandardMaterial) {
        meshRef.current.material.color.set(0xffffff);
        document.body.style.cursor = 'auto';
      }
    };
  
    return (
      <React.Fragment>
        <mesh position={position} 
        onClick={handleClick}
        onPointerEnter={handleMouseEnter}
        onPointerLeave={handleMouseLeave}
        ref={meshRef}>
          <planeGeometry args={[1, 1]}/>
          <meshStandardMaterial
            map={texture}
            color={isSelected ? 'darkgray' : 'white'}
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

  const handleCraftButtonClick = (selectedItems, setSelectedItems, playerId, roomId, signAndSubmitTransaction) => {
    
    const item_1 = selectedItems[0];
    const item_2 = selectedItems[1]

    const updatedSelectedItems = selectedItems.filter(item => item !== item_1 && item !== item_2);
    setSelectedItems(updatedSelectedItems);

    const addCraft = async () => {

    const payload: Types.TransactionPayload = {
        type: "entry_function_payload",
        function: `${'0x0d17fdba4bd420569cb5b7a086a2d4b7e4a5857c89b846c6e795dd5b0fd4c217'}::dapp::add_player_craft`,
        type_arguments: [],
        arguments: [roomId, playerId, item_1, item_2]
      };

    try {
      
      const response = await signAndSubmitTransaction(payload);
    } 
    catch (error) {
      console.error(error);
    }
  }
    addCraft();
};

const checkRoomStatus = (roomId, setRoomActive, setToast, roomActive, setDependency) => {
  const config = new AptosConfig({ network: Network.RANDOMNET });
  const aptosClient = new Aptos(config);

  const checkRoom = async () => {
    try {
      const checkRoomResponse = await aptosClient.view({
        payload: {
          function: `${'0x0d17fdba4bd420569cb5b7a086a2d4b7e4a5857c89b846c6e795dd5b0fd4c217'}::dapp::get_room`,
          functionArguments: [roomId.toString()],
        },
      });

      const room = checkRoomResponse[0] as { active?: boolean, players_list?: [], winner?: { vec: any[] } };
      setToast({
        visible: false,
        title: '',
        description: ''
      });

      if (room && room.active == true) {
        setRoomActive(true);
        setDependency(true);
      } 
      if (room.winner && room.winner.vec && room.winner.vec.length === 1) {
        const winnerAddress = room.winner.vec[0];
        setRoomActive(false); // Set room to inactive
        alert(`Player ${winnerAddress} has won the game!`);
        localStorage.removeItem('activeRoomId');
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






const useFetchRoomGrid = (roomId, setRoomGrid, dependency, setRoomActive) => {
  const config = new AptosConfig({ network: Network.RANDOMNET });
  const aptosClient = new Aptos(config);

  useEffect(() => {
    const fetchRoomGrid = async () => {
      try {
        const roomGrid = await aptosClient.view({
          payload: {
            function: `${'0x0d17fdba4bd420569cb5b7a086a2d4b7e4a5857c89b846c6e795dd5b0fd4c217'}::dapp::get_room`,
            functionArguments: [roomId.toString()],
          },
        });

        console.log(roomGrid)
        setRoomGrid(roomGrid.flat());
        // setDependency(false)
        const room = roomGrid[0] as { active?: boolean, players_list?: [], winner?: { vec: any[] } };

        console.log(room.winner && room.winner.vec && room.winner.vec.length === 1)
        if (room.winner && room.winner.vec && room.winner.vec.length === 1) {
          const winnerAddress = room.winner.vec[0];
          setRoomActive(false); // Set room to inactive
          alert(`Player ${winnerAddress} has won the game!`);
          localStorage.removeItem('activeRoomId');
        }

      } catch (error) {
        if (error instanceof Error && error.message){
          if (error.message.includes('Network Error')) {
            alert("Network Error. Please reconnect and Reload the Room!")
          }
        }
        console.error('Error fetching room grid data:', error);
      }
    };
    if(dependency){
      fetchRoomGrid();
    }
    
  }, [dependency]);
};



// const usePositionEntities = (roomGrid, cellSize, padding) => {
//   useEffect(() => {
//     const positionEntities = () => {
//       if (roomGrid) {
//         roomGrid[0].players_list.forEach(player => {
//           const x = parseFloat(player.position.x);
//           const y = parseFloat(player.position.y);
          
//           const posX = (x * cellSize) + (x * padding);
//           const posY = (y * cellSize) + (y * padding);
          
//           player.position.x = posX;
//           player.position.y = posY;
//         });

//           roomGrid[0].items_list.forEach(item => {
//             const itemx = parseFloat(item.position.x);
//             const itemy = parseFloat(item.position.y)
//             const itemposX = (itemx * cellSize) + (itemx * padding);
//             const itemposY = (itemy * cellSize) + (itemy * padding);
            
//             item.position.x = itemposX;
//             item.position.y = itemposY;
//         });

//         console.log(roomGrid);
//       }
//     };
//     positionEntities();
//   }, [roomGrid]);
// };

const currentTurnTimer = (setCountdown, setTurnEnded, roomActive) => {
  useEffect(() => {
    let countdownTimer: ReturnType<typeof setInterval> | undefined = undefined;

    const handleCountdown = () => {
      setCountdown(prevCountdown => {
        if (prevCountdown === 0) {
          clearInterval(countdownTimer);
          setTurnEnded(true);
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

const roomUpdateLogic = (roomId, countdown, simulating, setSimulating, setCountdown, setDependency, setToast, roomActive) => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://resolute-humor-production.up.railway.app/roomTimestamp/${roomId}`);
        //const response = await axios.get(`http://localhost:3001/roomTimestamp/${roomId}`);
        const roomTimestamp = response.data.roomTimestamp || Date.now();
        const elapsedTime = Date.now()- roomTimestamp;

        //const remainingTime = Math.floor((30000 - elapsedTime) / 1000);
        // Calculate the time until the next 30-second interval
        const timeToNextInterval = (40000 - (elapsedTime % 30000));
        const remainingTime = Math.floor(timeToNextInterval / 1000);
        console.log(remainingTime)
        setCountdown(remainingTime);
      } catch (error) {
        console.error('Error fetching room timestamp:', error);
      }
    };

    fetchData();
  }, [roomId, setCountdown, roomActive, countdown]);

  useEffect(() => {
    if (countdown <= 10 && !simulating) {
      // Start simulation
      setSimulating(true);
      setTimeout(() => {
        setDependency(true);
      }, 2000);

      setTimeout(() => {
        // End simulation
        setSimulating(false);
        setToast({
          visible: false,
          title: '',
          description: ''
        });
        setDependency(false);
        setCountdown(30);
      }, 10000);
    }
  }, [countdown, simulating, roomActive, setSimulating, setDependency, setCountdown]);

  useEffect(() => {
    if (countdown === 0 && simulating && roomActive) {
      // End simulation
      setSimulating(false);
      setDependency(false);
      setCountdown(30);
    }
  }, [countdown, simulating, roomActive, setSimulating, setDependency, setCountdown]);
};



const handleCellHover = (gridRef, row: number, col: number, hoverColor: string, defaultColor: string) => {
  // Find the mesh of the hovered cell
  const mesh = gridRef.current?.children[row * 15 + col] as Mesh;
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
  //console.log(newPosition)

  if (newPosition) {
    const { row: newRow, col: newCol } = newPosition;

    const newRowStr = newRow.toString();
    const newColStr = newCol.toString();

    console.log(roomGrid[0].items_list.some(item => item.position.x === newRowStr && item.position.y === newColStr));
    if(roomGrid[0].players_list.some(player => player.position.x === newRowStr && player.position.y === newColStr)) {
      setToast({
        visible: true,
        title: "Invalid Move",
        description: "Another player is occupying this cell. You cannot move here!"
      });
      return;
    }

    else {
      if(roomGrid[0].items_list.some(item => item.position.x === newRowStr && item.position.y === newColStr)){
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
  const col = parseInt(playerPosition.y);

  console.log(row, col)
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

  // const rowDiff = row - currentRow;
  // const colDiff = col - currentCol;

  // console.log(rowDiff, row, currentRow);
  // console.log(colDiff, col, currentCol);

  // // Check if the clicked cell is one cell away vertically or horizontally
  // if ((Math.abs(rowDiff) === 1 && colDiff === 0) || (Math.abs(colDiff) === 1 && rowDiff === 0)) {
  //   return { row: row, col: col };
  const newRow = row;
  const newCol = col;
  console.log(newRow)
  console.log(newCol)

  // Check if the clicked cell is one cell away vertically or horizontally
  if ((Math.abs(newRow - currentRow) === 1 && col === currentCol) || (Math.abs(col - currentCol) === 1 && newRow === currentRow)) {
    return { row: newRow, col: newCol };
  } else {
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
