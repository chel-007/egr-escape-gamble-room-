import React, { useState, useEffect } from 'react';
import { Types } from "aptos";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import classes from '../components/Dashboard/Dashboard.module.css';

const JoinRoom = ({ detailedRoom, roomId, setIsLoading }) => {
  const { account, isLoading, signAndSubmitTransaction } = useWallet();

  const handleJoinRoom = async () => {
    setIsLoading(true);

    const payload: Types.TransactionPayload = {
      type: "entry_function_payload",
      function: `${'0x26b0ab8afb0b67adcbeab1d1f04ef8d067c5b7b8f0ee65e23994bf3d00a4506f'}::dapp::add_player`,
      type_arguments: [],
      arguments: [
        account?.address,
        detailedRoom.id,
        0,
        0
      ]
    };

    try {
      let response = await signAndSubmitTransaction(payload);
      console.log(response);
    } catch (error) {
      console.error('Error encountered', error);
      if (error === "WalletNotConnectedError") {
        alert("Connect Wallet before trying to Join Room");
      }
    } finally {
      setIsLoading(false);
    }
  };

  console.log(detailedRoom[roomId].players_list);

return (
    <div>
      {detailedRoom[roomId].players_list.some(player => player.address === account?.address) ? (
        <button className={classes.roomStatusJoined} disabled>Joined</button>
      ) : (
        <button className={classes.roomStatusJoin} onClick={handleJoinRoom}>Join</button>
      )}
    </div>
  );
};

export default JoinRoom;
