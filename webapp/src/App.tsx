/*
Copyright (c) 2022 Shreepad Shukla
SPDX-License-Identifier: AGPL-3.0-only
*/

import React, {useEffect, useState} from 'react';
import './App.css';

import init from 'teams_sched'
import { SchybridComponent } from './Schybrid'

function App() {

  // Track wasm load state using useEffect
  const [wasmLoaded, setWasmLoaded] = useState(false);

  useEffect(() => { 

    const fetchWasm = async () => {
      await init();
      setWasmLoaded(true);
    };

    if (!wasmLoaded) {
      fetchWasm();
    }

  }, [wasmLoaded]);

  // Render based on wasmLoaded
  return (
    <div className="App">
      <div className="schyrbid-wrapper">
          {wasmLoaded ? <SchybridComponent /> : <WasmLoadingComponent /> }
      </div>
    </div>
  );
}

// Flippy spinny loading WASM message
function WasmLoadingComponent() {
  return (
    <div> Loading WASM... </div>
  );
}

export default App;
