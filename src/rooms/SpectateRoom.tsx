import React from 'react';
import { useState, useEffect } from 'react';
import classes from '../components/Dashboard/Dashboard.module.css';

const SpectateRoom = ({ roomId, rooms, setIsLoading }) => {
  const [isActive, setIsActive] = useState(false);

  console.log("called again")

  useEffect(() => {

    const allRooms = rooms.flat();
    // Find the room in the rooms array that matches the roomId
    const room = allRooms.find((room) => room.id === roomId);

    console.log(room)
    console.log(roomId)

    // If the room is found, set isActive based on its active status
    if (room) {
       setIsActive(room.active);
    }
  }, [roomId, rooms]);

  const handleSpectateClick = () => {
    alert("Feature Coming Soon")
    setIsLoading(true);
    setIsLoading(false);
  };

  return (
    <div>
      {isActive ? (
        <button className={classes.roomStatusJoin} onClick={handleSpectateClick}>
          Spectate
        </button>
      ) : (
        <button className={classes.roomStatusJoined} disabled>
          Inactive
        </button>
      )}
    </div>
  );
};

export default SpectateRoom;
