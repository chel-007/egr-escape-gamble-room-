import React, { useEffect } from 'react';
import { Aptos, AptosConfig, MoveValue, Network } from "@aptos-labs/ts-sdk";


const GetRoomByID = ({ rooms, setDetailedRooms, setIsLoading }) => {

    const config = new AptosConfig({ network: Network.RANDOMNET });
    const aptosClient = new Aptos(config);

    useEffect(() => {
        const fetchRooms = async () => {
            setIsLoading(true);      

        try {

            let detailedRooms: MoveValue[] = [];
            
            const newRoom = rooms.flat()
            // console.log(newRoom)
        
            for (let i = 0; i < newRoom.length; i++) {
            const detailedRoom = await aptosClient.view({
            payload: {
                function: `${'0xe5385db1465ff28c87f06296801e4861e238e8927c917e0af5d22151422dd495'}::dapp::get_room`,
                functionArguments: [newRoom[i].id.toString()],
            },
        });

          detailedRooms.push(detailedRoom);
    }
        
        setDetailedRooms(detailedRooms.flat());
        console.log(detailedRooms);

            } catch (error) {
                console.error('Error fetching room list:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRooms();
    }, [setDetailedRooms, setIsLoading]);

    return null;
};

export default GetRoomByID;
