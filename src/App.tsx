import React from 'react';
import { memo } from 'react';
import type { FC } from 'react';
import classes from './App.module.css';
import resets from './components/_resets.module.css';
import { TV1 } from './components/TV1/TV1';
import { Dashboard } from './components/Dashboard/Dashboard';
import Room from './components/Game/Room';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { PetraWallet } from "petra-plugin-wallet-adapter";
import { MartianWallet } from "@martianwallet/aptos-wallet-adapter";
import {
  AptosWalletAdapterProvider,
} from "@aptos-labs/wallet-adapter-react";

interface Props {
  className?: string;
}
export const App: FC<Props> = memo(function App(props = {}) {
  const wallets = [new PetraWallet()];
  
  return (
    <AptosWalletAdapterProvider plugins={wallets} autoConnect={true}>
    <Router>
    <Routes>
    <Route path="/" element={
      <div className={`${resets.clapyResets} ${classes.root}`}>
        <TV1 />
      </div>
    }
    />
    <Route path="/dashboard" element={
      <Dashboard />
      } />
    <Route path="/room" element={
      <Room roomId={localStorage.getItem('activeRoomId')} />
      } />
    </Routes>
    </Router>
    </AptosWalletAdapterProvider>
  );
});
