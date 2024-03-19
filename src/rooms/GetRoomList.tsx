import React, { useState, useEffect } from 'react';
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import Toast from "../components/ui/new-toast";
// require('dotenv').config();
const GetRoomList = ({ setRooms, setIsLoading }) => {

    const config = new AptosConfig({ network: Network.RANDOMNET });
    const aptosClient = new Aptos(config);
    const [toastVisible, setToastVisible] = useState(false);

    console.log("from get room")

    useEffect(() => {
        const fetchRooms = async () => {
            setIsLoading(true);

            try {
                const roomsResponse = await aptosClient.view({
                    payload: {
                        function: `${'0x60e5a00ffd3cf1ba4323bfa8f5ddbe1dea2c8f817607a5f89a32b28e5f16d37e'}::dapp::get_rooms`,
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
