// Un-used Function . Moved to Script

import { useState } from "react";
import { Aptos, Account, AccountAddress, AptosConfig, Network, Ed25519PrivateKey, Ed25519Signature, MultiEd25519Signature } from "@aptos-labs/ts-sdk";

const UpdateRoom = (roomId) => {
  const config = new AptosConfig({ network: Network.RANDOMNET });
  const aptosClient = new Aptos(config);

  console.log(roomId)

  const privateKey = new Ed25519PrivateKey("0xf1f2b0d537cb8de1f89603ebc7cd35ef4811b6aa5d181fdfdb062d523f771f4d");

  const address = AccountAddress.from("0x70a5294493afd96cca25b3b139e62280c9c98c70a8e8e71fe1594a2a64d2b444");

  const handleUpdateRoom = async () => {

    const account = Account.fromPrivateKey({ privateKey, address });
  
    const transaction = await aptosClient.transaction.build.simple({
      sender: '0x70a5294493afd96cca25b3b139e62280c9c98c70a8e8e71fe1594a2a64d2b444',
      data: {
        function: `${'0x0d17fdba4bd420569cb5b7a086a2d4b7e4a5857c89b846c6e795dd5b0fd4c217'}::dapp::update_room`,
        typeArguments: [],
        functionArguments: [roomId.toString()],
      },
    });

    try {

      const committedTransaction = await aptosClient.signAndSubmitTransaction({
        signer: account,
        transaction,
      });

    console.log(committedTransaction)

    console.log("Room update successful!");

    } catch (error) {
      console.error("Error encountered:", error);
        if (error instanceof Error && error.message){
          if (error.message.includes('Network Error')) {
            alert("Network Error. Please reconnect and Reload the Room!")
          }
        }
    }
  };

  handleUpdateRoom();

  return null;
};

export default UpdateRoom;
