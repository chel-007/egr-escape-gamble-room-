import React, { useState, useEffect } from 'react';
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

const GetRoomList = ({ setRooms, setIsLoading }) => {

    const config = new AptosConfig({ network: Network.RANDOMNET });
    const aptosClient = new Aptos(config);

    useEffect(() => {
        const fetchRooms = async () => {
            setIsLoading(true);

            try {
                const roomsResponse = await aptosClient.view({
                    payload: {
                        function: `${'0x26b0ab8afb0b67adcbeab1d1f04ef8d067c5b7b8f0ee65e23994bf3d00a4506f'}::dapp::get_rooms`,
                    },
                });

                // Flatten the array of arrays
                

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
    return null;
};

export default GetRoomList;
