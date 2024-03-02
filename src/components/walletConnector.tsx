import { WalletReadyState, useWallet } from "@aptos-labs/wallet-adapter-react";
import { useEffect, useState } from "react";
import { FaucetClient} from "aptos";
import { Network } from "@aptos-labs/ts-sdk";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "./ui/dialog";
  import { BalanceIcon } from './Dashboard/BalanceIcon';
  import classes from './Dashboard/Dashboard.module.css';
  import { DividerIcon } from './Dashboard/DividerIcon';
  import { DollarIcon } from './Dashboard/DollarIcon';


export default function WalletConnector(props: { isTxnInProgress?: boolean }) {

    const { connect, account, connected, disconnect, wallets, isLoading } = useWallet();
    const [balance, setBalance] = useState<string | undefined>(undefined);
    const [isFaucetLoading, setIsFaucetLoading] = useState(false);

    console.log(useWallet())
    console.log(account)
    useEffect(() => {
        if (connected && account) {
          ensureAccountExists().then(() => {
            getBalance(account.address);
          });
        }
      }, [connected, account, props.isTxnInProgress, isFaucetLoading]);



    const ensureAccountExists = async () => {
                try {
                  const response = await fetch (
                    `https://fullnode.random.aptoslabs.com/v1/accounts/${account?.address}`,
                    {
                      method: 'GET'
                    }
                  );
                  const data = await response.json();
                  if (data.error_code === 'account_not_found') {
                    await initializeAccount();
                  }
                } catch (error) {
                  console.error('Error checking account:', error);
                }
    }



    const initializeAccount = async () => {
        if (!connected || !account || props.isTxnInProgress || isFaucetLoading) return;
        setIsFaucetLoading(true);

        const faucetClient = new FaucetClient(Network.RANDOMNET, "https://fullnode.random.aptoslabs.com");
        try {
          await faucetClient.fundAccount(account.address, 1);
        } catch (error) {
          console.error('Error funding account:', error);
        } 

        finally {
          setIsFaucetLoading(false);
        }
    
    
      }


    const getBalance = async (address: string) => {
    
              const body = {
                function:
                  "0x1::coin::balance",
                type_arguments: ["0x1::aptos_coin::AptosCoin"],
                arguments: [address],
              };
            
              let res;
              try {
                res = await fetch(
                  `https://fullnode.random.aptoslabs.com/v1/view`,
                  {
                    method: 'POST',
                    body: JSON.stringify(body),
                    headers: {
                      "Content-Type": "application/json",
                      Accept: "application/json",
                    },
                  }
                )
              } catch (e) {
                setBalance("0");
                return;
              }
            
              const data = await res.json();
            
              setBalance((data / 100000000).toLocaleString());
    
            
       
    
      };

      return (
        <div>
          {!connected && !isLoading && (
            <Dialog>
              <DialogTrigger asChild>
              <div className={classes.connectwalletBg}>
                <div className={classes.dollar}>
                    <DollarIcon className={classes.icon12} />
                </div>
                <div className={classes.loginText}>Connect Wallet</div>
            </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Connect your wallet</DialogTitle>
                  {
                wallets.map((wallet) => (
                    <div key={wallet.name} className="flex w-full items-center justify-between rounded-xl p-2">
                    <h1>{wallet.name}</h1>
                    {wallet.readyState === WalletReadyState.Installed ? (
                    <button onClick={() => connect(wallet.name)}>
                        Connect
                    </button>
                    ) : (
                    <a href={wallet.url} target="_blank">
                        <button>Install</button>
                    </a>
                    )}
                </div>
                ))
                }        
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )}

        {isLoading && (
        <div className={classes.balance}>
            <BalanceIcon className={classes.icon13} />
            Loading ...
        </div>
        )}

        {
        connected && account ? (
        <div className={classes.connect}>
            <div className={classes.balance}>
                <BalanceIcon className={classes.icon13} />
                {balance} APT | {account.address.slice(0, 5)}...{account.address.slice(-4)}
            </div>

            <div className={classes.connectwalletBg}>
                <div className={classes.dollar}>
                    <DollarIcon className={classes.icon12} />
                </div>
                <div className={classes.loginText} onClick={disconnect}>Disconnect</div>
 
            </div>
        </div>
        ) : null
        }
          </div>
        );


}