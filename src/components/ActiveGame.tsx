// ActiveGame.js

import React, { useEffect, useState } from 'react';
import Room from './Game/Room';

const ActiveGame = () => {
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);

  useEffect(() => {
    // Check if there's an active room ID in local storage
    const storedRoomId = localStorage.getItem('activeRoomId');
    console.log(storedRoomId)
    if (storedRoomId) {
      // clearStoredRoomId();
      // setActiveRoomId(null)
      setActiveRoomId(storedRoomId);
    }
    // if(!storedRoomId){
    //   localStorage.setItem('activeRoomId', '0');
    // }
  }, []);

  const clearStoredRoomId = () => {
    // Remove the stored room ID from localStorage
    localStorage.removeItem('activeRoomId');
    // Update state to reflect the removal (if needed)
    setActiveRoomId(null);
  };

  // console.log(activeRoomId)

  return activeRoomId ? <Room roomId={activeRoomId} /> : null;
};

export default ActiveGame;

// else {
//     const roomIdForTesting = '2';
//     localStorage.setItem('activeRoomId', roomIdForTesting);
//     setActiveRoomId(roomIdForTesting);
//   }