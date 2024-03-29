import React, { useState, useEffect } from 'react';
import { Types } from "aptos";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import classes from '../components/Dashboard/Dashboard.module.css';
import Room from '../components/Game/Room';

const JoinRoom = ({ detailedRoom, roomId, setIsLoading }) => {
  const { account, signAndSubmitTransaction } = useWallet();
  const [isPending, setIsPending] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);


  useEffect(() => {
    // Check if there's an active room ID in local storage
    const storedRoomId = localStorage.getItem('activeRoomId');
    if (storedRoomId) {
      setActiveRoomId(storedRoomId);
    }
  }, []);


  const handleJoinRoom = async () => {
    if (activeRoomId) {
      alert('You are already in a room.');
      return;
    }

    setIsPending(true);
    setIsJoined(false);

    const payload: Types.TransactionPayload = {
      type: "entry_function_payload",
      function: `${'0x0d17fdba4bd420569cb5b7a086a2d4b7e4a5857c89b846c6e795dd5b0fd4c217'}::dapp::add_player`,
      type_arguments: [],
      arguments: [
        account?.address,
        roomId,
      ]
    };

    try {
      let response = await signAndSubmitTransaction(payload);

      if (response.success) {
        console.log("setJoined should be true")
        setIsJoined(true);
        localStorage.setItem('activeRoomId', roomId);
      }
    } catch (error) {
      console.error('Error encountered', error);
      if (error === "WalletNotConnectedError") {
        alert("Connect Wallet before trying to Join Room");
      }
      setIsJoined(false);
    }
  };

  return (
    <div>
      {isJoined ? (
        <Room roomId={roomId} />
      ) : (
        detailedRoom[roomId].players_list.length === 5 ? (
          <button className={classes.roomStatusJoined} disabled>Full</button>
        ) :
        detailedRoom[roomId].players_list.some(player => player.address === account?.address) ? (
            <button className={classes.roomStatusJoined} disabled>Joined</button>
          ) : (
          <button className={classes.roomStatusJoin} disabled={isPending} onClick={handleJoinRoom}>
            {isPending ? 'Joining...' : 'Join'}
          </button>
        )
      )}
    </div>
  );
};

export default JoinRoom;
