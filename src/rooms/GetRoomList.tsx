import React, { useState, useEffect } from 'react';
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import Toast from "../components/ui/new-toast";
// require('dotenv').config();
const GetRoomList = ({ setRooms, setIsLoading }) => {

    const config = new AptosConfig({ network: Network.RANDOMNET });
    const aptosClient = new Aptos(config);
    const [toastVisible, setToastVisible] = useState(false);

    useEffect(() => {
        const fetchRooms = async () => {
            setIsLoading(true);

            try {
                const roomsResponse = await aptosClient.view({
                    payload: {
                        function: `${'0x0d17fdba4bd420569cb5b7a086a2d4b7e4a5857c89b846c6e795dd5b0fd4c217'}::dapp::get_rooms`,
                    },
                });
                

                // Flatten the array of arrays
                setToastVisible(true)

                setRooms(roomsResponse);  
                console.log("was i run agn") 
                setIsLoading(false)       
            } catch (error) {
                console.error('Error fetching room list:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRooms();
    }, [setRooms, setIsLoading]);

    // Return something meaningful here, depending on your use case
    return null;
};

export default GetRoomList;
