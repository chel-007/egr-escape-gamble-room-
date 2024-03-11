import { Types } from "aptos";
import Notification from "../Notification";
import { useState } from "react";

export default function useAddPlayerInput (playerAddress, roomId, newPosition, signAndSubmitTransaction, countdown) {
    const { row, col } = newPosition;
    console.log(row, col);
    let count = countdown - 1;
    let countdownEnded = false;
    let showNotification = true;

    const addPlayerInput = async () => {

      const payload: Types.TransactionPayload = {
        type: "entry_function_payload",
        function: `${'0xc0a4a8ac1b69d25e7595f69d04580ca77f3d604e235ca4f89dc97b156a61ef30'}::dapp::add_player_input`,
        type_arguments: [],
        arguments: [playerAddress, roomId, row, col]
      };

      
      let response;
      try {
        const countdownAlertInterval = setInterval(() => {
            
            if (count === 5 && response == undefined) {
                showNotification = true;
            }
        }, 1000);

        response = await signAndSubmitTransaction(payload);

        console.log(response);
        alert("Move Played Successfully");
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

    // addPlayerInput();
    const startCountdown = () => {
        const countdownInterval = setInterval(() => {
          if (count === 0) {
            clearInterval(countdownInterval);
            countdownEnded = true;
            console.log("Countdown ended. Cannot make move.");
            return;
          }
          console.log(count);
          count--;
        }, 1000);
    
        // Start player move if countdown is ongoing
        if (countdown > 0) {
          addPlayerInput();
        }
        else {

        }
      };

    startCountdown();

    return (
        <div style={{position: 'absolute', zIndex: '10', backgroundColor: 'white', width: '40%', height: '30px'}}>
          {/* Render the Notification component if showNotification is true */}
          {/* {<Notification message="Please send the transaction soon to execute the move." />} */}
          <p style={{fontSize: '40px'}}>hey</p>
        </div>
      );
    

};