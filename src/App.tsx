import React from 'react';
import { memo } from 'react';
import type { FC } from 'react';

import classes from './App.module.css';
import resets from './components/_resets.module.css';
import { TV1 } from './components/TV1/TV1';
import { Dashboard } from './components/Dashboard/Dashboard';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

interface Props {
  className?: string;
}
export const App: FC<Props> = memo(function App(props = {}) {
  return (
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
    </Routes>
    </Router>
  );
});
