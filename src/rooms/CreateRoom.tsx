import React from 'react';
import { Types, Provider } from "aptos";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import classes from '../components/Dashboard/Dashboard.module.css';
    
export default function CreateRoom(props: {
  isTxnInProgress: boolean;
  setTxn: (isTxnInProgress: boolean) => void;
}) {
  // wallet state
  const { signAndSubmitTransaction } = useWallet();
  const createRoom = async () => {

    props.setTxn(true);
    const payload: Types.TransactionPayload = {
      type: "entry_function_payload",
        function: `${'0xc0a4a8ac1b69d25e7595f69d04580ca77f3d604e235ca4f89dc97b156a61ef30'}::dapp::create_room`,
        type_arguments: [],
        arguments: []
    }
      try {
        
        let response = await signAndSubmitTransaction(payload);

        console.log(response)
        alert("You have successfully created a new room");
      } catch (error) {
        console.log(error);
        if (error === "WalletNotConnectedError") {
          alert("Connect Wallet before trying to Create Room");
        }
        props.setTxn(false);
        return;
      }
      props.setTxn(false);

  };

  return (
      <button className={classes.createRoomBtn} 
        onClick={() => createRoom()}>CREATE NEWROOM
      </button>
  );
}
