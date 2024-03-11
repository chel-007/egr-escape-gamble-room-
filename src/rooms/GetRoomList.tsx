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
                        function: `${'0xc0a4a8ac1b69d25e7595f69d04580ca77f3d604e235ca4f89dc97b156a61ef30'}::dapp::get_rooms`,
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
