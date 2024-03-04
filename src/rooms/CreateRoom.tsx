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
        function: `${'0x26b0ab8afb0b67adcbeab1d1f04ef8d067c5b7b8f0ee65e23994bf3d00a4506f'}::dapp::create_room`,
        type_arguments: [],
        arguments: []
    }
      try {
        
        let response = await signAndSubmitTransaction(payload);

        console.log(response)
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
