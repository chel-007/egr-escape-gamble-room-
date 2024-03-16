import { useState } from "react";
import { Types } from "aptos";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import classes from '../components/Dashboard/Dashboard.module.css';
import Toast from "../components/ui/new-toast";
    
export default function CreateRoom(props: {
  isTxnInProgress: boolean;
  setTxn: (isTxnInProgress: boolean) => void;
}) {
  // wallet state
  const { signAndSubmitTransaction } = useWallet();
  const [toast, setToast] = useState({
    visible: false,
    title: '',
    description: ''
  });

  const createRoom = async () => {

    props.setTxn(true);
    const payload: Types.TransactionPayload = {
      type: "entry_function_payload",
        function: `${'0xe5385db1465ff28c87f06296801e4861e238e8927c917e0af5d22151422dd495'}::dapp::create_room`,
        type_arguments: [],
        arguments: []
    }
      try {
        
        let response = await signAndSubmitTransaction(payload);

        setToast({
          visible: true,
          title: 'Room Created',
          description: 'You have successfully created a new room'
        });

        console.log(response)
        alert("You have successfully created a new room");
      } catch (error) {
        console.log(error);
        if (error === "WalletNotConnectedError") {
          setToast({
            visible: true,
            title: 'Room Creation Failed',
            description: 'Connect Your Wallet before trying to Create Room'
          });
        }
        props.setTxn(false);
        return;
      }
      props.setTxn(false);

  };

  return (
    <>
    {toast.visible && (
      <Toast title={toast.title} description={toast.description} />
    )}
      <button className={classes.createRoomBtn} 
        onClick={() => createRoom()}>CREATE NEWROOM
      </button>
    </>
  );
}
