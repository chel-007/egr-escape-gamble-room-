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
                        function: `${'0xe5385db1465ff28c87f06296801e4861e238e8927c917e0af5d22151422dd495'}::dapp::get_rooms`,
                    },
                });
                

                // Flatten the array of arrays
                setToastVisible(true)

                setRooms(roomsResponse);          
            } catch (error) {
                console.error('Error fetching room list:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRooms();
    }, [setRooms, setIsLoading]);

    // Return something meaningful here, depending on your use case
    return (
        <>
        {toastVisible && (
            <Toast
            title="Rooms Fetched"
            description="Rooms have been successfully fetched."
        />
        )}
        </>
    );
};

export default GetRoomList;
