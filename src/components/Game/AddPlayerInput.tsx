import { Types } from "aptos";
import Notification from "../Notification";
import { useState } from "react";

export default function useAddPlayerInput (playerAddress, roomId, newPosition, signAndSubmitTransaction, countdown) {
    const { row, col } = newPosition;
    //console.log(row, col);

    const addPlayerInput = async () => {

      const payload: Types.TransactionPayload = {
        type: "entry_function_payload",
        function: `${'0x0d17fdba4bd420569cb5b7a086a2d4b7e4a5857c89b846c6e795dd5b0fd4c217'}::dapp::add_player_input`,
        type_arguments: [],
        arguments: [playerAddress, roomId, row.toString(), col.toString()]
      };

      
      let response;
      try {
        response = await signAndSubmitTransaction(payload);

        console.log(response);
      } catch (error) {
        console.error(error);
        if (error === "WalletNotConnectedError") {
          alert("Connect Wallet before trying to Create Room");
        }
        else{
            console.log("User rejected transaction");
        }
      }
    };
        addPlayerInput();

    return (
        <div style={{position: 'absolute', zIndex: '10', backgroundColor: 'white', width: '40%', height: '30px'}}>
          {/* Render the Notification component if showNotification is true */}
          {/* {<Notification message="Please send the transaction soon to execute the move." />} */}
        </div>
      );
    

};
