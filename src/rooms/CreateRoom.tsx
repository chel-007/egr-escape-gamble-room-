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
        function: `${'0x0d17fdba4bd420569cb5b7a086a2d4b7e4a5857c89b846c6e795dd5b0fd4c217'}::dapp::create_room`,
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
