import React, { useState } from 'react';
import { Types } from "aptos";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import classes from '../components/Dashboard/Dashboard.module.css';
import Room from '../components/Game/Room';

const JoinRoom = ({ detailedRoom, roomId, setIsLoading }) => {
  const { account, signAndSubmitTransaction } = useWallet();
  const [isPending, setIsPending] = useState(false);
  const [isJoined, setIsJoined] = useState(false);

  const handleJoinRoom = async () => {
    setIsPending(true);
    setIsJoined(false);

    const payload: Types.TransactionPayload = {
      type: "entry_function_payload",
      function: `${'0xc0a4a8ac1b69d25e7595f69d04580ca77f3d604e235ca4f89dc97b156a61ef30'}::dapp::add_player`,
      type_arguments: [],
      arguments: [
        account?.address,
        roomId,
      ]
    };

    try {
      let response = await signAndSubmitTransaction(payload);

      if (response.success) {
        setIsJoined(true);
        localStorage.setItem('activeRoomId', roomId);
      }
    } catch (error) {
      console.error('Error encountered', error);
      if (error === "WalletNotConnectedError") {
        alert("Connect Wallet before trying to Join Room");
      }
      setIsJoined(false);
    } finally {
      setIsJoined(true);
      console.log(isJoined);
      setIsPending(false);
      setIsLoading(false);
    }
  };

  return (
    <div>
      {isJoined ? (
        <Room roomId={roomId} />
      ) : (
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
