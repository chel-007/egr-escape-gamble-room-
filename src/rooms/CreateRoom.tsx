import React, { useEffect } from 'react';
import { Types, Provider } from "aptos";
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import { useWallet } from "@aptos-labs/wallet-adapter-react";


const createRoom = async (setIsLoading) => {
    const config = new AptosConfig({ network: Network.RANDOMNET });
    const aptosClient = new Aptos(config);
    const { isLoading, account, connected } = useWallet();
    const { signAndSubmitTransaction, signTransaction } = useWallet();

    setIsLoading(true);

    

    try {
        const response = await signAndSubmitTransaction({
          sender: account?.address,
          data: {
            function: `${'0x26b0ab8afb0b67adcbeab1d1f04ef8d067c5b7b8f0ee65e23994bf3d00a4506f'}::main::create_aptogotchi`,
            typeArguments: [],
            functionArguments: [],
          },
        });
        await aptosClient
          .waitForTransaction({
            transactionHash: response.hash,
          })
          .then(() => {
            console.log("Transaction committed successfully", response);
          });
      } catch (error: any) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
};


  export default createRoom;

// const CreateRoom = ({ setRooms, setIsLoading }) => {

//     const config = new AptosConfig({ network: Network.RANDOMNET });
//     const aptosClient = new Aptos(config);

//     useEffect(() => {

//     const createRoom = async () => {
//     setIsLoading(true);

//     try {

//     const room = (await aptosClient.view({
//         payload: {
//           function: `${'0x26b0ab8afb0b67adcbeab1d1f04ef8d067c5b7b8f0ee65e23994bf3d00a4506f'}::dapp::create_room`,
//         },
//       }));

//         console.log(room)

//     } catch (error) {

//         console.error('Error creating room:', error);

//     } finally {

//         setIsLoading(false);

//     }
//     };

//     createRoom();
//     }, [setRooms, setIsLoading]);

//   return null;
// };

// export default CreateRoom;
