import React, { useEffect, useState } from 'react';
import { Aptos, AptosConfig, MoveValue, Network } from "@aptos-labs/ts-sdk";

const GetRoomByID = ({ setDetailedRooms, setIsLoading }) => {
    const [rooms, setRooms] = useState<any[]>([]); // Assuming room type here
    const config = new AptosConfig({ network: Network.RANDOMNET });
    const aptosClient = new Aptos(config);

    useEffect(() => {
        const fetchRooms = async () => {
            setIsLoading(true);      

        try {
                const roomsResponse: { id: number }[] = await aptosClient.view({
                    payload: {
                        function: `${'0x0d17fdba4bd420569cb5b7a086a2d4b7e4a5857c89b846c6e795dd5b0fd4c217'}::dapp::get_rooms`,
                    },
                });

                setRooms(roomsResponse);



            let detailedRooms: MoveValue[] = [];
            
        
            for (const room of roomsResponse.flat()) {
                try {
                    const detailedRoom = await aptosClient.view({
                        payload: {
                            function: `${'0x0d17fdba4bd420569cb5b7a086a2d4b7e4a5857c89b846c6e795dd5b0fd4c217'}::dapp::get_room`,
                            functionArguments: [room.id.toString()],
                        },
                    });
                    detailedRooms.push(detailedRoom);
                } catch (error) {
                    console.error(`Error fetching details for room ${room.id}:`, error);
                }
            }
            setDetailedRooms(detailedRooms.flat());
        } catch (error) {
            console.error('Error fetching room details:', error);
        } finally {
            setIsLoading(false);
        }
        };

        fetchRooms();
    }, [setDetailedRooms, setIsLoading]);

    return null;
};

export default GetRoomByID;
